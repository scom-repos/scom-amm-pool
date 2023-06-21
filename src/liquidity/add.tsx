import { customModule, Control, Module, Styles, Input, Button, Panel, Label, Modal, IEventBus, application, Image, Container, customElements, ControlElement, Icon, HStack } from '@ijstech/components';
import { Result } from '../result/index';
import { TokenSelection } from '../token-selection/index';
import { formatNumber, ITokenObject, EventId, limitInputNumber, limitDecimals, IERC20ApprovalAction, IProviderUI, IProvider, ICommissionInfo, IPoolDetailConfig, ICustomTokenObject } from '../global/index';
import { BigNumber } from '@ijstech/eth-wallet';
import { getSlippageTolerance, isWalletConnected, getChainId, getSupportedTokens, nullAddress, getProxyAddress, getEmbedderCommissionFee } from '../store/index';
import { getNewShareInfo, getPricesInfo, addLiquidity, getApprovalModelAction, calculateNewPairShareInfo, getPairFromTokens, getRouterAddress, getCurrentCommissions, getCommissionAmount } from '../API';
import { assets as tokenAssets, tokenStore } from '@scom/scom-token-list';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolAddElement extends ControlElement {
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
  commissions?: ICommissionInfo[]
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-amm-pool-add"]: ScomAmmPoolAddElement;
    }
  }
}

@customModule
@customElements('i-scom-amm-pool-add')
export class ScomAmmPoolAdd extends Module {
  private firstInput: Input;
  private secondInput: Input;
  private btnApproveFirstToken: Button;
  private btnApproveSecondToken: Button;
  private btnSupply: Button;
  private confirmSupplyModal: Modal;
  private resultEl: Result;
  private firstTokenSelection: TokenSelection;
  private secondTokenSelection: TokenSelection;
  private firstToken?: ITokenObject;
  private secondToken?: ITokenObject;
  private lbFirstBalance: Label;
  private lbSecondBalance: Label;
  private firstBalance: string = '0';
  private secondBalance: string = '0';
  private lbFirstPrice: Label;
  private lbFirstPriceTitle: Label;
  private lbSecondPrice: Label;
  private lbSecondPriceTitle: Label;
  private lbShareOfPool: Label;
  private isFromEstimated: boolean;
  private approvalModelAction: IERC20ApprovalAction;
  private $eventBus: IEventBus;
  private firstInputAmount: string = '';
  private secondInputAmount: string = '';
  private firstTokenImage1: Image;
  private secondTokenImage1: Image;
  private firstTokenImage2: Image;
  private secondTokenImage2: Image;
  private lbFirstInput: Label;
  private lbSecondInput: Label;
  private lbPoolTokensTitle: Label;
  private lbOutputEstimated: Label;
  private lbFirstDeposited: Label;
  private lbSecondDeposited: Label;
  private lbSummaryFirstPrice: Label;
  private lbSummarySecondPrice: Label;
  private lbShareOfPool2: Label;
  private poolTokenAmount: string;
  private lbPoolTokenAmount: Label;
  private pnlCreatePairMsg: Panel;
  private pricePanel: Panel;
  private hStackCommissionInfo: HStack;
  private iconCommissionFee: Icon;
  private lbFirstCommission: Label;
  private lbSecondCommission: Label;

  private lbLabel1: Label;
  private lbLabel2: Label;

  private _data: IPoolDetailConfig = {
    providers: [],
    tokens: [],
  }
  private currentChainId: number;
  private allTokenBalancesMap: any;
  private isInited: boolean = false;

  tag: any = {};
  private contractAddress: string;

