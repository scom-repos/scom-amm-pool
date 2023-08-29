import { customModule, Control, Module, Styles, Button, Panel, Label, Modal, Image, Container, customElements, ControlElement, Icon, HStack } from '@ijstech/components';
import { formatNumber, limitInputNumber, limitDecimals, IProviderUI, IProvider, ICommissionInfo, IPoolDetailConfig, ICustomTokenObject } from '../global/index';
import { BigNumber, IERC20ApprovalAction, Utils } from '@ijstech/eth-wallet';
import { State, getSupportedTokens, isClientWalletConnected } from '../store/index';
import { getNewShareInfo, getPricesInfo, addLiquidity, calculateNewPairShareInfo, getPairFromTokens, getRouterAddress } from '../API';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomTokenInput from '@scom/scom-token-input';
import { poolAddStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomAmmPoolAddElement extends ControlElement {
  state: State;
  providers: IProviderUI[];
  tokens?: ICustomTokenObject[];
  commissions?: ICommissionInfo[];
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
  private btnApproveFirstToken: Button;
  private btnApproveSecondToken: Button;
  private btnSupply: Button;
  private confirmSupplyModal: Modal;
  private txStatusModal: ScomTxStatusModal;
  private firstTokenInput: ScomTokenInput;
  private secondTokenInput: ScomTokenInput;
  private firstToken?: ITokenObject;
  private secondToken?: ITokenObject;
  private firstBalance: string = '0';
  private secondBalance: string = '0';
  private lbFirstPrice: Label;
  private lbFirstPriceTitle: Label;
  private lbSecondPrice: Label;
  private lbSecondPriceTitle: Label;
  private lbShareOfPool: Label;
  private isFromEstimated: boolean;
  private approvalModelAction: IERC20ApprovalAction;
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

  private _state: State;
  private _data: IPoolDetailConfig = {
    providers: [],
    tokens: [],
  }
  private allTokenBalancesMap: any;
  private isInited: boolean = false;

  tag: any = {};
  private contractAddress: string;
  public connectWallet: () => void;

  constructor(parent?: Container, options?: ScomAmmPoolAddElement) {
    super(parent, options);
    if (options?.state) {
      this.state = options.state;
    }
  }

  static async create(options?: ScomAmmPoolAddElement, parent?: Container) {
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

  onWalletConnected = async (connected: boolean) => {
    // if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
    //   this.onChainChange();
    // } else {
    //   this.updateContractAddress();
    //   if (this.originalData?.providers?.length) await this.onSetupPage(connected);
    // }
    this.updateContractAddress();
    if (this.originalData?.providers?.length) await this.initializeWidgetConfig(connected);
  }

  onChainChange = async () => {
    this.updateContractAddress();
    if (this.originalData?.providers?.length) await this.initializeWidgetConfig(true);
    this.updateButtonText();
  }

  private async setData(data: IPoolDetailConfig) {
    this._data = data;
    this.updateContractAddress();
    await this.refreshUI();
  }

  private async refreshUI() {
    await this.initData();
    const instanceId = this.state.getRpcWallet()?.instanceId;
    const inputRpcWalletId = this.firstTokenInput.rpcWalletId;
    if (instanceId && inputRpcWalletId !== instanceId) {
      this.firstTokenInput.rpcWalletId = instanceId;
      this.secondTokenInput.rpcWalletId = instanceId;
    }
    await this.initializeWidgetConfig(isClientWalletConnected());
  }

  private updateContractAddress = () => {
    if (this.state.getCurrentCommissions(this.commissions).length) {
      this.contractAddress = this.state.getProxyAddress();
    } else {
      this.contractAddress = getRouterAddress(this.state.getChainId());
    }
    if (this.state?.approvalModel && this.approvalModelAction) {
      this.state.approvalModel.spenderAddress = this.contractAddress;
      this.updateCommissionInfo();
    }
  }

  private updateCommissionInfo = () => {
    if (this.state.getCurrentCommissions(this.commissions).length) {
      this.hStackCommissionInfo.visible = true;
      const commissionFee = this.state.embedderCommissionFee;
      this.iconCommissionFee.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
      if (this.firstToken && this.secondToken) {
        const firstAmount = new BigNumber(this.firstInputAmount || 0);
        const secondAmount = new BigNumber(this.secondInputAmount || 0);
        const firstCommission = this.state.getCommissionAmount(this.commissions, firstAmount);
        const secondCommission = this.state.getCommissionAmount(this.commissions, secondAmount);
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

  private initializeWidgetConfig = async (connected: boolean, _chainId?: number) => {
    setTimeout(async () => {
      const chainId = this.state.getChainId();
      tokenStore.updateTokenMapData(chainId);
      if (!this.btnSupply.isConnected) await this.btnSupply.ready();
      if (!this.firstTokenInput.isConnected) await this.firstTokenInput.ready();
      if (!this.secondTokenInput.isConnected) await this.secondTokenInput.ready();
      this.resetFirstInput();
      this.resetSecondInput();
      this.updateCommissionInfo();
      this.firstTokenInput.isBtnMaxShown = true;
      this.secondTokenInput.isBtnMaxShown = true;
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
          if (tokens.length >= 2 && new BigNumber(this.firstTokenInput.value).isNaN() && new BigNumber(this.firstTokenInput.value).isNaN()) {
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
    });
  }

  private setFixedPairData() {
    const chainId = this.state.getChainId();
    let currentChainTokens = this._data.tokens.filter((token) => token.chainId === chainId);
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
    this.firstTokenInput.onSetMaxBalance = () => this.setMaxBalance(true);
    this.firstTokenInput.isCommonShown = false;
    this.secondTokenInput.tokenReadOnly = false;
    this.secondTokenInput.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, false);
    this.secondTokenInput.onSetMaxBalance = () => this.setMaxBalance(false);
    this.secondTokenInput.isCommonShown = false;
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
    const rpcWallet = this.state.getRpcWallet();
    if (rpcWallet.address) {
      await tokenStore.updateAllTokenBalances(rpcWallet);
      this.allTokenBalancesMap = tokenStore.tokenBalances;
    }
    else {
      this.allTokenBalancesMap = {};
    }
    if (this.firstToken) {
      this.firstBalance = this.getBalance(this.firstToken);
    } else {
      this.firstTokenInput.value = '';
      this.firstToken = Object.values(tokenStore.tokenMap).find(v => v.isNative);
      this.firstTokenInput.token = this.firstToken;
      this.firstBalance = tokenStore.getTokenBalance(this.firstToken!);
    }
    if (this.secondToken) {
      this.secondBalance = this.getBalance(this.secondToken);
    } else {
      this.secondToken = undefined;
      this.secondTokenInput.value = '';
      this.secondBalance = '0';
      this.secondTokenInput.token = this.secondToken;
    }
  }

  private resetData() {
    this.updateButtonText();
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
    this.initTokenSelection();
  }

  private async initData() {
    await this.initTokenSelection();
    await this.initApprovalModelAction();
  }

  private updateButtonText() {
    if (!this.btnSupply || !this.btnSupply.hasChildNodes()) return;
    this.btnSupply.enabled = false;
    if (!isClientWalletConnected()) {
      this.btnSupply.enabled = true;
      this.btnSupply.caption = 'Connect Wallet';
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      this.btnSupply.enabled = true;
      this.btnSupply.caption = 'Switch Network';
      return;
    }
    const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, new BigNumber(this.firstTokenInput.value || 0));
    const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, new BigNumber(this.secondTokenInput.value || 0));
    if (this.btnSupply.rightIcon.visible) {
      this.btnSupply.caption = 'Loading';
    } else if (
      !this.firstToken?.symbol ||
      !this.secondToken?.symbol ||
      [this.firstToken?.symbol, this.secondToken?.symbol].every(v => v === 'ETH' || v === 'WETH')
    ) {
      this.btnSupply.caption = 'Invalid Pair';
    } else if (new BigNumber(this.firstTokenInput.value).isZero() || new BigNumber(this.secondTokenInput.value).isZero()) {
      this.btnSupply.caption = 'Enter Amount';
    } else if (new BigNumber(this.firstTokenInput.value).plus(firstCommissionAmount).gt(this.firstBalance)) {
      this.btnSupply.caption = `Insufficient ${this.firstToken?.symbol} balance`;
    } else if (new BigNumber(this.secondTokenInput.value).plus(secondCommissionAmount).gt(this.secondBalance)) {
      this.btnSupply.caption = `Insufficient ${this.secondToken?.symbol} balance`;
    } else if (new BigNumber(this.firstTokenInput.value).gt(0) && new BigNumber(this.secondTokenInput.value).gt(0)) {
      this.btnSupply.caption = 'Supply';
      this.btnSupply.enabled = !(this.btnApproveFirstToken.visible || this.btnApproveSecondToken.visible);
    } else {
      this.btnSupply.caption = 'Enter Amount';
    }
  }

  private onCheckInput(value: string) {
    const inputValue = new BigNumber(value);
    if (inputValue.isNaN()) {
      this.firstTokenInput.value = '';
      this.firstInputAmount = '0';
      this.secondTokenInput.value = '';
      this.secondInputAmount = '0';
      return false;
    }
    return inputValue.gt(0);
  }

  private async handleInputChange(isFrom?: boolean) {
    let amount: string;
    if (isFrom) {
      limitInputNumber(this.firstTokenInput, this.firstTokenDecimals);
      amount = this.firstTokenInput.value;
      if (this.firstInputAmount === amount) return;
    } else {
      limitInputNumber(this.secondTokenInput, this.secondTokenDecimals);
      amount = this.secondTokenInput.value;
      if (this.secondInputAmount === amount) return;
    }
    if (!this.onCheckInput(amount)) {
      this.updateButtonText();
      return;
    };
    this.updateButton(true);
    try {
      this.isFromEstimated = !isFrom;
      if (isFrom)
        this.firstInputAmount = this.firstTokenInput.value;
      else
        this.secondInputAmount = this.secondTokenInput.value;
      await this.checkPairExists();
      await this.callAPIBundle(true);
      this.updateButton(false);
    } catch {
      this.updateButton(false);
    }
  }

  private async handleEnterAmount(isFrom?: boolean) {
    await this.handleInputChange(isFrom);
    this.updateCommissionInfo();
  }

  private resetFirstInput() {
    this.firstToken = undefined;
    this.firstBalance = '0';
    this.firstTokenInput.value = '';
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
  }

  private resetSecondInput() {
    this.secondToken = undefined;
    this.secondBalance = '0';
    this.secondTokenInput.value = '';
    this.btnApproveFirstToken.visible = false;
    this.btnApproveSecondToken.visible = false;
  }

  private async setMaxBalance(isFrom: boolean) {
    if (!isClientWalletConnected()) return;
    this.isFromEstimated = !isFrom;
    const balance = new BigNumber(isFrom ? this.firstBalance : this.secondBalance);
    let inputVal = balance;
    const commissionAmount = this.state.getCommissionAmount(this.commissions, balance);
    if (commissionAmount.gt(0)) {
      const totalFee = balance.plus(commissionAmount).dividedBy(balance);
      inputVal = inputVal.dividedBy(totalFee);
    }
    if (isFrom) {
      const maxVal = limitDecimals(inputVal, this.firstTokenDecimals);
      this.firstInputAmount = maxVal;
      this.firstTokenInput.value = maxVal;
    } else {
      const maxVal = limitDecimals(inputVal, this.secondTokenDecimals);
      this.secondInputAmount = maxVal;
      this.secondTokenInput.value = maxVal;
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
    this.firstTokenInput.enabled = !status;
    this.secondTokenInput.enabled = !status;
  }

  private async onUpdateToken(token: ITokenObject, isFrom: boolean) {
    const symbol = token.symbol;
    const balance = this.getBalance(token);
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
      this.firstBalance = balance;
    } else {
      this.secondToken = token;
      if (this.firstToken?.symbol === symbol) {
        this.firstTokenInput.token = undefined;
        this.resetFirstInput();
        if (this.secondTokenInput.isConnected) this.secondTokenInput.value = '';
        this.secondInputAmount = '';
      } else {
        const limit = limitDecimals(this.secondInputAmount || '0', token.decimals || 18);
        if (!new BigNumber(this.secondInputAmount).eq(limit)) {
          if (this.secondTokenInput.isConnected) this.secondTokenInput.value = limit;
          this.secondInputAmount = limit;
        }
      }
      this.secondBalance = balance;
    }
    this.updateCommissionInfo();
  }

  private async onSelectToken(token: any, isFrom: boolean) {
    if (!token) return;
    if (token.isNew && this.state.isRpcWalletConnected()) {
      const rpcWallet = this.state.getRpcWallet();
      await tokenStore.updateAllTokenBalances(rpcWallet);
      this.allTokenBalancesMap = tokenStore.tokenBalances;
    }
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
      this.showTxStatusModal('warning', `Approving ${this.firstToken?.symbol} allowance`);
      this.btnApproveFirstToken.rightIcon.visible = true;
      if (this.firstToken) {
        this.approvalModelAction.doApproveAction(this.firstToken, this.firstInputAmount);
      }
      this.btnApproveFirstToken.rightIcon.visible = false;
    }
    else if (source === this.btnApproveSecondToken) {
      this.showTxStatusModal('warning', `Approving ${this.secondToken?.symbol} allowance`);
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

  private async handleSupply() {
    if (!isClientWalletConnected() || !this.state.isRpcWalletConnected()) {
      this.connectWallet();
      return;
    }
    if (!this.firstToken || !this.secondToken) return;
    const chainId = this.state.getChainId();
    this.firstTokenImage1.url = this.firstTokenImage2.url = tokenAssets.tokenPath(this.firstToken, chainId);
    this.secondTokenImage1.url = this.secondTokenImage2.url = tokenAssets.tokenPath(this.secondToken, chainId);
    const firstAmount = new BigNumber(this.firstInputAmount);
    const secondAmount = new BigNumber(this.secondInputAmount);
    const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, firstAmount);
    const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, secondAmount);
    this.lbFirstInput.caption = formatNumber(firstAmount.plus(firstCommissionAmount), 4);
    this.lbSecondInput.caption = formatNumber(secondAmount.plus(secondCommissionAmount), 4);
    this.lbPoolTokensTitle.caption = `${this.firstToken.symbol}/${this.secondToken.symbol} Pool Tokens`;
    this.lbOutputEstimated.caption = `Output is estimated. If the price changes by more than ${this.state.slippageTolerance}% your transaction will revert.`;
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
    this.showTxStatusModal('warning', `Add Liquidity Pool ${this.firstToken.symbol}/${this.secondToken.symbol}`);
    if (this.isFromEstimated) {
      addLiquidity(
        this.state,
        this.secondToken,
        this.firstToken,
        this.secondInputAmount,
        this.firstInputAmount,
        this.commissions
      );
    }
    else {
      addLiquidity(
        this.state,
        this.firstToken,
        this.secondToken,
        this.firstInputAmount,
        this.secondInputAmount,
        this.commissions
      );
    }
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
          this.showTxStatusModal('success', receipt);
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
        this.showTxStatusModal('error', err);
      },
      onPaying: async (receipt?: string) => {
        if (receipt) {
          this.showTxStatusModal('success', receipt);
        }
        this.confirmSupplyModal.visible = false;
        this.btnSupply.rightIcon.visible = true;
      },
      onPaid: async () => {
        await tokenStore.updateAllTokenBalances(this.state.getRpcWallet());
        if (this.firstToken) {
          this.firstBalance = tokenStore.getTokenBalance(this.firstToken);
        }
        if (this.secondToken) {
          this.secondBalance = tokenStore.getTokenBalance(this.secondToken);
        }
        this.btnSupply.rightIcon.visible = false;
      },
      onPayingError: async (err: Error) => {
        this.showTxStatusModal('error', err);
        this.btnSupply.rightIcon.visible = false;
      }
    });
    this.state.approvalModel.spenderAddress = this.contractAddress;
  }

  private async checkPairExists() {
    if (!this.firstToken || !this.secondToken)
      return;
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

  private async callAPIBundle(isNewShare: boolean) {
    if (!this.firstToken || !this.secondToken) return;
    if (!this.lbFirstPrice.isConnected) await this.lbFirstPrice.ready();
    if (!this.lbSecondPrice.isConnected) await this.lbSecondPrice.ready();
    if (!this.lbShareOfPool.isConnected) await this.lbShareOfPool.ready();

    if (isNewShare) {
      let newShareInfo;
      let invalidVal = false;
      if (this.isFromEstimated) {
        invalidVal = new BigNumber(this.firstTokenInput.value).isNaN();
        newShareInfo = await getNewShareInfo(this.state, this.secondToken, this.firstToken, this.secondTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
        const val = limitDecimals(newShareInfo?.quote || '0', this.firstTokenDecimals);
        this.firstInputAmount = val;
        this.firstTokenInput.value = val;
        if (invalidVal)
          newShareInfo = await getNewShareInfo(this.state, this.secondToken, this.firstToken, this.secondTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
      }
      else {
        invalidVal = new BigNumber(this.secondTokenInput.value).isNaN();
        newShareInfo = await getNewShareInfo(this.state, this.firstToken, this.secondToken, this.firstTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
        const val = limitDecimals(newShareInfo?.quote || '0', this.secondTokenDecimals);
        this.secondInputAmount = val;
        this.secondTokenInput.value = val;
        if (invalidVal)
          newShareInfo = await getNewShareInfo(this.state, this.firstToken, this.secondToken, this.firstTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
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
      let pricesInfo = await getPricesInfo(this.state, this.firstToken, this.secondToken);
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
          if (new BigNumber(this.secondTokenInput.value).gt(0)) {
            const price = new BigNumber(price1).multipliedBy(this.secondTokenInput.value).toFixed();
            const val = limitDecimals(price, this.firstTokenDecimals);
            this.firstTokenInput.value = val;
            this.firstInputAmount = val;
          }
        } else {
          if (new BigNumber(this.firstTokenInput.value).gt(0)) {
            const price = new BigNumber(price0).multipliedBy(this.firstTokenInput.value).toFixed();
            const val = limitDecimals(price, this.secondTokenDecimals);
            this.secondTokenInput.value = val;
            this.secondInputAmount = val;
          }
        }
      }
    }
    this.btnSupply.enabled = true;
    const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, new BigNumber(this.firstInputAmount));
    const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, new BigNumber(this.secondInputAmount));
    this.approvalModelAction.checkAllowance(this.firstToken, firstCommissionAmount.plus(this.firstInputAmount).toFixed());
    this.approvalModelAction.checkAllowance(this.secondToken, secondCommissionAmount.plus(this.secondInputAmount).toFixed());
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
    const commissions = this.getAttribute('commissions', true, []);
    await this.setData({ commissions, providers, tokens });
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
      <i-panel class={poolAddStyle}>
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
            <i-scom-token-input id="firstTokenInput" title="Input" width="100%" isCommonShown={false} onInputAmountChanged={() => this.handleEnterAmount(true)} />
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
            <i-scom-token-input id="secondTokenInput" title="Input" width="100%" isCommonShown={false} onInputAmountChanged={() => this.handleEnterAmount()} />
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
        <i-scom-tx-status-modal id="txStatusModal" />
      </i-panel>
    )
  }
}
