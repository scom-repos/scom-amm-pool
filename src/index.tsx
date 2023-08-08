import { customModule, Module, Styles, Button, Container, customElements, ControlElement, VStack, Tabs, HStack, application } from '@ijstech/components';
import { Constants, IEventBusRegistry, Wallet } from '@ijstech/eth-wallet';
import { INetworkConfig, IPoolConfig, IProviderUI, ModeType, ICommissionInfo, ICustomTokenObject } from './global/index';
import { State, isClientWalletConnected } from './store/index';
import { poolStyle } from './index.css';
import { ChainNativeTokenByChainId, DefaultERC20Tokens } from '@scom/scom-token-list';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
import getDexList from '@scom/scom-dex-list';
import { ScomAmmPoolAdd, ScomAmmPoolRemove } from './liquidity/index';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import configData from './data.json';
import formSchema from './formSchema.json';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolElement extends ControlElement {
  lazyLoad?: boolean;
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  mode: ModeType;
  commissions?: ICommissionInfo[]
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-amm-pool"]: ScomAmmPoolElement;
    }
  }
}

@customModule
@customElements('i-scom-amm-pool')
export default class ScomAmmPool extends Module {
  private state: State;
  private dappContainer: ScomDappContainer;
  private vStackAmmPool: VStack;
  private poolAdd: ScomAmmPoolAdd;
  private poolRemove: ScomAmmPoolRemove;
  private mdWallet: ScomWalletModal;

  private _data: IPoolConfig = {
    providers: [],
    tokens: [],
    defaultChainId: 0,
    wallets: [],
    networks: [],
    mode: 'add'
  }
  tag: any = {};
  private rpcWalletEvents: IEventBusRegistry[] = [];

  constructor(parent?: Container, options?: ScomAmmPoolElement) {
    super(parent, options);
  }

  static async create(options?: ScomAmmPoolElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  private get chainId() {
    return this.state.getChainId();
  }

  private get rpcWallet() {
    return this.state.getRpcWallet();
  }

  get providers() {
    return this._data.providers;
  }

  set providers(value: IProviderUI[]) {
    this._data.providers = value;
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }

  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
  }

  get wallets() {
    return this._data.wallets ?? [];
  }

  set wallets(value: IWalletPlugin[]) {
    this._data.wallets = value;
  }

  get networks() {
    return this._data.networks ?? [];
  }
  set networks(value: INetworkConfig[]) {
    this._data.networks = value;
  }

  get showHeader() {
    return this._data.showHeader ?? true;
  }

