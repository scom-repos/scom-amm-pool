import { customElements, Module, Control, ControlElement, Modal, Input, Icon, Panel, Button, Image, observable, application, IEventBus, Container, Styles, GridLayout } from '@ijstech/components';
import {
  isWalletConnected, 
  ITokenObject,
  hasMetaMask,
  hasUserToken,
  setUserTokens,
  tokenStore,
  ChainNativeTokenByChainId,
  assets as tokenAssets
} from '@scom/scom-token-list';
import {
  getChainId,
  getRpcWallet
} from '../store/index';
import { formatNumber, EventId } from '../global/index';
import { Contracts } from '../contracts/oswap-openswap-contract/index';
import Assets from '../assets';
import './tokenSelection.css';
import { ImportToken } from './importToken';
import { Wallet } from '@ijstech/eth-wallet';

const Theme = Styles.Theme.ThemeVars;

interface TokenSelectionElement extends ControlElement{
  disableSelect?: boolean,
  disabledMaxBtn?: boolean
}

declare const window: any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-amm-pool-token-selection']: TokenSelectionElement;
    }
  }
};

@customElements('i-scom-amm-pool-token-selection')
export class TokenSelection extends Module {
  private _token?: ITokenObject;
  private _tokenDataListProp: Array<ITokenObject>;
  private _onSelectToken: any;
  private _isCommonShown: boolean;
  private _isSortBalanceShown: boolean = true;
  private _isBtnMaxShown: boolean = true;
  private _onSetMaxBalance: any;
  private tokenSelectionModal: Modal;
  private tokenBalancesMap: any;
  private btnToken: Button;
  private btnMax: Button;
  private tokenList: GridLayout;
  private commonTokenList: GridLayout;
  private commonTokenPanel: Panel;
  private sortBalancePanel: Panel;
  private importTokenModal: ImportToken;
  @observable()
  private sortValue: boolean | undefined;
  private iconSortUp: Icon;
  private iconSortDown: Icon;
  private tokenSearch: Input;
  @observable()
  private filterValue: string;
  private checkHasMetaMask: boolean;
  private $eventBus: IEventBus;
  private _disableSelect: boolean;
  private _disabledMaxBtn: boolean;

  get token() {
    return this._token;
  }

  set token(value: ITokenObject | undefined) {
    this._token = value;
    this.updateButton(value);
  }

  get tokenDataListProp(): Array<ITokenObject> {
    return this._tokenDataListProp;
  }

  set tokenDataListProp(value: Array<ITokenObject>) {
    this._tokenDataListProp = value;
    this.renderTokenItems();
    this.updateButton();
  }

  get onSelectToken(): any {
    return this._onSelectToken;
  }

  set onSelectToken(callback: any) {
    this._onSelectToken = callback;
  }

  get isCommonShown(): boolean {
    return this._isCommonShown;
  }

  set isCommonShown(value: boolean) {
    this._isCommonShown = value;
    this.renderCommonItems();
  }

  get isSortBalanceShown(): boolean {
    return this._isSortBalanceShown;
  }

  set isSortBalanceShown(value: boolean) {
    this._isSortBalanceShown = value;
    if (this.sortBalancePanel) this.sortBalancePanel.visible = value;
  }

  get isBtnMaxShown(): boolean {
    return this._isBtnMaxShown;
  }

  set isBtnMaxShown(value: boolean) {
    this._isBtnMaxShown = value;
    if (this.btnMax) this.btnMax.visible = value;
  }

  get onSetMaxBalance(): any {
    return this._onSetMaxBalance;
  }

  set onSetMaxBalance(callback: any) {
    this._onSetMaxBalance = callback;
  }

  get chainId(): number {
    return getChainId();
  }

  get disableSelect(): boolean {
    return this._disableSelect;
  }
  
  set disableSelect(value: boolean) {
    this._disableSelect = value;
    this.btnToken.enabled = !value;
    this.btnToken.rightIcon.visible = !value;
  }

  get disabledMaxBtn(): boolean {
    return this._disabledMaxBtn;
  }

  set disabledMaxBtn(value: boolean) {
    this._disabledMaxBtn = value;
    this.btnMax.enabled = !value;
  }

  private async initData() {
    if (isWalletConnected()) {
      this.tokenBalancesMap = tokenStore.tokenBalances || {};
    }
    this.renderTokenItems();
  }

  private async updateDataByChain(onPaid?: boolean) {
    const rpcWallet = getRpcWallet();
    this.tokenBalancesMap = onPaid ? tokenStore.tokenBalances : await tokenStore.updateAllTokenBalances(rpcWallet);
    this.renderTokenItems();
    this.updateButton();
  }

  private async updateDataByNewToken() {
    this.tokenBalancesMap = tokenStore.tokenBalances || {};
    this.renderTokenItems();
  }