  constructor(parent?: Container, options?: ScomAmmPoolAddElement) {
    super(parent, options);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  static async create(options?: ScomAmmPoolAddElement, parent?: Container) {
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

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: ICommissionInfo[]) {
    this._data.commissions = value;
  }

  private get originalData() {
    if (!this._data) return undefined;
    const { providers } = this._data;
    if (!providers?.length) return undefined;
    let _providers: IProvider[] = [];

    let providersByKeys: { [key: string]: IProviderUI[] } = {};
    providers.forEach(v => {
      if (!providersByKeys[v.key]) {
        providersByKeys[v.key] = [];
      }
      providersByKeys[v.key].push(v);
    });
    Object.keys(providersByKeys).forEach(k => {
      const arr = providersByKeys[k];
      const { key, caption, image, dexId } = arr[0];
      let defaultProvider: IProvider = {
        caption,
        image,
        key,
        dexId
      }
      _providers.push(defaultProvider);
    })
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
    if (getCurrentCommissions(this.commissions).length) {
      this.contractAddress = getProxyAddress();
    } else {
      this.contractAddress = getRouterAddress(getChainId());
    }
    if (this.approvalModelAction) {
      this.approvalModelAction.setSpenderAddress(this.contractAddress);
      this.updateCommissionInfo();
    }
  }

  private updateCommissionInfo = () => {
    if (getCurrentCommissions(this.commissions).length) {
      this.hStackCommissionInfo.visible = true;
      const commissionFee = getEmbedderCommissionFee();
      this.iconCommissionFee.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
      if (this.firstToken && this.secondToken) {
        const firstAmount = new BigNumber(this.firstInputAmount || 0);
        const secondAmount = new BigNumber(this.secondInputAmount || 0);
        const firstCommission = getCommissionAmount(this.commissions, firstAmount);
        const secondCommission = getCommissionAmount(this.commissions, secondAmount);
        this.lbFirstCommission.caption = `${formatNumber(firstAmount.plus(firstCommission))} ${this.firstToken.symbol || ''}`;
        this.lbSecondCommission.caption = `${formatNumber(secondAmount.plus(secondCommission))} ${this.secondToken.symbol || ''}`;
        this.hStackCommissionInfo.visible = true;
      } else {
        this.hStackCommissionInfo.visible = false;
      }
    } else {
      this.hStackCommissionInfo.visible = false;
    }
  }

  private onSetupPage = async (connected: boolean, _chainId?: number) => {
    this.currentChainId = _chainId ? _chainId : getChainId();
    if (!this.btnSupply.isConnected) await this.btnSupply.ready();
    if (!this.lbFirstBalance.isConnected) await this.lbFirstBalance.ready();
    if (!this.lbSecondBalance.isConnected) await this.lbSecondBalance.ready();
    if (!this.lbLabel1.isConnected) await this.lbLabel1.ready();
    if (!this.lbLabel2.isConnected) await this.lbLabel2.ready();
    if (!this.firstInput.isConnected) await this.firstInput.ready();
    if (!this.secondInput.isConnected) await this.secondInput.ready();
    this.resetFirstInput();
    this.resetSecondInput();
    this.updateCommissionInfo();
    tokenStore.updateTokenMapData();
    if (connected) {
      await tokenStore.updateAllTokenBalances();
      if (!this.approvalModelAction) await this.initApprovalModelAction();
    }
    this.firstTokenSelection.isBtnMaxShown = true;
    this.secondTokenSelection.isBtnMaxShown = true;
    const tokens = getSupportedTokens(this._data.tokens || [], this.currentChainId);
    const isReadonly = tokens.length === 2;
    this.firstTokenSelection.disableSelect = isReadonly;
    this.secondTokenSelection.disableSelect = isReadonly;
    this.firstTokenSelection.tokenDataListProp = tokens;
    this.secondTokenSelection.tokenDataListProp = tokens;
    const label = 'Input';
    this.lbLabel1.caption = label;
    this.lbLabel2.caption = label;
    this.setFixedPairData();
    if (connected) {
      try {
        this.updateButtonText();
        await this.updateBalance();
        if (this.firstToken && this.secondToken) {
          if (!this.lbFirstPriceTitle.isConnected) await this.lbFirstPriceTitle.ready();
          this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
          if (!this.lbSecondPriceTitle.isConnected) await this.lbSecondPriceTitle.ready();
          this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
        }
        const isShown = parseFloat(this.firstBalance) > 0 && parseFloat(this.secondBalance) > 0;
        this.pricePanel.visible = isShown;
        await this.checkPairExists();
        if (tokens.length >= 2 && new BigNumber(this.firstInput.value).isNaN() && new BigNumber(this.firstInput.value).isNaN()) {
          this.updateCommissionInfo();
          return;
        }
        await this.callAPIBundle(false);
      } catch {
        this.btnSupply.caption = 'Supply';
      }
    } else {
      this.resetData();
    }
    this.updateCommissionInfo();
  }

  private setFixedPairData() {
    let currentChainTokens = this._data.tokens.filter((token) => token.chainId === this.currentChainId);
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
    this.firstTokenSelection.onSetMaxBalance = () => this.setMaxBalance(true);
    this.firstTokenSelection.isCommonShown = false;
    this.secondTokenSelection.disableSelect = false;
    this.secondTokenSelection.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, false);
    this.secondTokenSelection.onSetMaxBalance = () => this.setMaxBalance(false);
    this.secondTokenSelection.isCommonShown = false;
    this.isInited = true;
  }

