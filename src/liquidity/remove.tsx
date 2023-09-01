import { customModule, Module, Styles, Input, Button, Panel, Label, Container, customElements, ControlElement, observable } from '@ijstech/components';
import { formatNumber, limitInputNumber, limitDecimals, IPoolDetailConfig, IProviderUI, IProvider, ICustomTokenObject } from '../global/index';
import { BigNumber, IERC20ApprovalAction, Utils } from '@ijstech/eth-wallet';
import { isClientWalletConnected, getSupportedTokens, State } from '../store/index';
import { getPairFromTokens, getRemoveLiquidityInfo, removeLiquidity, getTokensBack, getTokensBackByAmountOut, getRouterAddress } from '../API';
import { assets as tokenAssets, tokenStore, ITokenObject } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomTokenInput from '@scom/scom-token-input';
import { poolRemoveStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolRemoveElement extends ControlElement {
  state: State;
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-amm-pool-remove"]: ScomAmmPoolRemoveElement;
    }
  }
}

@customModule
@customElements('i-scom-amm-pool-remove')
export class ScomAmmPoolRemove extends Module {
  private btnApprove: Button;
  private btnRemove: Button;
  private txStatusModal: ScomTxStatusModal;
  private firstTokenInput: ScomTokenInput;
  private secondTokenInput: ScomTokenInput;
  private firstToken?: ITokenObject;
  private secondToken?: ITokenObject;
  private lbFirstPrice: Label;
  private lbFirstPriceTitle: Label;
  private lbSecondPrice: Label;
  private lbSecondPriceTitle: Label;
  private lbShareOfPool: Label;
  private approvalModelAction: IERC20ApprovalAction;
  private firstInputAmount: string = '';
  private secondInputAmount: string = '';
  private pnlCreatePairMsg: Panel;
  private pricePanel: Panel;

  private pnlLiquidityImage: Panel;
  private lbLiquidityBalance: Label;
  private liquidityInput: Input;
  private pnlInfo: Panel;

  private _state: State;
  private _data: IPoolDetailConfig = {
    providers: [],
    tokens: []
  }
  private maxLiquidityBalance: number | string = '0';
  private lpToken: ITokenObject;
  private isInited: boolean = false;
  @observable()
  private removeInfo = {
    maxBalance: '',
    totalPoolTokens: '',
    poolShare: '',
    tokenAShare: '',
    tokenBShare: ''
  };

  tag: any = {};
  private contractAddress: string;
  public connectWallet: () => void;

  constructor(parent?: Container, options?: ScomAmmPoolRemoveElement) {
    super(parent, options);
    if (options?.state) {
      this.state = options.state;
    }
  }

  static async create(options?: ScomAmmPoolRemoveElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get state() {
    return this._state;
  }

  set state(value: State) {
    this._state = value;
  }

  get firstTokenDecimals() {
    return this.firstToken?.decimals || 18;
  }

  get secondTokenDecimals() {
    return this.secondToken?.decimals || 18;
  }

  get firstTokenSymbol() {
    return this.firstToken?.symbol || '';
  }

  get secondTokenSymbol() {
    return this.secondToken?.symbol || '';
  }

  get providers() {
    return this._data.providers;
  }

  set providers(value: IProviderUI[]) {
    this._data.providers = value;
  }

  private get originalData() {
    if (!this._data) return undefined;
    const { providers } = this._data;
    if (!providers?.length) return undefined;
    let _providers: IProvider[] = [];
    const { key } = providers[0];
    let defaultProvider: IProvider = {
      key
    };
    _providers.push(defaultProvider);
    return { providers: _providers };
  }

  onWalletConnected = async (connected: boolean) => {
    // if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
    //   this.onChainChange();
    // } else {
    //   this.updateContractAddress();
    //   if (this.originalData?.providers?.length) await this.onSetupPage(connected);
    // }
    this.updateContractAddress();
    if (this.originalData?.providers?.length) await this.onSetupPage(connected);
  }

  onChainChange = async () => {
    this.updateContractAddress();
    if (this.originalData?.providers?.length) await this.onSetupPage(true);
    this.updateButtonText();
  }

  private async setData(data: IPoolDetailConfig) {
    this._data = data;
    this.updateContractAddress();
    await this.refreshUI();
  }

  private async refreshUI() {
    await this.initData();
    await this.onSetupPage(isClientWalletConnected());
  }

  private updateContractAddress = () => {
    this.contractAddress = getRouterAddress(this.state.getChainId());
    if (this.state?.approvalModel && this.approvalModelAction) {
      this.state.approvalModel.spenderAddress = this.contractAddress;
    }
  }

  private onSetupPage = async (connected: boolean) => {
    const chainId = this.state.getChainId();
    if (!this.btnRemove.isConnected) await this.btnRemove.ready();
    if (!this.firstTokenInput.isConnected) await this.firstTokenInput.ready();
    if (!this.secondTokenInput.isConnected) await this.secondTokenInput.ready();
    if (!this.liquidityInput.isConnected) await this.liquidityInput.ready();
    this.resetFirstInput();
    this.resetSecondInput();
    this.liquidityInput.value = '';
    if (connected) {
      if (!this.approvalModelAction) await this.initApprovalModelAction();
    }
    this.firstTokenInput.isBtnMaxShown = false;
    this.secondTokenInput.isBtnMaxShown = false;
    const tokens = getSupportedTokens(this._data.tokens || [], chainId);
    const isReadonly = tokens.length === 2;
    this.firstTokenInput.tokenReadOnly = isReadonly;
    this.secondTokenInput.tokenReadOnly = isReadonly;
    this.firstTokenInput.tokenDataListProp = tokens;
    this.secondTokenInput.tokenDataListProp = tokens;
    this.setFixedPairData();
    if (connected) {
      try {
        this.updateButtonText();
        if (!this.firstToken || !this.secondToken) {
          this.resetUI();
          return;
        }
        if (!this.lbFirstPriceTitle.isConnected) await this.lbFirstPriceTitle.ready();
        this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
        if (!this.lbSecondPriceTitle.isConnected) await this.lbSecondPriceTitle.ready();
        this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
        this.pricePanel.visible = true;
        await this.checkPairExists();
        await this.callAPIBundle();
        this.renderLiquidity();
        if (new BigNumber(this.liquidityInput.value).gt(0))
          this.approvalModelAction.checkAllowance(this.lpToken, this.liquidityInput.value);
      } catch {
        this.btnRemove.caption = 'Remove';
      }
    } else {
      this.resetData();
    }
  }

  private renderLiquidity() {
    const chainId = this.state.getChainId();
    let firstTokenImagePath = tokenAssets.tokenPath(this.firstToken, chainId);
    let secondTokenImagePath = tokenAssets.tokenPath(this.secondToken, chainId);
    this.pnlLiquidityImage.clearInnerHTML();
    this.pnlLiquidityImage.append(
      <i-hstack horizontalAlignment="space-between" verticalAlignment="center" gap="4px">
        <i-button
          caption="Max"
          font={{ color: '#fff' }}
          padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: Theme.background.gradient }}
          onClick={() => this.setMaxLiquidityBalance()}
        />
        <i-image width={20} height={20} url={firstTokenImagePath} />
        <i-image width={20} height={20} url={secondTokenImagePath} />
        <i-label font={{ color: Theme.colors.warning.main }} caption={this.firstTokenSymbol || '-'} />
        <i-label font={{ color: Theme.colors.warning.main }} caption="-" />
        <i-label font={{ color: Theme.colors.warning.main }} caption={this.secondTokenSymbol || '-'} />
      </i-hstack>
    )
    this.pnlInfo.clearInnerHTML();
    this.pnlInfo.append(
      <i-vstack padding={{ left: '1rem', right: '1rem' }} gap="0.5rem" margin={{ top: '1.75rem' }}>
        <i-label font={{ color: '#E53780' }} caption="Your position" />
        <i-hstack horizontalAlignment="space-between">
          <i-hstack verticalAlignment="center" gap={4}>
            <i-image url={firstTokenImagePath} width={20} height={20} />
            <i-image url={secondTokenImagePath} width={20} height={20} />
            <i-label caption={`${this.firstTokenSymbol} / ${this.secondTokenSymbol}`} />
          </i-hstack>
          <i-label caption={this.removeInfo.totalPoolTokens} />
        </i-hstack>
        <i-hstack horizontalAlignment="space-between">
          <i-label font={{ color: '#E53780' }} caption="Your Pool Share" />
          <i-label caption={this.removeInfo.poolShare} />
        </i-hstack>
        <i-hstack horizontalAlignment="space-between">
          <i-label caption={this.firstTokenSymbol} />
          <i-label caption={this.removeInfo.tokenAShare} />
        </i-hstack>
        <i-hstack horizontalAlignment="space-between">
          <i-label caption={this.secondTokenSymbol} />
          <i-label caption={this.removeInfo.tokenBShare} />
        </i-hstack>
      </i-vstack>
    )
  }

  private setFixedPairData() {
    const chainId = this.state.getChainId();
    let currentChainTokens = this._data.tokens.filter((token) => token.chainId === chainId);
    if (!currentChainTokens.length && isClientWalletConnected()) {
      this.firstToken = Object.values(tokenStore.tokenMap).find(v => v.isNative);
      this.firstTokenInput.token = this.firstToken;
      return;
    }
    if (currentChainTokens.length < 2) return;
    const providers = this.originalData?.providers;
    if (providers && providers.length) {
      const fromTokenAddress = currentChainTokens[0].address || currentChainTokens[0].symbol;
      const toTokenAddress = currentChainTokens[1].address || currentChainTokens[1].symbol;
      const fromToken = fromTokenAddress?.toLowerCase().startsWith('0x') ? fromTokenAddress.toLowerCase() : fromTokenAddress;
      const toToken = toTokenAddress?.toLowerCase().startsWith('0x') ? toTokenAddress.toLowerCase() : toTokenAddress;
      this.firstToken = tokenStore.tokenMap[fromToken];
      this.secondToken = tokenStore.tokenMap[toToken];
      this.onUpdateToken(this.firstToken, true);
      this.onUpdateToken(this.secondToken, false);
      this.firstTokenInput.token = this.firstToken;
      this.secondTokenInput.token = this.secondToken;
    }
  }

  private async initTokenSelection() {
    if (this.isInited) return;
    await this.firstTokenInput.ready();
    await this.secondTokenInput.ready();
    this.firstTokenInput.tokenReadOnly = false;
    this.firstTokenInput.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, true);
    this.firstTokenInput.isCommonShown = false;
    this.secondTokenInput.tokenReadOnly = false;
    this.secondTokenInput.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, false);
    this.secondTokenInput.isCommonShown = false;
    this.isInited = true;
  }

  private resetData() {
    this.updateButtonText();
    this.btnApprove.visible = false;
    this.initTokenSelection();
  }

  private async initData() {
    await this.initTokenSelection();
    await this.initApprovalModelAction();
  }

  private updateButtonText() {
    if (!this.btnRemove || !this.btnRemove.hasChildNodes()) return;
    this.btnRemove.enabled = false;
    if (!isClientWalletConnected()) {
      this.btnRemove.caption = 'Connect Wallet';
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      this.btnRemove.enabled = true;
      this.btnRemove.caption = 'Switch Network';
      return;
    }
    if (this.btnRemove.rightIcon.visible) {
      this.btnRemove.caption = 'Loading';
    } else {
      this.updateBtnRemove();
    }
  }

  private async handleOutputChange(isFrom?: boolean) {
    if (!this.firstToken || !this.secondToken) return;
    if (isFrom) {
      limitInputNumber(this.firstTokenInput, this.firstToken.decimals);
      const value = new BigNumber(this.firstTokenInput.value);
      let tokensBack = await getTokensBackByAmountOut(this.state, this.firstToken, this.secondToken, this.firstToken, value.toFixed());
      if (tokensBack && value.eq(this.firstTokenInput.value)) {
        this.liquidityInput.value = tokensBack.liquidity;
        this.secondTokenInput.value = tokensBack.amountB;
      }
    } else {
      limitInputNumber(this.secondTokenInput, this.secondToken.decimals);
      const value = new BigNumber(this.secondTokenInput.value);
      let tokensBack = await getTokensBackByAmountOut(this.state, this.firstToken, this.secondToken, this.secondToken, value.toFixed());
      if (tokensBack && value.eq(this.secondTokenInput.value)) {
        this.liquidityInput.value = tokensBack.liquidity;
        this.firstTokenInput.value = tokensBack.amountA;
      }
    }
    this.approvalModelAction?.checkAllowance(this.lpToken, this.liquidityInput.value);
  }

  private async handleEnterAmount(isFrom?: boolean) {
    await this.handleOutputChange(isFrom);
  }

  private resetFirstInput() {
    this.firstToken = undefined;
    this.firstTokenInput.value = '';
    this.btnApprove.visible = false;
  }

  private resetSecondInput() {
    this.secondToken = undefined;
    this.secondTokenInput.value = '';
    this.btnApprove.visible = false;
  }

  private setMaxLiquidityBalance() {
    if (!this.firstToken || !this.secondToken) return;
    this.liquidityInput.value = this.maxLiquidityBalance;
    this.onLiquidityChange();
  }

  private async onLiquidityChange() {
    if (!this.firstToken || !this.secondToken) return;
    limitInputNumber(this.liquidityInput, 18);
    const value = new BigNumber(this.liquidityInput.value);
    let tokensBack = await getTokensBack(this.state, this.firstToken, this.secondToken, value.toFixed());
    if (tokensBack && value.eq(this.liquidityInput.value)) {
      this.firstTokenInput.value = isNaN(Number(tokensBack.amountA)) ? '0' : tokensBack.amountA;
      this.secondTokenInput.value = isNaN(Number(tokensBack.amountB)) ? '0' : tokensBack.amountB;
    }
    this.approvalModelAction?.checkAllowance(this.lpToken, this.liquidityInput.value);
  }

  private updateButton(status: boolean) {
    this.btnRemove.rightIcon.visible = status;
    this.updateButtonText();
    this.firstTokenInput.enabled = !status;
    this.secondTokenInput.enabled = !status;
  }

  private async onUpdateToken(token: ITokenObject, isFrom: boolean) {
    const symbol = token.symbol;
    if (isFrom) {
      this.firstToken = token;
      if (this.secondToken?.symbol === symbol) {
        this.secondTokenInput.token = undefined;
        this.resetSecondInput();
        if (this.firstTokenInput.isConnected) this.firstTokenInput.value = '';
        this.firstInputAmount = '';
      } else {
        const limit = limitDecimals(this.firstInputAmount, token.decimals || 18);
        if (!new BigNumber(this.firstInputAmount).eq(limit)) {
          if (this.firstTokenInput.isConnected) this.firstTokenInput.value = limit;
          this.firstInputAmount = limit;
        }
      }
    } else {
      this.secondToken = token;
      if (this.firstToken?.symbol === symbol) {
        this.firstTokenInput.token = undefined;
        this.resetFirstInput();
        if (this.secondTokenInput.isConnected) this.secondTokenInput.value = '';
        this.secondInputAmount = '';
      } else {
        const limit = limitDecimals(this.secondInputAmount, token.decimals || 18);
        if (!new BigNumber(this.secondInputAmount).eq(limit)) {
          if (this.secondTokenInput.isConnected) this.secondTokenInput.value = limit;
          this.secondInputAmount = limit;
        }
      }
    }
  }

  private async onSelectToken(token: any, isFrom: boolean) {
    if (!token) return;
    const symbol = token.symbol;
    if ((isFrom && this.firstToken?.symbol === symbol) || (!isFrom && this.secondToken?.symbol === symbol)) return;
    this.updateButton(true);
    try {
      this.onUpdateToken(token, isFrom);
      if (!this.firstToken || !this.secondToken) {
        this.resetUI();
        return;
      }
      this.pricePanel.visible = true;
      this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
      this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
      await this.checkPairExists();
      await this.callAPIBundle();
      this.renderLiquidity();
      this.btnRemove.rightIcon.visible = false;
      this.updateButton(false);
    } catch {
      this.updateButton(false);
    }
  }

  private resetUI() {
    this.lbLiquidityBalance.caption = `Balance: 0`;
    this.maxLiquidityBalance = '';
    this.liquidityInput.value = this.maxLiquidityBalance;
    this.lpToken = undefined;
    this.pricePanel.visible = false;
    this.pnlLiquidityImage.clearInnerHTML();
    this.pnlInfo.clearInnerHTML();
    this.updateButton(false);
  }

  private handleApprove() {
    this.approvalModelAction.doApproveAction(this.lpToken, this.liquidityInput.value);
  }

  private updateBtnRemove = () => {
    if (!isClientWalletConnected()) {
      this.btnRemove.caption = 'Connect Wallet';
      this.btnRemove.enabled = true;
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      this.btnRemove.caption = 'Switch Network';
      this.btnRemove.enabled = true;
      return;
    }
    if (!this.firstToken || !this.secondToken) {
      this.btnRemove.caption = 'Invalid Pair';
      this.btnRemove.enabled = false;
      return;
    }
    const lqAmount = new BigNumber(this.liquidityInput.value || 0);
    const canRemove = lqAmount.gt(0) && lqAmount.lte(this.maxLiquidityBalance);
    this.btnRemove.caption = canRemove || lqAmount.isZero() ? 'Remove' : 'Insufficient balance';
    this.btnRemove.enabled = canRemove;
  }

  private handleAction() {
    this.approvalModelAction.doPayAction();
  }

  private onSubmit() {
    if (!isClientWalletConnected() || !this.state.isRpcWalletConnected()) {
      this.connectWallet();
      return;
    }
    this.showTxStatusModal('warning', `Removing ${this.firstToken.symbol}/${this.secondToken.symbol}`);
    removeLiquidity(
      this.state,
      this.firstToken,
      this.secondToken,
      this.liquidityInput.value,
      this.firstTokenInput.value,
      this.secondTokenInput.value
    );
  }

  private async initApprovalModelAction() {
    if (!this.state.isRpcWalletConnected()) return;
    if (this.approvalModelAction) {
      this.state.approvalModel.spenderAddress = this.contractAddress;
      return;
    }
    this.approvalModelAction = await this.state.setApprovalModelAction({
      sender: this,
      payAction: async () => {
        if (!this.firstToken || !this.secondToken) return;
        this.onSubmit();
      },
      onToBeApproved: async (token: ITokenObject) => {
        this.btnApprove.caption = `Approve`;
        this.btnApprove.visible = true
        this.btnApprove.enabled = true;
        this.btnRemove.enabled = false;
      },
      onToBePaid: async (token: ITokenObject) => {
        this.btnApprove.visible = false;
        this.updateBtnRemove();
      },
      onApproving: async (token: ITokenObject, receipt?: string) => {
        this.btnApprove.rightIcon.visible = true;
        this.btnApprove.enabled = false;
        this.btnApprove.caption = `Approving`;
        if (receipt) {
          this.showTxStatusModal('success', receipt);
        }
      },
      onApproved: async (token: ITokenObject) => {
        this.btnApprove.rightIcon.visible = false;
        this.btnApprove.visible = false;
        this.btnApprove.caption = 'Approved';
        this.updateBtnRemove();
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        this.showTxStatusModal('error', err);
        this.btnApprove.rightIcon.visible = false;
        this.btnApprove.enabled = true;
        this.btnApprove.caption = 'Approve';
      },
      onPaying: async (receipt?: string) => {
        if (receipt) {
          this.showTxStatusModal('success', receipt);
        }
        this.btnRemove.rightIcon.visible = true;
      },
      onPaid: async () => {
        await tokenStore.updateAllTokenBalances(this.state.getRpcWallet());
        this.btnRemove.rightIcon.visible = false;
      },
      onPayingError: async (err: Error) => {
        this.showTxStatusModal('error', err);
        this.btnRemove.rightIcon.visible = false;
      }
    });
    this.state.approvalModel.spenderAddress = this.contractAddress;
  }

  private async checkPairExists() {
    if (!this.firstToken || !this.secondToken) return;
    try {
      let pair = await getPairFromTokens(this.state, this.firstToken, this.secondToken);
      if (!pair || pair.address === Utils.nullAddress) {
        this.toggleCreateMessage(true)
      } else {
        let totalSupply = await pair?.totalSupply();
        this.toggleCreateMessage(totalSupply?.isZero())
      }
    } catch (err) {
      this.toggleCreateMessage(true)
    }
  }

  private async callAPIBundle() {
    if (!this.firstToken || !this.secondToken) return;
    if (!this.lbFirstPrice.isConnected) await this.lbFirstPrice.ready();
    if (!this.lbSecondPrice.isConnected) await this.lbSecondPrice.ready();
    if (!this.lbShareOfPool.isConnected) await this.lbShareOfPool.ready();
    const info = await getRemoveLiquidityInfo(this.state, this.firstToken, this.secondToken);
    this.removeInfo = {
      maxBalance: info?.totalPoolTokens || '',
      totalPoolTokens: info.totalPoolTokens ? formatNumber(info.totalPoolTokens, 4) : '',
      poolShare: info.poolShare ? `${formatNumber(new BigNumber(info.poolShare).times(100), 2)}%` : '',
      tokenAShare: info.tokenAShare ? formatNumber(info.tokenAShare, 4) : '',
      tokenBShare: info.tokenBShare ? formatNumber(info.tokenBShare, 4) : ''
    }
    this.lbFirstPrice.caption = `1 ${this.firstTokenSymbol} = ${formatNumber(info.price0, 4)} ${this.secondTokenSymbol}`;
    this.lbSecondPrice.caption = `1 ${this.secondTokenSymbol} = ${formatNumber(info.price1, 4)} ${this.firstTokenSymbol}`;
    this.lbShareOfPool.caption = this.removeInfo.poolShare;
    this.firstTokenInput.value = this.removeInfo.tokenAShare;
    this.secondTokenInput.value = this.removeInfo.tokenBShare;
    this.lbLiquidityBalance.caption = `Balance: ${this.removeInfo.totalPoolTokens}`;
    this.maxLiquidityBalance = info.totalPoolTokens;
    this.liquidityInput.value = this.maxLiquidityBalance;
    this.lpToken = info.lpToken;
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    const state = this.getAttribute('state', true);
    if (state) {
      this.state = state;
    }
    const tokens = this.getAttribute('tokens', true, []);
    const providers = this.getAttribute('providers', true, []);
    await this.setData({ providers, tokens });
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  private toggleCreateMessage(value: boolean) {
    this.pnlCreatePairMsg.visible = value;
  }

  private showTxStatusModal = (status: 'warning' | 'success' | 'error', content?: string | Error) => {
    if (!this.txStatusModal) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    this.txStatusModal.message = { ...params };
    this.txStatusModal.showModal();
  }

  render() {
    return (
      <i-panel class={poolRemoveStyle}>
        <i-panel>
          <i-vstack
            id="pnlCreatePairMsg" visible={false}
            background={{ color: Theme.background.gradient }}
            padding={{ left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }}
            margin={{ bottom: '1rem' }}
            gap="1rem"
          >
            <i-label caption='You are the first liquidity provider.' font={{ color: '#fff' }} />
            <i-label caption='The ratio of tokens you add will set the price of this pool.' font={{ color: '#fff' }} />
            <i-label caption='Once you are happy with the rate click supply to review.' font={{ color: '#fff' }} />
          </i-vstack>
          <i-vstack>
            <i-vstack
              padding={{ top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }}
              border={{ color: '#E53780', width: '1px', style: 'solid', radius: 12 }}
              margin={{ top: 10, bottom: 10 }}
              gap="0.5rem"
            >
              <i-hstack horizontalAlignment="space-between" margin={{ bottom: 4 }}>
                <i-label caption="Input" />
                <i-label id="lbLiquidityBalance" caption="-" font={{ color: Theme.colors.warning.main }} />
              </i-hstack>
              <i-hstack horizontalAlignment="space-between" verticalAlignment="center" gap={10}>
                <i-input id="liquidityInput" class="bg-transparent" height={30} value="0" onChanged={this.onLiquidityChange} />
                <i-panel id="pnlLiquidityImage" class="text-right" />
              </i-hstack>
            </i-vstack>
            <i-hstack horizontalAlignment="center">
              <i-icon width={20} height={20} name="arrow-down" fill="#fff" />
            </i-hstack>
          </i-vstack>
          <i-vstack
            padding={{ top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }}
            border={{ color: '#E53780', width: '1px', style: 'solid', radius: 12 }}
            margin={{ top: 10, bottom: 10 }}
            gap="0.5rem"
          >
            <i-scom-token-input id="firstTokenInput" title="Output" width="100%" isBtnMaxShown={false} isBalanceShown={false} isCommonShown={false} onInputAmountChanged={() => this.handleEnterAmount(true)} />
          </i-vstack>
          <i-hstack horizontalAlignment="center">
            <i-icon width={20} height={20} name="plus" fill="#fff" />
          </i-hstack>
          <i-vstack
            padding={{ top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }}
            border={{ color: '#E53780', width: '1px', style: 'solid', radius: 12 }}
            margin={{ top: 10, bottom: 10 }}
            gap="0.5rem"
          >
            <i-scom-token-input id="secondTokenInput" title="Output" width="100%" isBtnMaxShown={false} isBalanceShown={false} isCommonShown={false} onInputAmountChanged={() => this.handleEnterAmount()} />
          </i-vstack>
          <i-vstack
            id="pricePanel"
            padding={{ top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }}
            border={{ color: '#E53780', width: '1px', style: 'solid', radius: 12 }}
            margin={{ top: 10, bottom: 10 }}
            gap="0.5rem"
            visible={false}
          >
            <i-label margin={{ bottom: 12 }} caption="Prices and pool share" />
            <i-hstack horizontalAlignment="space-between" verticalAlignment="center">
              <i-panel>
                <i-panel class="text-center">
                  <i-label id="lbFirstPrice" caption="-" />
                </i-panel>
                <i-panel class="text-center">
                  <i-label id="lbFirstPriceTitle" opacity={0.7} caption="per" />
                </i-panel>
              </i-panel>
              <i-panel>
                <i-panel class="text-center">
                  <i-label id="lbSecondPrice" caption="-" />
                </i-panel>
                <i-panel class="text-center">
                  <i-label id="lbSecondPriceTitle" opacity={0.7} caption="per" />
                </i-panel>
              </i-panel>
              <i-panel>
                <i-panel class="text-center">
                  <i-label id="lbShareOfPool" caption="0%" />
                </i-panel>
                <i-panel class="text-center">
                  <i-label opacity={0.7} caption="Share of pool" />
                </i-panel>
              </i-panel>
            </i-hstack>
          </i-vstack>
          <i-button
            id="btnApprove" visible={false}
            class="btn-swap" height="65"
            caption="Approve"
            rightIcon={{ spin: true, visible: false }}
            onClick={this.handleApprove}
          />
          <i-button
            id="btnRemove" class="btn-swap" enabled={false} height="65" caption=''
            rightIcon={{ spin: true, visible: false }}
            onClick={this.handleAction}
          />
          <i-vstack id="pnlInfo" />
        </i-panel>
        <i-scom-tx-status-modal id="txStatusModal" />
      </i-panel>
    )
  }
}