  private async onWalletConnect() {
    this.checkHasMetaMask = hasMetaMask();
    await this.initData();
    this.updateStatusButton();
  }

  private async onWalletDisconnect() {
    await this.initData();
  }

  private async onPaid(data?: any) {
    await this.updateDataByChain(data === 'onPaid');
    await this.initData();
  }

  private registerEvent() {
    // this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect);
    // this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletDisconnect);
    this.$eventBus.register(this, EventId.Paid, this.onPaid);
    this.$eventBus.register(this, EventId.EmitNewToken, this.updateDataByNewToken);
  }

  private get tokenDataList(): ITokenObject[] {
    let tokenList: ITokenObject[] = [];
    if (this.tokenDataListProp && this.tokenDataListProp.length) {
      tokenList = this.tokenDataListProp;
    }
    if (!this.tokenBalancesMap || !Object.keys(this.tokenBalancesMap).length) {
      this.tokenBalancesMap = tokenStore.tokenBalances || {};
    }
    return tokenList.map((token: ITokenObject) => {
      const tokenObject = { ...token };
      const nativeToken = ChainNativeTokenByChainId[this.chainId];
      if (nativeToken?.symbol && token.symbol === nativeToken.symbol) {
        Object.assign(tokenObject, { isNative: true })
      }
      if (!isWalletConnected()){
        Object.assign(tokenObject, {
          balance: 0,
        })
      }
      else if (this.tokenBalancesMap) {
        Object.assign(tokenObject, {
          balance: this.tokenBalancesMap[token.address?.toLowerCase() || token.symbol] || 0,
        })
      }
      return tokenObject;
    }).sort(this.sortToken);
  }

  private get commonTokenDataList(): ITokenObject[] {
    const tokenList: ITokenObject[] = this.tokenDataList;
    if (!tokenList) return [];
    return tokenList.filter((token: ITokenObject) => token.isCommon || token.isNative);
  }

  private get tokenDataListFiltered(): ITokenObject[] {
    let tokenList: ITokenObject[] = this.tokenDataList || [];
    if (tokenList.length) {
      if (this.filterValue) {
        tokenList = tokenList.filter((token: ITokenObject) => {
          return token.symbol.toUpperCase().includes(this.filterValue) ||
            token.name.toUpperCase().includes(this.filterValue) ||
            token.address?.toUpperCase() === this.filterValue;
        });
      }
      if (this.sortValue !== undefined) {
        tokenList = tokenList.sort((a: ITokenObject, b: ITokenObject) => {
          return this.sortToken(a, b, this.sortValue);
        });
        const allBalanceZero = !tokenList.some((token: ITokenObject) => token.balance && token.balance !== '0');
        if (allBalanceZero && !this.sortValue) {
          tokenList = tokenList.reverse();
        }
      }
    }
    return tokenList;
  }