  private getBalance(token?: ITokenObject) {
    if (token && this.allTokenBalancesMap) {
      const address = token.address || '';
      let balance = address ? this.allTokenBalancesMap[address.toLowerCase()] ?? 0 : this.allTokenBalancesMap[token.symbol] || 0;
      return balance
    }
    return 0;
  }

  private async updateBalance() {
    if (isWalletConnected()) await tokenStore.updateAllTokenBalances();
    this.allTokenBalancesMap = isWalletConnected() ? tokenStore.tokenBalances : [];
    if (this.firstToken) {
      this.firstBalance = this.getBalance(this.firstToken);
      this.lbFirstBalance.caption = `Balance: ${formatNumber(this.firstBalance, 4)} ${this.firstToken.symbol}`;
    } else {
      this.firstInput.value = '';
      this.firstToken = Object.values(tokenStore.tokenMap).find(v => v.isNative);
      this.firstTokenSelection.token = this.firstToken;
      this.firstBalance = tokenStore.getTokenBalance(this.firstToken!);
      this.lbFirstBalance.caption = `Balance: ${formatNumber(this.firstBalance)}`;
    }
    if (this.secondToken) {
      this.secondBalance = this.getBalance(this.secondToken);
      this.lbSecondBalance.caption = `Balance: ${formatNumber(this.secondBalance, 4)} ${this.secondToken.symbol}`;
    } else {
      this.secondToken = undefined;
      this.secondInput.value = '';
      this.secondBalance = '0';
      this.secondTokenSelection.token = this.secondToken;
      this.lbSecondBalance.caption = '-';
    }
  }

  private resetData() {
    this.btnSupply.caption = 'Connect Wallet';
    this.btnSupply.enabled = false;
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
    this.lbFirstBalance.caption = 'Balance: 0';
    this.lbSecondBalance.caption = 'Balance: 0';
    this.initTokenSelection();
  }

  private async initData() {
    await this.initTokenSelection();
    await this.initApprovalModelAction();
  }

  private updateButtonText() {
    if (!this.btnSupply || !this.btnSupply.hasChildNodes()) return;
    this.btnSupply.enabled = false;
    if (!isWalletConnected()) {
      this.btnSupply.caption = 'Connect Wallet';
      return;
    }
    const firstCommissionAmount = getCommissionAmount(this.commissions, new BigNumber(this.firstInput.value || 0));
    const secondCommissionAmount = getCommissionAmount(this.commissions, new BigNumber(this.secondInput.value || 0));
    if (this.btnSupply.rightIcon.visible) {
      this.btnSupply.caption = 'Loading';
    } else if (
      !this.firstToken?.symbol ||
      !this.secondToken?.symbol ||
      [this.firstToken?.symbol, this.secondToken?.symbol].every(v => v === 'ETH' || v === 'WETH')
    ) {
      this.btnSupply.caption = 'Invalid Pair';
    } else if (new BigNumber(this.firstInput.value).isZero() || new BigNumber(this.secondInput.value).isZero()) {
      this.btnSupply.caption = 'Enter Amount';
    } else if (new BigNumber(this.firstInput.value).plus(firstCommissionAmount).gt(this.firstBalance)) {
      this.btnSupply.caption = `Insufficient ${this.firstToken?.symbol} balance`;
    } else if (new BigNumber(this.secondInput.value).plus(secondCommissionAmount).gt(this.secondBalance)) {
      this.btnSupply.caption = `Insufficient ${this.secondToken?.symbol} balance`;
    } else if (new BigNumber(this.firstInput.value).gt(0) && new BigNumber(this.secondInput.value).gt(0)) {
      this.btnSupply.caption = 'Supply';
      this.btnSupply.enabled = !(this.btnApproveFirstToken.visible || this.btnApproveSecondToken.visible);
    } else {
      this.btnSupply.caption = 'Enter Amount';
    }
  }

