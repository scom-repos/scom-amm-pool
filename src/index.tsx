import { customModule, Module, Styles, Button, Container, customElements, ControlElement, IDataSchema, VStack, Tabs } from '@ijstech/components';
import { } from '@ijstech/eth-contract';
import { } from '@ijstech/eth-wallet';
import { INetworkConfig, IPoolConfig, IProviderUI, ModeType, ICommissionInfo, ICustomTokenObject } from './global/index';
import { setDexInfoList, setDataFromConfig } from './store/index';
import { poolStyle } from './index.css';
import { ChainNativeTokenByChainId, DefaultERC20Tokens } from '@scom/scom-token-list';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
import getDexList from '@scom/scom-dex-list';
import configData from './data.json';
import Config from './config/index';
import { ScomAmmPoolAdd, ScomAmmPoolRemove } from './liquidity/index';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolElement extends ControlElement {
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
  private dappContainer: ScomDappContainer;
  private vStackAmmPool: VStack;
  private configDApp: Config;

  private _data: IPoolConfig = {
    providers: [],
    tokens: [],
    defaultChainId: 0,
    wallets: [],
    networks: [],
    mode: 'add'
  }
  tag: any = {};

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromConfig(configData);
  }

  static async create(options?: ScomAmmPoolElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
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

  private getPropertiesSchema() {
    const propertiesSchema: any = {
      type: "object",
      properties: {
        mode: {
          type: "string",
          required: true,
          enum: [
            "add",
            "remove",
            "both"
          ]
        },
        tokens: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              chainId: {
                type: "number",
                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
                required: true
              },
              address: {
                type: "string",
                required: true
              }
            }
          }
        },
        providers: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              caption: {
                type: "string",
                required: true
              },
              image: {
                type: "string",
                required: true
              },
              key: {
                type: "string",
                required: true
              },
              dexId: {
                type: "number"
              },
              chainId: {
                type: "number",
                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
                required: true
              }
            }
          }
        }
      }
    }

    return propertiesSchema;
  }

  private getThemeSchema(readOnly?: boolean) {
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        "dark": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            inputFontColor: {
              type: 'string',
              format: 'color',
              readOnly
            }
          }
        },
        "light": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            inputFontColor: {
              type: 'string',
              format: 'color',
              readOnly
            }
          }
        }
      }
    }
    return themeSchema;
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    const self = this;
    const actions = [
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
              this.configDApp.data = this._data;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.configDApp.data = this._data;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new Config(null, {
              commissions: self._data.commissions
            });
            const button = new Button(null, {
              caption: 'Confirm',
            });
            vstack.append(config);
            vstack.append(button);
            button.onClick = async () => {
              const commissions = config.data.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      },
      {
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
              this.configDApp.data = this._data;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.configDApp.data = this._data;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema,
        userInputUISchema: {
          type: "Group",
          elements: [
            {
              type: "Control",
              scope: "#/properties/mode",
              options: {
                detail: {
                  type: "HorizontalLayout"
                }
              }
            },
            {
              type: "Control",
              scope: "#/properties/providers",
              options: {
                detail: {
                  type: "VerticalLayout"
                }
              }
            },
            {
              type: "Control",
              scope: "#/properties/tokens",
              options: {
                detail: {
                  type: "VerticalLayout"
                }
              }
            }
          ]
        }
      },
      {
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
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  private getData() {
    return this._data;
  }

  private async setData(data: IPoolConfig) {
    this.configDApp.data = data;
    this._data = data;
    await this.refreshUI();
  }

  private async refreshUI() {
    const dexList = getDexList();
    setDexInfoList(dexList);
    await this.onSetupPage();
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
        getActions: () => {
          const propertiesSchema = this.getPropertiesSchema();
          const themeSchema = this.getThemeSchema();
          return this._getActions(propertiesSchema, themeSchema);
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
        bindOnChanged: (element: Config, callback: (data: any) => Promise<void>) => {
          element.onCustomCommissionsChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private async onSetupPage() {
    const data: any = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
    this.vStackAmmPool.clearInnerHTML();
    if (this.isAddLiquidity) {
      const poolAdd = new ScomAmmPoolAdd(undefined, {
        providers: this.providers,
        commissions: this.commissions,
        tokens: this.tokens
      });
      this.vStackAmmPool.appendChild(poolAdd);
    } else if (this.isRemoveLiquidity) {
      const poolRemove = new ScomAmmPoolRemove(undefined, {
        providers: this.providers,
        tokens: this.tokens
      });
      this.vStackAmmPool.appendChild(poolRemove);
    } else {
      const tabs = new Tabs();
      this.vStackAmmPool.appendChild(tabs);
      const poolAdd = new ScomAmmPoolAdd(undefined, {
        providers: this.providers,
        commissions: this.commissions,
        tokens: this.tokens
      });
      const poolRemove = new ScomAmmPoolRemove(undefined, {
        providers: this.providers,
        tokens: this.tokens
      });
      tabs.add({ caption: 'Add Liquidity', icon: { name: 'plus-circle', fill: Theme.text.primary }, children: poolAdd });
      tabs.add({ caption: 'Remove Liquidity', icon: { name: 'minus-circle', fill: Theme.text.primary }, children: poolRemove });
      tabs.activeTabIndex = 0;
    }
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    const mode = this.getAttribute('mode', true);
    const tokens = this.getAttribute('tokens', true, []);
    const defaultChainId = this.getAttribute('defaultChainId', true);
    const networks = this.getAttribute('networks', true);
    const wallets = this.getAttribute('wallets', true);
    const providers = this.getAttribute('providers', true, []);
    const commissions = this.getAttribute('commissions', true, []);
    await this.setData({ commissions, mode, providers, tokens, defaultChainId, networks, wallets });
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
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
              background={{ color: Theme.background.modal }}
            />
          </i-panel>
          <i-scom-amm-pool-config id="configDApp" visible={false} />
        </i-panel>
      </i-scom-dapp-container>
    )
  }
}