  private sortToken = (a: any, b: any, asc?: boolean) => {
    if (a.balance != b.balance) {
      return asc ? (a.balance - b.balance) : (b.balance - a.balance);
    }
    if (a.symbol?.toLowerCase() < b.symbol?.toLowerCase()) {
      return -1;
    }
    if (a.symbol?.toLowerCase() > b.symbol?.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  private sortBalance() {
    this.sortValue = !this.sortValue;
    if (this.sortValue) {
      this.iconSortUp.classList.add('icon-sorted');
      this.iconSortDown.classList.remove('icon-sorted');
    } else {
      this.iconSortUp.classList.remove('icon-sorted');
      this.iconSortDown.classList.add('icon-sorted');
    }
    this.renderTokenItems();
  }

  private filterSearch(source: Control) {
    this.filterValue = (source as Input).value.toUpperCase();
    this.renderTokenItems();
  }

  private async renderCommonItems() {
    if (!this.commonTokenList) return;
    this.commonTokenList.innerHTML = '';
    if (this.isCommonShown && this.commonTokenDataList) {
      this.commonTokenPanel.visible = true;
      this.commonTokenDataList.forEach((token: ITokenObject) => {
        const logoAddress = tokenAssets.tokenPath(token, this.chainId);

        this.commonTokenList.appendChild(
          <i-hstack
            background={{ color: Theme.background.main }}
            onClick={() => this.onSelect(token)}
            tooltip={{ content: token.name }}
            verticalAlignment="center"
            class="grid-item"
          >
            <i-image width={24} height={24} url={logoAddress} fallbackUrl={tokenAssets.fallbackUrl} />
            <i-label caption={token.symbol} onClick={() => this.onSelect(token)}></i-label>
          </i-hstack>
        )
      })
    } else {
      this.commonTokenPanel.visible = false;
    }
  }

  private renderToken(token: ITokenObject) {
    const logoAddress = tokenAssets.tokenPath(token, this.chainId);
    return (
      <i-hstack
        width="100%"
        verticalAlignment="center" class="token-item"
        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
        onClick={() => this.onSelect(token)}
      >
        <i-vstack width="100%">
          <i-hstack>
            <i-hstack gap="0.5rem">
              <i-image width={36} height={36} url={logoAddress} fallbackUrl={tokenAssets.fallbackUrl} />
              <i-panel class="token-info" margin={{right: '0.5rem'}}>
                <i-label caption={token.symbol}  onClick={() => this.onSelect(token)}/>
                <i-hstack class="token-name" verticalAlignment="center">
                  <i-label caption={token.name}  onClick={() => this.onSelect(token)}/>
                  {token.address && !token.isNative ?
                    <i-icon
                      name="copy"
                      width="14px"
                      height="14px"
                      fill={Theme.text.primary}
                      margin={{ right: 8 }}
                      tooltip={{ content: `${token.symbol} has been copied`, trigger: 'click' }}
                      onClick={() => application.copyToClipboard(token.address || '')}
                      class="inline-flex pointer"
                    ></i-icon>
                    : []
                  }
                  {token.address && this.checkHasMetaMask ?
                    <i-image
                      width={16}
                      height={16}
                      url={Assets.fullPath('img/metamask.png')}
                      tooltip={{ content: 'Add to MetaMask' }}
                      onClick={(target: Control, event: Event) => this.addToMetamask(event, token)}
                    ></i-image>
                    : []
                  }
                </i-hstack>
              </i-panel>
            </i-hstack>
            <i-label margin={{left: 'auto'}} caption={formatNumber(token.balance, 4)} onClick={() => this.onSelect(token)}/>
          </i-hstack>
          {
            token.isNew ? (
              <i-hstack horizontalAlignment="center"> 
                <i-button caption='Import'
                  margin={{ top: 10 }} height={34}
                  padding={{top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem'}}
                  background={{color: Theme.background.gradient}}
                  font={{color: '#fff'}}
                  onClick={(source: Control, event: Event) => this.showImportTokenModal(event, token)}
                ></i-button>
              </i-hstack>
            ) : (
                <i-hstack></i-hstack>
            )
          }
        </i-vstack>
      </i-hstack>
    )
  }

  private getTokenObject = async (address: string, showBalance?: boolean) => {
    const ERC20Contract = new Contracts.ERC20(Wallet.getClientInstance() as any, address);
    const symbol = await ERC20Contract.symbol();
    const name = await ERC20Contract.name();
    const decimals = (await ERC20Contract.decimals()).toFixed();
    let balance;
    if (showBalance && isWalletConnected()) {
      balance =  (await (ERC20Contract.balanceOf(Wallet.getClientInstance().account.address))).shiftedBy(-decimals).toFixed();
    }
    return {
      address: address.toLowerCase(),
      decimals: +decimals,
      name,
      symbol,
      balance
    }
  }

  private async renderTokenItems() {
    if (!this.tokenList) return;
    this.renderCommonItems();
    this.tokenList.innerHTML = '';
    if (this.tokenDataListFiltered.length) {
      const tokenItems = this.tokenDataListFiltered.map((token: ITokenObject) => this.renderToken(token));
      this.tokenList.append(...tokenItems);
    } else  {
      try {
        const tokenObj = await this.getTokenObject(this.filterValue, true);
        if (!tokenObj) throw new Error('Token is invalid');
        this.tokenList.innerHTML = '';
        this.tokenList.appendChild(this.renderToken({ ...tokenObj, isNew: true, chainId: this.chainId }));
      } catch (err) {
        this.tokenList.innerHTML = '';
        this.tokenList.append(
          <i-label class="text-center mt-1 mb-1" font={{ color: Theme.text.primary }} caption="No tokens found" />
        )
      }
    }
  }

  private addToMetamask(event: Event, token: ITokenObject) {
    event.stopPropagation();
    const img = `${window.location.origin}${tokenAssets.getTokenIconPath(token, this.chainId).substring(1)}`;
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: img
        },
      },
    });
  }

  private async showModal() {
    if (!this.enabled) return;
    this.tokenSearch.value = '';
    this.filterValue = '';
    this.sortValue = undefined;
    this.iconSortUp.classList.remove('icon-sorted');
    this.iconSortDown.classList.remove('icon-sorted');
    this.tokenBalancesMap = tokenStore.tokenBalances;
    this.renderTokenItems();
    this.updateButton();
    this.tokenSelectionModal.visible = true;
  }

  private updateStatusButton() {
    const status = isWalletConnected();
    if (this.btnToken) {
      this.btnToken.enabled = !this.disableSelect && status;
    }
    if (this.btnMax) {
      this.btnMax.enabled = !this.disabledMaxBtn && status;
    }
  }