  private onCheckInput(value: string) {
    const inputValue = new BigNumber(value);
    if (inputValue.isNaN()) {
      this.firstInput.value = '';
      this.firstInputAmount = '0';
      this.secondInput.value = '';
      this.secondInputAmount = '0';
      return false;
    }
    return inputValue.gt(0);
  }

  private async handleInputChange(source: Control) {
    let amount = (source as Input).value;
    if (source == this.firstInput) {
      limitInputNumber(this.firstInput, this.firstTokenDecimals);
      amount = this.firstInput.value;
      if (this.firstInputAmount === amount) return;
    } else {
      limitInputNumber(this.secondInput, this.secondTokenDecimals);
      amount = this.secondInput.value;
      if (this.secondInputAmount === amount) return;
    }
    if (!this.onCheckInput(amount)) {
      this.updateButtonText();
      return;
    };
    this.updateButton(true);
    try {
      this.isFromEstimated = source === this.secondInput;
      if (source === this.firstInput)
        this.firstInputAmount = this.firstInput.value;
      else if (source === this.secondInput)
        this.secondInputAmount = this.secondInput.value;
      await this.checkPairExists();
      await this.callAPIBundle(true);
      this.updateButton(false);
    } catch {
      this.updateButton(false);
    }
  }

  private async handleEnterAmount(source: Control) {
    await this.handleInputChange(source);
    this.updateCommissionInfo();
  }

  private resetFirstInput() {
    this.firstToken = undefined;
    this.firstBalance = '0';
    this.lbFirstBalance.caption = '-';
    this.firstInput.value = '';
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
  }

  private resetSecondInput() {
    this.secondToken = undefined;
    this.secondBalance = '0';
    this.lbSecondBalance.caption = '-';
    this.secondInput.value = '';
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
  }

  private async setMaxBalance(isFrom: boolean) {
    if (!isWalletConnected()) return;
    this.isFromEstimated = !isFrom;
    const balance = new BigNumber(isFrom ? this.firstBalance : this.secondBalance);
    let inputVal = balance;
    const commissionAmount = getCommissionAmount(this.commissions, balance);
    if (commissionAmount.gt(0)) {
      const totalFee = balance.plus(commissionAmount).dividedBy(balance);
      inputVal = inputVal.dividedBy(totalFee);
    }
    if (isFrom) {
      const maxVal = limitDecimals(inputVal, this.firstTokenDecimals);
      this.firstInputAmount = maxVal;
      this.firstInput.value = maxVal;
    } else {
      const maxVal = limitDecimals(inputVal, this.secondTokenDecimals);
      this.secondInputAmount = maxVal;
      this.secondInput.value = maxVal;
    }
    if (!this.onCheckInput(balance.toFixed())) {
      this.updateButtonText();
      this.updateCommissionInfo();
      return;
    };
    this.updateButton(true);
    try {
      await this.checkPairExists();
      await this.callAPIBundle(true);
    } catch { }
    this.updateCommissionInfo();
    this.updateButton(false);
  }

  private updateButton(status: boolean) {
    this.btnSupply.rightIcon.visible = status;
    this.updateButtonText();
    this.firstTokenSelection.enabled = !status;
    this.secondTokenSelection.enabled = !status;
  }

