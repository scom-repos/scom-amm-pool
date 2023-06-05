import { customModule, Control, Module, Styles, Input, Button, Panel, Label, IEventBus, application, Container, customElements, ControlElement, observable } from '@ijstech/components';
import { Result } from '../result/index';
import { TokenSelection } from '../token-selection/index';
import { formatNumber, ITokenObject, EventId, limitInputNumber, limitDecimals, IERC20ApprovalAction, IPoolDetailConfig, IProviderUI, IProvider, ICustomTokenObject } from '../global/index';
import { BigNumber } from '@ijstech/eth-wallet';
import { isWalletConnected, getChainId, getSupportedTokens, nullAddress } from '../store/index';
import { getApprovalModelAction, getPairFromTokens, getRemoveLiquidityInfo, removeLiquidity, getTokensBack, getTokensBackByAmountOut, getRouterAddress } from '../API';
import { assets as tokenAssets, tokenStore } from '@scom/scom-token-list';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolRemoveElement extends ControlElement {
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
  private firstInput: Input;
  private secondInput: Input;
  private btnApproveFirstToken: Button;
  private btnRemove: Button;
  private resultEl: Result;
  private firstTokenSelection: TokenSelection;
  private secondTokenSelection: TokenSelection;
  private firstToken?: ITokenObject;
  private secondToken?: ITokenObject;
  private lbFirstPrice: Label;
  private lbFirstPriceTitle: Label;
  private lbSecondPrice: Label;
  private lbSecondPriceTitle: Label;
  private lbShareOfPool: Label;
  private approvalModelAction: IERC20ApprovalAction;
  private $eventBus: IEventBus;
  private firstInputAmount: string = '';
  private secondInputAmount: string = '';
  private pnlCreatePairMsg: Panel;
  private pricePanel: Panel;

  private pnlLiquidityImage: Panel;
  private lbLiquidityBalance: Label;
  private liquidityInput: Input;
  private lbLabel1: Label;
  private lbLabel2: Label;
  private pnlInfo: Panel;

  private _data: IPoolDetailConfig = {
    providers: [],
    tokens: []
  }
  private currentChainId: number;
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

  constructor(parent?: Container, options?: ScomAmmPoolRemoveElement) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  static async create(options?: ScomAmmPoolRemoveElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
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
    const { key, caption, image, dexId } = providers[0];
    let defaultProvider: IProvider = {
      caption,
      image,
      key,
      dexId
    };
    _providers.push(defaultProvider);
    return { providers: _providers };
  }

  private registerEvent() {
    this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect)
    this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletDisconnect)
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChange)
  }

  private onWalletConnect = async (connected: boolean) => {
    if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
      this.onChainChange();
    } else {
      this.updateContractAddress();
      if (this.originalData?.providers?.length) await this.onSetupPage(connected);
    }
  }

  private onWalletDisconnect = async (connected: boolean) => {
    if (!connected)
      await this.onSetupPage(connected);
  }

  private onChainChange = async () => {
    this.currentChainId = getChainId();
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
    await this.onSetupPage(isWalletConnected());
  }

  private updateContractAddress = () => {
    this.contractAddress = getRouterAddress(getChainId());
    if (this.approvalModelAction) {
      this.approvalModelAction.setSpenderAddress(this.contractAddress);
    }
  }

  private onSetupPage = async (connected: boolean) => {
    this.currentChainId = getChainId();
    if (!this.btnRemove.isConnected) await this.btnRemove.ready();
    if (!this.lbLabel1.isConnected) await this.lbLabel1.ready();
    if (!this.lbLabel2.isConnected) await this.lbLabel2.ready();
    if (!this.firstInput.isConnected) await this.firstInput.ready();
    if (!this.secondInput.isConnected) await this.secondInput.ready();
    if (!this.liquidityInput.isConnected) await this.liquidityInput.ready();
    this.resetFirstInput();
    this.resetSecondInput();
    this.liquidityInput.value = '';
    tokenStore.updateTokenMapData();
    if (connected) {
      await tokenStore.updateAllTokenBalances();
      if (!this.approvalModelAction) await this.initApprovalModelAction();
    }
    this.firstTokenSelection.isBtnMaxShown = false;
    this.secondTokenSelection.isBtnMaxShown = false;
    const tokens = getSupportedTokens(this._data.tokens || [], this.currentChainId);
    const isReadonly = tokens.length === 2;
    this.firstTokenSelection.disableSelect = isReadonly;
    this.secondTokenSelection.disableSelect = isReadonly;
    this.firstTokenSelection.tokenDataListProp = tokens;
    this.secondTokenSelection.tokenDataListProp = tokens;
    const label = 'Output';
    this.lbLabel1.caption = label;
    this.lbLabel2.caption = label;
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
    let firstTokenImagePath = tokenAssets.tokenPath(this.firstToken, getChainId());
    let secondTokenImagePath = tokenAssets.tokenPath(this.secondToken, getChainId());
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
    let currentChainTokens = this._data.tokens.filter((token) => token.chainId === this.currentChainId);
    if (!currentChainTokens.length && isWalletConnected()) {
      this.firstToken = Object.values(tokenStore.tokenMap).find(v => v.isNative);
      this.firstTokenSelection.token = this.firstToken;
      return;
    }
    if (currentChainTokens.length < 2) return;
    const providers = this.originalData?.providers;
    if (providers && providers.length) {
      const fromTokenAddress = currentChainTokens[0].address;
      const toTokenAddress = currentChainTokens[1].address;
      const fromToken = fromTokenAddress.toLowerCase().startsWith('0x') ? fromTokenAddress.toLowerCase() : fromTokenAddress;
      const toToken = toTokenAddress.toLowerCase().startsWith('0x') ? toTokenAddress.toLowerCase() : toTokenAddress;
      this.firstToken = tokenStore.tokenMap[fromToken];
      this.secondToken = tokenStore.tokenMap[toToken];
      this.onUpdateToken(this.firstToken, true);
      this.onUpdateToken(this.secondToken, false);
      this.firstTokenSelection.token = this.firstToken;
      this.secondTokenSelection.token = this.secondToken;
    }
  }

  private async initTokenSelection() {
    if (this.isInited) return;
    await this.firstTokenSelection.ready();
    await this.secondTokenSelection.ready();
    this.firstTokenSelection.disableSelect = false;
    this.firstTokenSelection.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, true);
    this.firstTokenSelection.isCommonShown = false;
    this.secondTokenSelection.disableSelect = false;
    this.secondTokenSelection.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, false);
    this.secondTokenSelection.isCommonShown = false;
    this.isInited = true;
  }

  private resetData() {
    this.btnRemove.caption = 'Connect Wallet';
    this.btnRemove.enabled = false;
    this.btnApproveFirstToken.visible = false;
    this.initTokenSelection();
  }

  private async initData() {
    await this.initTokenSelection();
    await this.initApprovalModelAction();
  }

  private updateButtonText() {
    if (!this.btnRemove || !this.btnRemove.hasChildNodes()) return;
    this.btnRemove.enabled = false;
    if (!isWalletConnected()) {
      this.btnRemove.caption = 'Connect Wallet';
      return;
    }
    if (this.btnRemove.rightIcon.visible) {
      this.btnRemove.caption = 'Loading';
    } else {
      this.updateBtnRemove();
    }
  }

  private async handleOutputChange(source: Control) {
    if (!this.firstToken || !this.secondToken) return;
    if (source === this.firstInput) {
      limitInputNumber(this.firstInput, this.firstToken.decimals);
      let tokensBack = await getTokensBackByAmountOut(this.firstToken, this.secondToken, this.firstToken, this.firstInput.value);
      if (tokensBack) {
        this.liquidityInput.value = tokensBack.liquidity;
        this.secondInput.value = tokensBack.amountB;
      }
    } else {
      limitInputNumber(this.secondInput, this.secondToken.decimals);
      let tokensBack = await getTokensBackByAmountOut(this.firstToken, this.secondToken, this.secondToken, this.secondInput.value);
      if (tokensBack) {
        this.liquidityInput.value = tokensBack.liquidity;
        this.firstInput.value = tokensBack.amountA;
      }
    }
    this.approvalModelAction?.checkAllowance(this.lpToken, this.liquidityInput.value);
  }

  private async handleEnterAmount(source: Control) {
    await this.handleOutputChange(source);
  }

  private resetFirstInput() {
    this.firstToken = undefined;
    this.firstInput.value = '';
    this.btnApproveFirstToken.visible = false;
  }

  private resetSecondInput() {
    this.secondToken = undefined;
    this.secondInput.value = '';
    this.btnApproveFirstToken.visible = false;
  }

  private setMaxLiquidityBalance() {
    if (!this.firstToken || !this.secondToken) return;
    this.liquidityInput.value = this.maxLiquidityBalance;
    this.onLiquidityChange();
  }

  private async onLiquidityChange() {
    if (!this.firstToken || !this.secondToken) return;
    limitInputNumber(this.liquidityInput, 18);
    let tokensBack = await getTokensBack(this.firstToken, this.secondToken, this.liquidityInput.value);
    if (tokensBack) {
      this.firstInput.value = isNaN(Number(tokensBack.amountA)) ? '0' : tokensBack.amountA;
      this.secondInput.value = isNaN(Number(tokensBack.amountB)) ? '0' : tokensBack.amountB;
    }
    this.approvalModelAction?.checkAllowance(this.lpToken, this.liquidityInput.value);
  }

  private updateButton(status: boolean) {
    this.btnRemove.rightIcon.visible = status;
    this.updateButtonText();
    this.firstTokenSelection.enabled = !status;
    this.secondTokenSelection.enabled = !status;
  }

  private async onUpdateToken(token: ITokenObject, isFrom: boolean) {
    const symbol = token.symbol;
    if (isFrom) {
      this.firstToken = token;
      if (this.secondToken?.symbol === symbol) {
        this.secondTokenSelection.token = undefined;
        this.resetSecondInput();
        if (this.firstInput.isConnected) this.firstInput.value = '';
        this.firstInputAmount = '';
      } else {
        const limit = limitDecimals(this.firstInputAmount, token.decimals || 18);
        if (!new BigNumber(this.firstInputAmount).eq(limit)) {
          if (this.firstInput.isConnected) this.firstInput.value = limit;
          this.firstInputAmount = limit;
        }
      }
    } else {
      this.secondToken = token;
      if (this.firstToken?.symbol === symbol) {
        this.firstTokenSelection.token = undefined;
        this.resetFirstInput();
        if (this.secondInput.isConnected) this.secondInput.value = '';
        this.secondInputAmount = '';
      } else {
        const limit = limitDecimals(this.secondInputAmount, token.decimals || 18);
        if (!new BigNumber(this.secondInputAmount).eq(limit)) {
          if (this.secondInput.isConnected) this.secondInput.value = limit;
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
      this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`
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
    if (!isWalletConnected()) {
      this.btnRemove.caption = 'Connect Wallet';
      this.btnRemove.enabled = false;
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
    this.showResultMessage(this.resultEl, 'warning', `Removing ${this.firstToken.symbol}/${this.secondToken.symbol}`);
    removeLiquidity(
      this.firstToken,
      this.secondToken,
      this.liquidityInput.value,
      this.firstInput.value,
      this.secondInput.value
    );
  }

  private async initApprovalModelAction() {
    if (!isWalletConnected()) return;
    this.approvalModelAction = await getApprovalModelAction({
      sender: this,
      payAction: async () => {
        if (!this.firstToken || !this.secondToken) return;
        this.onSubmit();
      },
      onToBeApproved: async (token: ITokenObject) => {
        this.btnApproveFirstToken.caption = `Approve`;
        this.btnApproveFirstToken.visible = true
        this.btnApproveFirstToken.enabled = true;
        this.btnRemove.enabled = false;
      },
      onToBePaid: async (token: ITokenObject) => {
        this.btnApproveFirstToken.enabled = false;
        this.btnApproveFirstToken.visible = true;
        this.updateBtnRemove();
      },
      onApproving: async (token: ITokenObject, receipt?: string) => {
        this.btnApproveFirstToken.rightIcon.visible = true;
        this.btnApproveFirstToken.enabled = false;
        this.btnApproveFirstToken.caption = `Approving`;
        if (receipt) {
          this.showResultMessage(this.resultEl, 'success', receipt);
        }
      },
      onApproved: async (token: ITokenObject) => {
        this.btnApproveFirstToken.rightIcon.visible = false;
        this.btnApproveFirstToken.visible = false;
        this.btnApproveFirstToken.caption = 'Approved';
        this.updateBtnRemove();
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        this.showResultMessage(this.resultEl, 'error', err);
        this.btnApproveFirstToken.rightIcon.visible = false;
        this.btnApproveFirstToken.enabled = true;
        this.btnApproveFirstToken.caption = 'Approve';
      },
      onPaying: async (receipt?: string) => {
        if (receipt) {
          this.showResultMessage(this.resultEl, 'success', receipt);
        }
        this.btnRemove.rightIcon.visible = true;
      },
      onPaid: async () => {
        await tokenStore.updateAllTokenBalances();
        this.btnRemove.rightIcon.visible = false;
      },
      onPayingError: async (err: Error) => {
        this.showResultMessage(this.resultEl, 'error', err);
        this.btnRemove.rightIcon.visible = false;
      }
    }, this.contractAddress);
  }

  private async checkPairExists() {
    if (!this.firstToken || !this.secondToken) return;
    try {
      let pair = await getPairFromTokens(this.firstToken, this.secondToken);
      if (!pair || pair.address === nullAddress) {
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
    const info = await getRemoveLiquidityInfo(this.firstToken, this.secondToken);
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
    this.firstInput.value = this.removeInfo.tokenAShare;
    this.secondInput.value = this.removeInfo.tokenBShare;
    this.lbLiquidityBalance.caption = `Balance: ${this.removeInfo.totalPoolTokens}`;
    this.maxLiquidityBalance = info.totalPoolTokens;
    this.liquidityInput.value = this.maxLiquidityBalance;
    this.lpToken = info.lpToken;
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    const tokens = this.getAttribute('tokens', true, []);
    const providers = this.getAttribute('providers', true, []);
    await this.setData({ providers, tokens });
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  private toggleCreateMessage(value: boolean) {
    this.pnlCreatePairMsg.visible = value;
  }

  private showResultMessage = (result: Result, status: 'warning' | 'success' | 'error', content?: string | Error) => {
    if (!result) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    result.message = { ...params };
    result.showModal();
  }

  render() {
    return (
      <i-panel>
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
              <i-hstack horizontalAlignment="space-between">
                <i-input id="liquidityInput" class="bg-transparent" value="0" onChanged={this.onLiquidityChange} />
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
            <i-hstack horizontalAlignment="space-between">
              <i-label id="lbLabel1" caption='' />
            </i-hstack>
            <i-hstack horizontalAlignment="space-between">
              <i-input id="firstInput" class="bg-transparent" placeholder='0.0' onChanged={this.handleEnterAmount} />
              <i-scom-amm-pool-token-selection width="auto" id="firstTokenSelection" />
            </i-hstack>
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
            <i-hstack horizontalAlignment="space-between">
              <i-label id="lbLabel2" caption='' />
            </i-hstack>
            <i-hstack horizontalAlignment="space-between">
              <i-input id="secondInput" class="bg-transparent" placeholder='0.0' onChanged={this.handleEnterAmount} />
              <i-scom-amm-pool-token-selection width="auto" id="secondTokenSelection" />
            </i-hstack>
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
            id="btnApproveFirstToken" visible={false}
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
        <i-scom-amm-pool-result id="resultEl" />
      </i-panel>
    )
  }
}