  private updateButton(token?: ITokenObject) {
    const btnToken = this.btnToken;
    if (!btnToken) return;
    try {
      let image: Image = btnToken.querySelector('i-image') as Image;
      if (!token) {
        token = this.tokenDataList?.find((v: ITokenObject) => (v.address && v.address == this.token?.address) || (v.symbol == this.token?.symbol))
      }
      if (!token) {
        btnToken.caption = 'Select Token';
        btnToken.classList.remove('has-token');
        this.btnMax.visible = false;
        if (image) {
          btnToken.removeChild(image);
        }
      } else {
        btnToken.caption = token.symbol;
        btnToken.classList.add('has-token');
        if (this.isBtnMaxShown) {
          this.btnMax.visible = true;
        }
        const logoAddress = tokenAssets.tokenPath(token, this.chainId);
        if (!image) {
          image = new Image(btnToken, {
            width: 20,
            height: 20,
            fallbackUrl: tokenAssets.fallbackUrl
          });
          btnToken.prepend(image);
        }
        image.url = logoAddress;
      }
    } catch {}
  }

  private async onSelect(token: ITokenObject, isNew: boolean = false) {
    this.token = token;
    // The token has been not imported
    if (!isNew && token.isNew && !hasUserToken(token.address || '', this.chainId)) {
      setUserTokens(token, this.chainId);
      const rpcWallet = getRpcWallet();
      tokenStore.updateTokenMapData(this.chainId);
      await tokenStore.updateAllTokenBalances(rpcWallet);
      this.$eventBus.dispatch(EventId.EmitNewToken, token);
      isNew = true;
    }
    this.onSelectToken({...token, isNew});
    this.tokenSelectionModal.visible = false;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  };

  async init() {
    super.init();
    this.disableSelect = !!this.getAttribute("disableSelect", true);
    this.disabledMaxBtn = this.getAttribute("disabledMaxBtn", true);
    this.updateStatusButton();
    this.updateButton(this._token);
  }
  showImportTokenModal(event: Event, token: ITokenObject) {
    event.stopPropagation();
    this.importTokenModal.token = token;
    this.importTokenModal.showModal();
    this.importTokenModal.onUpdate = this.onImportToken.bind(this);
  }
  onImportToken(token: ITokenObject) {
    this.onSelect(token, true);
  }
  onCloseModal() {
    // reset list
    this.filterValue = '';
    this.renderTokenItems();
  }

  render() {
    return (
      <i-panel class='token-selection'>
        <i-hstack gap="0.25rem">
          <i-button
            id="btnMax" enabled={false}
            class="custom-btn"
            caption="Max"
            font={{color: '#fff'}}
            visible={false}
            onClick={() => this.onSetMaxBalance()}
          />
          <i-button
            id="btnToken" enabled={false}
            class="custom-btn"
            rightIcon={{ name: "caret-down", fill: Theme.text.primary, margin: {left: '0.25rem'}}}
            caption="Select a token"
            background={{color: 'transparent'}}
            font={{color: Theme.text.primary}}
            height="auto" width="max-content"
            border={{radius: 12}}
            onClick={() => this.showModal()}
          />
        </i-hstack>
        <i-modal id="tokenSelectionModal" class="bg-modal" title="Select Token" closeIcon={{ name: 'times' }} onClose={() => this.onCloseModal()}>
          <i-panel class="search">
            <i-icon width={16} height={16} name="search" fill={Theme.text.primary} />
            <i-input id="tokenSearch" height="auto" width="100% !important" placeholder="Search name or paste address" onKeyUp={this.filterSearch.bind(this)}></i-input>
          </i-panel>
          <i-panel id="commonTokenPanel" class="common-token">
            <i-label caption="Common Token" />
            <i-grid-layout
              id="commonTokenList"
              columnsPerRow={4} gap={{ row: '1rem', column: '1rem' }}
              class="common-list"
              verticalAlignment="center"
              mediaQueries={[
                {
                  maxWidth: '425px',
                  properties: {templateColumns: ['repeat(3, 1fr)']}
                }
              ]}
            ></i-grid-layout>
          </i-panel>
          <i-panel id="sortBalancePanel" class="token-header">
            <i-label caption="Token" />
            <i-panel class="token-section" margin={{left: 'auto'}} onClick={() => this.sortBalance()}>
              <i-label class="mr-1" caption="Balance" />
              <i-icon id="iconSortUp" class="icon-sort-up" name="sort-up" />
              <i-icon id="iconSortDown" class="icon-sort-down" name="sort-down" />
            </i-panel>
          </i-panel>
          <i-grid-layout id="tokenList" class="token-list" columnsPerRow={1}></i-grid-layout>
        </i-modal>
        <i-scom-swap-import-token id="importTokenModal" />
      </i-panel>
    )
  }
};