  private async onUpdateToken(token: ITokenObject, isFrom: boolean) {
    const symbol = token.symbol;
    const balance = this.getBalance(token);
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
      this.firstBalance = balance;
      if (this.lbFirstBalance.isConnected)
        this.lbFirstBalance.caption = `Balance: ${formatNumber(balance)}`;
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
      this.secondBalance = balance;
      if (this.lbSecondBalance.isConnected)
        this.lbSecondBalance.caption = `Balance: ${formatNumber(balance)}`;
    }
    this.updateCommissionInfo();
  }

  private async onSelectToken(token: any, isFrom: boolean) {
    if (!token) return;
    const symbol = token.symbol;
    if ((isFrom && this.firstToken?.symbol === symbol) || (!isFrom && this.secondToken?.symbol === symbol)) return;
    this.updateButton(true);
    try {
      this.onUpdateToken(token, isFrom);
      const isShown = parseFloat(this.firstBalance) > 0 && parseFloat(this.secondBalance) > 0;
      this.pricePanel.visible = isShown;
      if (this.firstToken && this.secondToken) {
        this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
        this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`
        await this.checkPairExists();
      }
      await this.callAPIBundle(false);
      this.btnSupply.rightIcon.visible = false;
      this.updateButton(false);
    } catch {
      this.updateButton(false);
    }
    this.updateCommissionInfo();
  }

  private handleApprove(source: Control) {
    if (source === this.btnApproveFirstToken) {
      this.showResultMessage(this.resultEl, 'warning', `Approving ${this.firstToken?.symbol} allowance`);
      this.btnApproveFirstToken.rightIcon.visible = true;
      if (this.firstToken) {
        this.approvalModelAction.doApproveAction(this.firstToken, this.firstInputAmount);
      }
      this.btnApproveFirstToken.rightIcon.visible = false;
    }
    else if (source === this.btnApproveSecondToken) {
      this.showResultMessage(this.resultEl, 'warning', `Approving ${this.secondToken?.symbol} allowance`);
      this.btnApproveSecondToken.rightIcon.visible = true;
      if (this.secondToken) {
        this.approvalModelAction.doApproveAction(this.secondToken, this.secondInputAmount);
      }
      this.btnApproveSecondToken.rightIcon.visible = false;
    }
  }

  private handleAction() {
    this.handleSupply();
  }

  private handleSupply() {
    if (!this.firstToken || !this.secondToken) return;
    const chainId = getChainId();
    this.firstTokenImage1.url = this.firstTokenImage2.url = tokenAssets.tokenPath(this.firstToken, chainId);
    this.secondTokenImage1.url = this.secondTokenImage2.url = tokenAssets.tokenPath(this.secondToken, chainId);
    const firstAmount = new BigNumber(this.firstInputAmount);
    const secondAmount = new BigNumber(this.secondInputAmount);
    const firstCommissionAmount = getCommissionAmount(this.commissions, firstAmount);
    const secondCommissionAmount = getCommissionAmount(this.commissions, secondAmount);
    this.lbFirstInput.caption = formatNumber(firstAmount.plus(firstCommissionAmount), 4);
    this.lbSecondInput.caption = formatNumber(secondAmount.plus(secondCommissionAmount), 4);
    this.lbPoolTokensTitle.caption = `${this.firstToken.symbol}/${this.secondToken.symbol} Pool Tokens`;
    this.lbOutputEstimated.caption = `Output is estimated. If the price changes by more than ${getSlippageTolerance()}% your transaction will revert.`
    this.lbFirstDeposited.caption = `${this.firstToken.symbol} Deposited`;
    this.lbSecondDeposited.caption = `${this.secondToken.symbol} Deposited`;
    this.lbSummaryFirstPrice.caption = `1 ${this.secondToken.symbol} = ${this.lbFirstPrice.caption} ${this.firstToken.symbol}`;
    this.lbSummarySecondPrice.caption = `1 ${this.firstToken.symbol} = ${this.lbSecondPrice.caption} ${this.secondToken.symbol}`;
    this.lbShareOfPool2.caption = this.lbShareOfPool.caption;
    this.lbPoolTokenAmount.caption = formatNumber(this.poolTokenAmount, 4);
    this.confirmSupplyModal.visible = true;
  }

  private handleConfirmSupply() {
    this.approvalModelAction.doPayAction();
  }

  private onSubmit() {
    this.showResultMessage(this.resultEl, 'warning', `Add Liquidity Pool ${this.firstToken.symbol}/${this.secondToken.symbol}`);
    if (this.isFromEstimated) {
      addLiquidity(
        this.secondToken,
        this.firstToken,
        this.secondInputAmount,
        this.firstInputAmount,
        this.commissions
      );
    }
    else {
      addLiquidity(
        this.firstToken,
        this.secondToken,
        this.firstInputAmount,
        this.secondInputAmount,
        this.commissions
      );
    }
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
        if (token == this.firstToken) {
          this.btnApproveFirstToken.caption = `Approve ${token.symbol}`;
          this.btnApproveFirstToken.visible = true
          this.btnApproveFirstToken.enabled = true;
          this.btnSupply.enabled = false;
        }
        else if (token == this.secondToken) {
          this.btnApproveSecondToken.caption = `Approve ${token.symbol}`;
          this.btnApproveSecondToken.visible = true
          this.btnApproveSecondToken.enabled = true;
          this.btnSupply.enabled = false;
        }
      },
      onToBePaid: async (token: ITokenObject) => {
        if (token === this.firstToken)
          this.btnApproveFirstToken.visible = false;
        else if (token === this.secondToken)
          this.btnApproveSecondToken.visible = false;
        this.updateButtonText();
      },
      onApproving: async (token: ITokenObject, receipt?: string) => {
        if (token == this.firstToken) {
          this.btnApproveFirstToken.rightIcon.visible = true;
          this.btnApproveFirstToken.enabled = false;
          this.btnApproveFirstToken.caption = `Approving ${token.symbol}`;
        }
        else if (token == this.secondToken) {
          this.btnApproveSecondToken.rightIcon.visible = true;
          this.btnApproveSecondToken.enabled = false;
          this.btnApproveSecondToken.caption = `Approving ${token.symbol}`;
        }
        if (receipt) {
          this.showResultMessage(this.resultEl, 'success', receipt);
        }
      },
      onApproved: async (token: ITokenObject) => {
        if (token == this.firstToken || token.symbol == this.firstToken?.symbol) {
          this.btnApproveFirstToken.rightIcon.visible = false;
          this.btnApproveFirstToken.visible = false;
        }
        else if (token == this.secondToken || token.symbol == this.secondToken?.symbol) {
          this.btnApproveSecondToken.rightIcon.visible = false;
          this.btnApproveSecondToken.visible = false;
        }
        this.updateButtonText();
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        this.showResultMessage(this.resultEl, 'error', err);
      },
      onPaying: async (receipt?: string) => {
        if (receipt) {
          this.showResultMessage(this.resultEl, 'success', receipt);
        }
        this.confirmSupplyModal.visible = false;
        this.btnSupply.rightIcon.visible = true;
      },
      onPaid: async () => {
        await tokenStore.updateAllTokenBalances();
        if (this.firstToken) {
          this.firstBalance = tokenStore.getTokenBalance(this.firstToken);
          this.lbFirstBalance.caption = `Balance: ${formatNumber(this.firstBalance)}`;
        }
        if (this.secondToken) {
          this.secondBalance = tokenStore.getTokenBalance(this.secondToken);
          this.lbSecondBalance.caption = `Balance: ${formatNumber(this.secondBalance)}`;
        }
        this.btnSupply.rightIcon.visible = false;
      },
      onPayingError: async (err: Error) => {
        this.showResultMessage(this.resultEl, 'error', err);
        this.btnSupply.rightIcon.visible = false;
      }
    }, this.contractAddress);
  }

  private async checkPairExists() {
    if (!this.firstToken || !this.secondToken)
      return;
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

  private async callAPIBundle(isNewShare: boolean) {
    if (!this.firstToken || !this.secondToken) return;
    if (!this.lbFirstPrice.isConnected) await this.lbFirstPrice.ready();
    if (!this.lbSecondPrice.isConnected) await this.lbSecondPrice.ready();
    if (!this.lbShareOfPool.isConnected) await this.lbShareOfPool.ready();

    if (isNewShare) {
      let newShareInfo;
      let invalidVal = false;
      if (this.isFromEstimated) {
        invalidVal = new BigNumber(this.firstInput.value).isNaN();
        newShareInfo = await getNewShareInfo(this.secondToken, this.firstToken, this.secondInput.value, this.firstInput.value, this.secondInput.value);
        const val = limitDecimals(newShareInfo?.quote || '0', this.firstTokenDecimals);
        this.firstInputAmount = val;
        this.firstInput.value = val;
        if (invalidVal)
          newShareInfo = await getNewShareInfo(this.secondToken, this.firstToken, this.secondInput.value, this.firstInput.value, this.secondInput.value);
      }
      else {
        invalidVal = new BigNumber(this.secondInput.value).isNaN();
        newShareInfo = await getNewShareInfo(this.firstToken, this.secondToken, this.firstInput.value, this.firstInput.value, this.secondInput.value);
        const val = limitDecimals(newShareInfo?.quote || '0', this.secondTokenDecimals);
        this.secondInputAmount = val;
        this.secondInput.value = val;
        if (invalidVal)
          newShareInfo = await getNewShareInfo(this.firstToken, this.secondToken, this.firstInput.value, this.firstInput.value, this.secondInput.value);
      }
      if (!newShareInfo) {
        this.lbFirstPrice.caption = '0';
        this.lbSecondPrice.caption = '0';
        this.lbShareOfPool.caption = '0%';
        this.poolTokenAmount = '0';
      }
      else {
        let shareOfPool = new BigNumber(newShareInfo.newShare).times(100).toFixed();
        this.lbFirstPrice.caption = formatNumber(newShareInfo.newPrice0, 3);
        this.lbSecondPrice.caption = formatNumber(newShareInfo.newPrice1, 3);
        this.lbShareOfPool.caption = `${formatNumber(shareOfPool, 2)}%`;
        this.poolTokenAmount = newShareInfo.minted;
      }
    }
    else {
      let pricesInfo = await getPricesInfo(this.firstToken, this.secondToken);
      if (!pricesInfo) {
        let newPairShareInfo = calculateNewPairShareInfo(this.firstToken, this.secondToken, this.firstInputAmount, this.secondInputAmount);
        this.lbFirstPrice.caption = formatNumber(newPairShareInfo.price0, 3);
        this.lbSecondPrice.caption = formatNumber(newPairShareInfo.price1, 3);
        this.poolTokenAmount = newPairShareInfo.minted;
        this.lbShareOfPool.caption = '100%';
      }
      else if (!pricesInfo.price0 || !pricesInfo.price1) {
        this.lbFirstPrice.caption = '0';
        this.lbSecondPrice.caption = '0';
        this.lbShareOfPool.caption = '0%';
      }
      else {
        const { price0, price1 } = pricesInfo;
        let shareOfPool = pricesInfo.totalSupply == '0' ? '0' : new BigNumber(pricesInfo.balance).div(pricesInfo.totalSupply).times(100).toFixed();
        this.lbFirstPrice.caption = formatNumber(price0, 3);
        this.lbSecondPrice.caption = formatNumber(price1, 3);
        this.lbShareOfPool.caption = `${formatNumber(shareOfPool, 2)}%`;
        if (this.isFromEstimated) {
          if (new BigNumber(this.secondInput.value).gt(0)) {
            const price = new BigNumber(price1).multipliedBy(this.secondInput.value).toFixed();
            const val = limitDecimals(price, this.firstTokenDecimals);
            this.firstInput.value = val;
            this.firstInputAmount = val;
          }
        } else {
          if (new BigNumber(this.firstInput.value).gt(0)) {
            const price = new BigNumber(price0).multipliedBy(this.firstInput.value).toFixed();
            const val = limitDecimals(price, this.secondTokenDecimals);
            this.secondInput.value = val;
            this.secondInputAmount = val;
          }
        }
      }
    }
    this.btnSupply.enabled = true;
    const firstCommissionAmount = getCommissionAmount(this.commissions, new BigNumber(this.firstInputAmount));
    const secondCommissionAmount = getCommissionAmount(this.commissions, new BigNumber(this.secondInputAmount));
    this.approvalModelAction.checkAllowance(this.firstToken, firstCommissionAmount.plus(this.firstInputAmount));
    this.approvalModelAction.checkAllowance(this.secondToken, secondCommissionAmount.plus(this.secondInputAmount));
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    const tokens = this.getAttribute('tokens', true, []);
    const providers = this.getAttribute('providers', true, []);
    const commissions = this.getAttribute('commissions', true, []);
    await this.setData({ commissions, providers, tokens });
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
          <i-vstack
            padding={{ top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }}
            border={{ color: '#E53780', width: '1px', style: 'solid', radius: 12 }}
            margin={{ top: 10, bottom: 10 }}
            gap="0.5rem"
          >
            <i-hstack horizontalAlignment="space-between">
              <i-label id="lbLabel1" caption='' />
              <i-label id="lbFirstBalance" font={{ color: Theme.colors.warning.main }} caption="-" />
            </i-hstack>
            <i-hstack horizontalAlignment="space-between" verticalAlignment="center" gap={10}>
              <i-input id="firstInput" class="bg-transparent" height={30} placeholder='0.0' onChanged={this.handleEnterAmount} />
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
              <i-label id="lbSecondBalance" font={{ color: Theme.colors.warning.main }} caption="-" />
            </i-hstack>
            <i-hstack horizontalAlignment="space-between" verticalAlignment="center" gap={10}>
              <i-input id="secondInput" class="bg-transparent" height={30} placeholder='0.0' onChanged={this.handleEnterAmount} />
              <i-scom-amm-pool-token-selection width="auto" id="secondTokenSelection" />
            </i-hstack>
          </i-vstack>
          <i-hstack id="hStackCommissionInfo" verticalAlignment="start" gap={10} wrap="wrap">
            <i-hstack gap={4} verticalAlignment="center">
              <i-label caption="Total" />
              <i-icon id="iconCommissionFee" name="question-circle" width={16} height={16} />
            </i-hstack>
            <i-vstack gap={10} margin={{ left: 'auto' }} verticalAlignment="center" horizontalAlignment="end">
              <i-label id="lbFirstCommission" font={{ size: '14px' }} />
              <i-label id="lbSecondCommission" font={{ size: '14px' }} />
            </i-vstack>
          </i-hstack>
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
            id="btnApproveSecondToken" visible={false} class="btn-swap" height="65" caption="Approve"
            onClick={this.handleApprove}
            rightIcon={{ spin: true, visible: false }}
          />
          <i-button
            id="btnSupply" class="btn-swap" enabled={false} height="65" caption=''
            rightIcon={{ spin: true, visible: false }}
            onClick={this.handleAction}
          />
        </i-panel>
        <i-modal id="confirmSupplyModal" title="Add Liquidity To Pool" closeIcon={{ name: 'times' }}>
          <i-label font={{ color: Theme.colors.warning.main, size: '1.125rem' }} caption='You will receive' />
          <i-hstack horizontalAlignment="space-between" margin={{ bottom: 24 }}>
            <i-label id="lbPoolTokenAmount" font={{ color: Theme.colors.warning.main, size: '1.5rem' }} caption='-' />
            <i-panel>
              <i-image id="firstTokenImage1" margin={{ right: '-0.5rem' }} zIndex={1} width={24} height={24} />
              <i-image id="secondTokenImage1" width={24} height={24} />
            </i-panel>
          </i-hstack>
          <i-label id="lbPoolTokensTitle" font={{ color: Theme.colors.warning.main }} />
          <i-label id="lbOutputEstimated" font={{ color: Theme.colors.warning.main, size: '0.75rem' }} />
          <i-hstack horizontalAlignment="space-between">
            <i-label id="lbFirstDeposited" font={{ color: Theme.colors.warning.main }} />
            <i-hstack verticalAlignment="center">
              <i-image id="firstTokenImage2" margin={{ right: 4 }} width={24} height={24} />
              <i-label id="lbFirstInput" font={{ color: Theme.colors.warning.main }} />
            </i-hstack>
          </i-hstack>
          <i-hstack horizontalAlignment="space-between">
            <i-label id="lbSecondDeposited" font={{ color: Theme.colors.warning.main }} />
            <i-hstack verticalAlignment="center">
              <i-image id="secondTokenImage2" margin={{ right: 4 }} width={24} height={24} />
              <i-label id="lbSecondInput" font={{ color: Theme.colors.warning.main }} />
            </i-hstack>
          </i-hstack>
          <i-hstack horizontalAlignment="space-between">
            <i-label font={{ color: Theme.colors.warning.main }} caption="Rates" />
            <i-panel>
              <i-panel class="text-right">
                <i-label id="lbSummaryFirstPrice" font={{ color: Theme.colors.warning.main }} />
              </i-panel>
              <i-panel class="text-right">
                <i-label id="lbSummarySecondPrice" font={{ color: Theme.colors.warning.main }} />
              </i-panel>
            </i-panel>
          </i-hstack>
          <i-hstack horizontalAlignment="space-between">
            <i-label font={{ color: Theme.colors.warning.main }} caption="Share of Pool" />
            <i-panel>
              <i-label id="lbShareOfPool2" font={{ color: Theme.colors.warning.main }} />
            </i-panel>
          </i-hstack>
          <i-button class="btn-swap" height="auto" caption="Confirm Supply" onClick={this.handleConfirmSupply} />
        </i-modal>
        <i-scom-amm-pool-result id="resultEl" />
      </i-panel>
    )
  }
}