  set showHeader(value: boolean) {
    this._data.showHeader = value;
  }

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: ICommissionInfo[]) {
    this._data.commissions = value;
  }

  get mode() {
    return this._data.mode ?? 'add';
  }

  set mode(value: ModeType) {
    this._data.mode = value;
  }

  get tokens() {
    return this._data.tokens ?? [];
  }

  set tokens(value: ICustomTokenObject[]) {
    this._data.tokens = value;
  }

  private get isRemoveLiquidity() {
    return this._data?.mode === 'remove';
  }

  private get isAddLiquidity() {
    return this._data?.mode === 'add';
  }

  private _getActions(category?: string) {
    const self = this;
    const actions: any = [
      {
        name: 'Commissions',
        icon: 'dollar-sign',
        command: (builder: any, userInputData: any) => {
          let _oldData: IPoolConfig = {
            providers: [],
            tokens: [],
            defaultChainId: 0,
            wallets: [],
            networks: [],
            mode: 'add'
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData.commissions) this._data.commissions = userInputData.commissions;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new ScomCommissionFeeSetup(null, {
              commissions: self._data.commissions || [],
              fee: this.state.embedderCommissionFee,
              networks: self._data.networks
            });
            const hstack = new HStack(null, {
              verticalAlignment: 'center',
            });
            const button = new Button(hstack, {
              caption: 'Confirm',
              width: '100%',
              height: 40,
              font: { color: Theme.colors.primary.contrastText }
            });
            vstack.append(config);
            vstack.append(hstack);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      }
    ];

    if (category && category !== 'offers') {
      actions.push({
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let _oldData: IPoolConfig = {
            providers: [],
            tokens: [],
            defaultChainId: 0,
            wallets: [],
            networks: [],
            mode: 'add'
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              this._data.mode = userInputData.mode;
              this._data.providers = userInputData.providers;
              this._data.tokens = [];
              if (userInputData.tokens) {
                for (let inputToken of userInputData.tokens) {
                  if (!inputToken.address) {
                    const nativeToken = ChainNativeTokenByChainId[inputToken.chainId];
                    if (nativeToken) this._data.tokens.push({ ...nativeToken as any, chainId: inputToken.chainId });
                  }
                  else {
                    const tokens = DefaultERC20Tokens[inputToken.chainId]
                    const token = tokens.find(v => v.address === inputToken.address);
                    if (token) this._data.tokens.push({ ...token as any, chainId: inputToken.chainId });
                  }
                }
              }
              await this.resetRpcWallet();
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.general.dataSchema,
        userInputUISchema: formSchema.general.uiSchema
      });

      actions.push({
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.theme.dataSchema
      })
    }
    return actions
  }

  private getData() {
    return this._data;
  }

  private async resetRpcWallet() {
    this.removeRpcWalletEvents();
    const rpcWalletId = await this.state.initRpcWallet(this.defaultChainId);
    const rpcWallet = this.rpcWallet;
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      if (this.poolAdd) this.poolAdd.onChainChange();
      if (this.poolRemove) this.poolRemove.onChainChange();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      if (this.poolAdd) this.poolAdd.onWalletConnected(connected);
      if (this.poolRemove) this.poolRemove.onWalletConnected(connected);
    });
    this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);

    const data = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
  }

  private async setData(config: IPoolConfig) {
    this._data = config;
    await this.resetRpcWallet();
    await this.refreshUI();
  }

  private async refreshUI() {
    const dexList = getDexList();
    this.state.setDexInfoList(dexList);
    await this.initializeWidgetConfig();
  }

  private async getTag() {
    return this.tag;
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.dappContainer)
      this.dappContainer.setTag(this.tag);
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
  }

  getConfigurators() {
    const self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: (category?: string) => {
          return this._getActions(category);
        },
        getData: this.getData.bind(this),
        setData: async (data: IPoolConfig) => {
          const defaultData = configData.defaultBuilderData as any;
          await this.setData({ ...defaultData, ...data });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-amm-pool-config',
        getLinkParams: () => {
          const commissions = this._data.commissions || [];
          return {
            data: window.btoa(JSON.stringify(commissions))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const decodedString = window.atob(params.data);
            const commissions = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              commissions
            };
            await this.setData(resultingData);
          }
        },
        bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
          element.onChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: () => {
          const fee = this.state.embedderCommissionFee;
          return { ...this._data, fee }
        },
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private initWallet = async () => {
    try {
      await Wallet.getClientInstance().init();
      await this.rpcWallet.init();
    } catch { }
  }

  private async initializeWidgetConfig() {
    await this.initWallet();
    this.vStackAmmPool.clearInnerHTML();
    if (this.isAddLiquidity) {
      this.poolAdd = new ScomAmmPoolAdd(undefined, {
        state: this.state,
        providers: this.providers,
        commissions: this.commissions,
        tokens: this.tokens
      });
      this.vStackAmmPool.appendChild(this.poolAdd);
    } else if (this.isRemoveLiquidity) {
      this.poolRemove = new ScomAmmPoolRemove(undefined, {
        state: this.state,
        providers: this.providers,
        tokens: this.tokens
      });
      this.vStackAmmPool.appendChild(this.poolRemove);
    } else {
      const tabs = new Tabs();
      this.vStackAmmPool.appendChild(tabs);
      this.poolAdd = new ScomAmmPoolAdd(undefined, {
        state: this.state,
        providers: this.providers,
        commissions: this.commissions,
        tokens: this.tokens
      });
      this.poolRemove = new ScomAmmPoolRemove(undefined, {
        state: this.state,
        providers: this.providers,
        tokens: this.tokens
      });
      tabs.add({ caption: 'Add Liquidity', icon: { name: 'plus-circle', fill: Theme.text.primary }, children: this.poolAdd });
      tabs.add({ caption: 'Remove Liquidity', icon: { name: 'minus-circle', fill: Theme.text.primary }, children: this.poolRemove });
      tabs.activeTabIndex = 0;
    }
    if (this.poolAdd) {
      this.poolAdd.connectWallet = () => this.connectWallet();
    }
    if (this.poolRemove) {
      this.poolRemove.connectWallet = () => this.connectWallet();
    }
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.state = new State(configData);
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const mode = this.getAttribute('mode', true);
      const tokens = this.getAttribute('tokens', true, []);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const providers = this.getAttribute('providers', true, []);
      const commissions = this.getAttribute('commissions', true, []);
      await this.setData({ commissions, mode, providers, tokens, defaultChainId, networks, wallets });
    }
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  removeRpcWalletEvents() {
    const rpcWallet = this.rpcWallet;
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
  }

  private connectWallet = async () => {
    if (!isClientWalletConnected()) {
      await application.loadPackage('@scom/scom-wallet-modal', '*');
      this.mdWallet.networks = this.networks;
      this.mdWallet.wallets = this.wallets;
      this.mdWallet.showModal();
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(this.chainId);
    }
  }

  onHide() {
    this.dappContainer.onHide();
    this.removeRpcWalletEvents();
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-panel class={poolStyle} background={{ color: Theme.background.main }}>
          <i-panel
            width="100%"
            padding={{ left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }}
          >
            <i-vstack
              id="vStackAmmPool"
              margin={{ top: '0.5rem', left: 'auto', right: 'auto', bottom: '0.75rem' }}
              padding={{ left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }}
              border={{ radius: '1rem' }}
              width="100%" maxWidth={520}
            />
          </i-panel>
          <i-scom-commission-fee-setup visible={false} />
          <i-scom-wallet-modal id="mdWallet" wallets={[]} />
        </i-panel>
      </i-scom-dapp-container>
    )
  }
}
