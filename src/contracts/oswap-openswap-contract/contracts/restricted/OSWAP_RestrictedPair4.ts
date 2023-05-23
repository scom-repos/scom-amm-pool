import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_RestrictedPair4.json";
export interface IAddLiquidityParams {direction:boolean;index:number|BigNumber;feeIn:number|BigNumber}
export interface IApprovedTraderParams {param1:boolean;param2:number|BigNumber;param3:number|BigNumber}
export interface ICreateOrderParams {provider:string;direction:boolean;allowAll:boolean;restrictedPrice:number|BigNumber;startDate:number|BigNumber;expire:number|BigNumber}
export interface IGetAmountInParams {param1:string;param2:number|BigNumber;param3:string;param4:string}
export interface IGetAmountOutParams {tokenIn:string;amountIn:number|BigNumber;trader:string;param4:string}
export interface IGetApprovedTraderParams {direction:boolean;offerIndex:number|BigNumber;start:number|BigNumber;length:number|BigNumber}
export interface IGetApprovedTraderLengthParams {direction:boolean;offerIndex:number|BigNumber}
export interface IGetOffersParams {direction:boolean;start:number|BigNumber;length:number|BigNumber}
export interface IGetProviderOfferParams {provider:string;direction:boolean;start:number|BigNumber;length:number|BigNumber}
export interface IGetProviderOfferIndexLengthParams {provider:string;direction:boolean}
export interface IGetTraderOfferParams {trader:string;direction:boolean;start:number|BigNumber;length:number|BigNumber}
export interface IInitializeParams {token0:string;token1:string}
export interface IIsApprovedTraderParams {param1:boolean;param2:number|BigNumber;param3:string}
export interface ILastTraderAllocationParams {param1:boolean;param2:number|BigNumber;param3:string}
export interface ILockOfferParams {direction:boolean;index:number|BigNumber}
export interface IOfferAllowlistIpfsCidParams {param1:boolean;param2:number|BigNumber}
export interface IOfferMerkleRootParams {param1:boolean;param2:number|BigNumber}
export interface IOffersParams {param1:boolean;param2:number|BigNumber}
export interface IPrepaidFeeBalanceParams {param1:boolean;param2:number|BigNumber}
export interface IProviderOfferIndexParams {param1:boolean;param2:string;param3:number|BigNumber}
export interface IRemoveAllLiquidity1DParams {provider:string;direction:boolean}
export interface IRemoveLiquidityParams {provider:string;direction:boolean;index:number|BigNumber;amountOut:number|BigNumber;receivingOut:number|BigNumber;feeOut:number|BigNumber}
export interface ISetApprovedTraderByMerkleProofParams {direction:boolean;offerIndex:number|BigNumber;trader:string;allocation:number|BigNumber;proof:string[]}
export interface ISetMerkleRootParams {direction:boolean;index:number|BigNumber;merkleRoot:string;ipfsCid:string}
export interface ISwapParams {amount0Out:number|BigNumber;amount1Out:number|BigNumber;to:string;trader:string;param5:string}
export interface ITraderAllocationParams {param1:boolean;param2:number|BigNumber;param3:string}
export interface ITraderOfferParams {param1:boolean;param2:string;param3:number|BigNumber}
export class OSWAP_RestrictedPair4 extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: number|BigNumber|TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    parseAddLiquidityEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.AddLiquidityEvent[]{
        return this.parseEvents(receipt, "AddLiquidity").map(e=>this.decodeAddLiquidityEvent(e));
    }
    decodeAddLiquidityEvent(event: Event): OSWAP_RestrictedPair4.AddLiquidityEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            index: new BigNumber(result.index),
            amount: new BigNumber(result.amount),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            feeIn: new BigNumber(result.feeIn),
            newFeeBalance: new BigNumber(result.newFeeBalance),
            _event: event
        };
    }
    parseApprovedTraderEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.ApprovedTraderEvent[]{
        return this.parseEvents(receipt, "ApprovedTrader").map(e=>this.decodeApprovedTraderEvent(e));
    }
    decodeApprovedTraderEvent(event: Event): OSWAP_RestrictedPair4.ApprovedTraderEvent{
        let result = event.data;
        return {
            direction: result.direction,
            offerIndex: new BigNumber(result.offerIndex),
            trader: result.trader,
            allocation: new BigNumber(result.allocation),
            _event: event
        };
    }
    parseLockEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.LockEvent[]{
        return this.parseEvents(receipt, "Lock").map(e=>this.decodeLockEvent(e));
    }
    decodeLockEvent(event: Event): OSWAP_RestrictedPair4.LockEvent{
        let result = event.data;
        return {
            direction: result.direction,
            index: new BigNumber(result.index),
            _event: event
        };
    }
    parseMerkleRootEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.MerkleRootEvent[]{
        return this.parseEvents(receipt, "MerkleRoot").map(e=>this.decodeMerkleRootEvent(e));
    }
    decodeMerkleRootEvent(event: Event): OSWAP_RestrictedPair4.MerkleRootEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            index: new BigNumber(result.index),
            merkleRoot: result.merkleRoot,
            ipfsCid: result.ipfsCid,
            _event: event
        };
    }
    parseNewProviderOfferEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.NewProviderOfferEvent[]{
        return this.parseEvents(receipt, "NewProviderOffer").map(e=>this.decodeNewProviderOfferEvent(e));
    }
    decodeNewProviderOfferEvent(event: Event): OSWAP_RestrictedPair4.NewProviderOfferEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            index: new BigNumber(result.index),
            allowAll: result.allowAll,
            restrictedPrice: new BigNumber(result.restrictedPrice),
            startDate: new BigNumber(result.startDate),
            expire: new BigNumber(result.expire),
            _event: event
        };
    }
    parseRemoveLiquidityEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.RemoveLiquidityEvent[]{
        return this.parseEvents(receipt, "RemoveLiquidity").map(e=>this.decodeRemoveLiquidityEvent(e));
    }
    decodeRemoveLiquidityEvent(event: Event): OSWAP_RestrictedPair4.RemoveLiquidityEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            index: new BigNumber(result.index),
            amountOut: new BigNumber(result.amountOut),
            receivingOut: new BigNumber(result.receivingOut),
            feeOut: new BigNumber(result.feeOut),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newReceivingBalance: new BigNumber(result.newReceivingBalance),
            newFeeBalance: new BigNumber(result.newFeeBalance),
            _event: event
        };
    }
    parseSwapEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.SwapEvent[]{
        return this.parseEvents(receipt, "Swap").map(e=>this.decodeSwapEvent(e));
    }
    decodeSwapEvent(event: Event): OSWAP_RestrictedPair4.SwapEvent{
        let result = event.data;
        return {
            to: result.to,
            direction: result.direction,
            amountIn: new BigNumber(result.amountIn),
            amountOut: new BigNumber(result.amountOut),
            tradeFee: new BigNumber(result.tradeFee),
            protocolFee: new BigNumber(result.protocolFee),
            _event: event
        };
    }
    parseSwappedOneOfferEvent(receipt: TransactionReceipt): OSWAP_RestrictedPair4.SwappedOneOfferEvent[]{
        return this.parseEvents(receipt, "SwappedOneOffer").map(e=>this.decodeSwappedOneOfferEvent(e));
    }
    decodeSwappedOneOfferEvent(event: Event): OSWAP_RestrictedPair4.SwappedOneOfferEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            index: new BigNumber(result.index),
            price: new BigNumber(result.price),
            amountOut: new BigNumber(result.amountOut),
            amountIn: new BigNumber(result.amountIn),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newReceivingBalance: new BigNumber(result.newReceivingBalance),
            _event: event
        };
    }
    addLiquidity: {
        (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    approvedTrader: {
        (params: IApprovedTraderParams, options?: TransactionOptions): Promise<string>;
    }
    configStore: {
        (options?: TransactionOptions): Promise<string>;
    }
    counter: {
        (param1:boolean, options?: TransactionOptions): Promise<BigNumber>;
    }
    createOrder: {
        (params: ICreateOrderParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ICreateOrderParams, options?: TransactionOptions) => Promise<BigNumber>;
        txData: (params: ICreateOrderParams, options?: TransactionOptions) => Promise<string>;
    }
    factory: {
        (options?: TransactionOptions): Promise<string>;
    }
    feeBalance: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountIn: {
        (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountOut: {
        (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getApprovedTrader: {
        (params: IGetApprovedTraderParams, options?: TransactionOptions): Promise<{trader:string[],allocation:BigNumber[]}>;
    }
    getApprovedTraderLength: {
        (params: IGetApprovedTraderLengthParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getBalances: {
        (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber,param3:BigNumber}>;
    }
    getLastBalances: {
        (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber}>;
    }
    getOffers: {
        (params: IGetOffersParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}>;
    }
    getProviderOffer: {
        (params: IGetProviderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}>;
    }
    getProviderOfferIndexLength: {
        (params: IGetProviderOfferIndexLengthParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getTraderOffer: {
        (params: IGetTraderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}>;
    }
    govToken: {
        (options?: TransactionOptions): Promise<string>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    initialize: {
        (params: IInitializeParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IInitializeParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IInitializeParams, options?: TransactionOptions) => Promise<string>;
    }
    isApprovedTrader: {
        (params: IIsApprovedTraderParams, options?: TransactionOptions): Promise<boolean>;
    }
    isLive: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    lastGovBalance: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    lastToken0Balance: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    lastToken1Balance: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    lastTraderAllocation: {
        (params: ILastTraderAllocationParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    lockOffer: {
        (params: ILockOfferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ILockOfferParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ILockOfferParams, options?: TransactionOptions) => Promise<string>;
    }
    offerAllowlistIpfsCid: {
        (params: IOfferAllowlistIpfsCidParams, options?: TransactionOptions): Promise<string>;
    }
    offerMerkleRoot: {
        (params: IOfferMerkleRootParams, options?: TransactionOptions): Promise<string>;
    }
    offers: {
        (params: IOffersParams, options?: TransactionOptions): Promise<{provider:string,locked:boolean,allowAll:boolean,amount:BigNumber,receiving:BigNumber,restrictedPrice:BigNumber,startDate:BigNumber,expire:BigNumber}>;
    }
    prepaidFeeBalance: {
        (params: IPrepaidFeeBalanceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFeeBalance0: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFeeBalance1: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    providerOfferIndex: {
        (params: IProviderOfferIndexParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    redeemProtocolFee: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    removeAllLiquidity: {
        (provider:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (provider:string, options?: TransactionOptions) => Promise<{amount0:BigNumber,amount1:BigNumber,feeOut:BigNumber}>;
        txData: (provider:string, options?: TransactionOptions) => Promise<string>;
    }
    removeAllLiquidity1D: {
        (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions) => Promise<{totalAmount:BigNumber,totalReceiving:BigNumber,totalRemainingFee:BigNumber}>;
        txData: (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions) => Promise<string>;
    }
    removeLiquidity: {
        (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    restrictedLiquidityProvider: {
        (options?: TransactionOptions): Promise<string>;
    }
    scaleDirection: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    scaler: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    setApprovedTraderByMerkleProof: {
        (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions) => Promise<string>;
    }
    setLive: {
        (isLive:boolean, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (isLive:boolean, options?: TransactionOptions) => Promise<void>;
        txData: (isLive:boolean, options?: TransactionOptions) => Promise<string>;
    }
    setMerkleRoot: {
        (params: ISetMerkleRootParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetMerkleRootParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetMerkleRootParams, options?: TransactionOptions) => Promise<string>;
    }
    swap: {
        (params: ISwapParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISwapParams, options?: TransactionOptions) => Promise<string>;
    }
    sync: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    token0: {
        (options?: TransactionOptions): Promise<string>;
    }
    token1: {
        (options?: TransactionOptions): Promise<string>;
    }
    traderAllocation: {
        (params: ITraderAllocationParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    traderOffer: {
        (params: ITraderOfferParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    whitelistFactory: {
        (options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let approvedTraderParams = (params: IApprovedTraderParams) => [params.param1,this.wallet.utils.toString(params.param2),this.wallet.utils.toString(params.param3)];
        let approvedTrader_call = async (params: IApprovedTraderParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('approvedTrader',approvedTraderParams(params),options);
            return result;
        }
        this.approvedTrader = approvedTrader_call
        let configStore_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('configStore',[],options);
            return result;
        }
        this.configStore = configStore_call
        let counter_call = async (param1:boolean, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('counter',[param1],options);
            return new BigNumber(result);
        }
        this.counter = counter_call
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
        let feeBalance_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('feeBalance',[],options);
            return new BigNumber(result);
        }
        this.feeBalance = feeBalance_call
        let getAmountInParams = (params: IGetAmountInParams) => [params.param1,this.wallet.utils.toString(params.param2),params.param3,this.wallet.utils.stringToBytes(params.param4)];
        let getAmountIn_call = async (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountIn',getAmountInParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountIn = getAmountIn_call
        let getAmountOutParams = (params: IGetAmountOutParams) => [params.tokenIn,this.wallet.utils.toString(params.amountIn),params.trader,this.wallet.utils.stringToBytes(params.param4)];
        let getAmountOut_call = async (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountOut',getAmountOutParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountOut = getAmountOut_call
        let getApprovedTraderParams = (params: IGetApprovedTraderParams) => [params.direction,this.wallet.utils.toString(params.offerIndex),this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.length)];
        let getApprovedTrader_call = async (params: IGetApprovedTraderParams, options?: TransactionOptions): Promise<{trader:string[],allocation:BigNumber[]}> => {
            let result = await this.call('getApprovedTrader',getApprovedTraderParams(params),options);
            return {
                trader: result.trader,
                allocation: result.allocation.map(e=>new BigNumber(e))
            };
        }
        this.getApprovedTrader = getApprovedTrader_call
        let getApprovedTraderLengthParams = (params: IGetApprovedTraderLengthParams) => [params.direction,this.wallet.utils.toString(params.offerIndex)];
        let getApprovedTraderLength_call = async (params: IGetApprovedTraderLengthParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getApprovedTraderLength',getApprovedTraderLengthParams(params),options);
            return new BigNumber(result);
        }
        this.getApprovedTraderLength = getApprovedTraderLength_call
        let getBalances_call = async (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber,param3:BigNumber}> => {
            let result = await this.call('getBalances',[],options);
            return {
                param1: new BigNumber(result[0]),
                param2: new BigNumber(result[1]),
                param3: new BigNumber(result[2])
            };
        }
        this.getBalances = getBalances_call
        let getLastBalances_call = async (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber}> => {
            let result = await this.call('getLastBalances',[],options);
            return {
                param1: new BigNumber(result[0]),
                param2: new BigNumber(result[1])
            };
        }
        this.getLastBalances = getLastBalances_call
        let getOffersParams = (params: IGetOffersParams) => [params.direction,this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.length)];
        let getOffers_call = async (params: IGetOffersParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}> => {
            let result = await this.call('getOffers',getOffersParams(params),options);
            return {
                index: result.index.map(e=>new BigNumber(e)),
                provider: result.provider,
                lockedAndAllowAll: result.lockedAndAllowAll,
                receiving: result.receiving.map(e=>new BigNumber(e)),
                amountAndPrice: result.amountAndPrice.map(e=>new BigNumber(e)),
                startDateAndExpire: result.startDateAndExpire.map(e=>new BigNumber(e))
            };
        }
        this.getOffers = getOffers_call
        let getProviderOfferParams = (params: IGetProviderOfferParams) => [params.provider,params.direction,this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.length)];
        let getProviderOffer_call = async (params: IGetProviderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}> => {
            let result = await this.call('getProviderOffer',getProviderOfferParams(params),options);
            return {
                index: result.index.map(e=>new BigNumber(e)),
                provider: result.provider,
                lockedAndAllowAll: result.lockedAndAllowAll,
                receiving: result.receiving.map(e=>new BigNumber(e)),
                amountAndPrice: result.amountAndPrice.map(e=>new BigNumber(e)),
                startDateAndExpire: result.startDateAndExpire.map(e=>new BigNumber(e))
            };
        }
        this.getProviderOffer = getProviderOffer_call
        let getProviderOfferIndexLengthParams = (params: IGetProviderOfferIndexLengthParams) => [params.provider,params.direction];
        let getProviderOfferIndexLength_call = async (params: IGetProviderOfferIndexLengthParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getProviderOfferIndexLength',getProviderOfferIndexLengthParams(params),options);
            return new BigNumber(result);
        }
        this.getProviderOfferIndexLength = getProviderOfferIndexLength_call
        let getTraderOfferParams = (params: IGetTraderOfferParams) => [params.trader,params.direction,this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.length)];
        let getTraderOffer_call = async (params: IGetTraderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber[],provider:string[],lockedAndAllowAll:boolean[],receiving:BigNumber[],amountAndPrice:BigNumber[],startDateAndExpire:BigNumber[]}> => {
            let result = await this.call('getTraderOffer',getTraderOfferParams(params),options);
            return {
                index: result.index.map(e=>new BigNumber(e)),
                provider: result.provider,
                lockedAndAllowAll: result.lockedAndAllowAll,
                receiving: result.receiving.map(e=>new BigNumber(e)),
                amountAndPrice: result.amountAndPrice.map(e=>new BigNumber(e)),
                startDateAndExpire: result.startDateAndExpire.map(e=>new BigNumber(e))
            };
        }
        this.getTraderOffer = getTraderOffer_call
        let govToken_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('govToken',[],options);
            return result;
        }
        this.govToken = govToken_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let isApprovedTraderParams = (params: IIsApprovedTraderParams) => [params.param1,this.wallet.utils.toString(params.param2),params.param3];
        let isApprovedTrader_call = async (params: IIsApprovedTraderParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isApprovedTrader',isApprovedTraderParams(params),options);
            return result;
        }
        this.isApprovedTrader = isApprovedTrader_call
        let isLive_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isLive',[],options);
            return result;
        }
        this.isLive = isLive_call
        let lastGovBalance_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lastGovBalance',[],options);
            return new BigNumber(result);
        }
        this.lastGovBalance = lastGovBalance_call
        let lastToken0Balance_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lastToken0Balance',[],options);
            return new BigNumber(result);
        }
        this.lastToken0Balance = lastToken0Balance_call
        let lastToken1Balance_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lastToken1Balance',[],options);
            return new BigNumber(result);
        }
        this.lastToken1Balance = lastToken1Balance_call
        let lastTraderAllocationParams = (params: ILastTraderAllocationParams) => [params.param1,this.wallet.utils.toString(params.param2),params.param3];
        let lastTraderAllocation_call = async (params: ILastTraderAllocationParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('lastTraderAllocation',lastTraderAllocationParams(params),options);
            return new BigNumber(result);
        }
        this.lastTraderAllocation = lastTraderAllocation_call
        let offerAllowlistIpfsCidParams = (params: IOfferAllowlistIpfsCidParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let offerAllowlistIpfsCid_call = async (params: IOfferAllowlistIpfsCidParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('offerAllowlistIpfsCid',offerAllowlistIpfsCidParams(params),options);
            return result;
        }
        this.offerAllowlistIpfsCid = offerAllowlistIpfsCid_call
        let offerMerkleRootParams = (params: IOfferMerkleRootParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let offerMerkleRoot_call = async (params: IOfferMerkleRootParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('offerMerkleRoot',offerMerkleRootParams(params),options);
            return result;
        }
        this.offerMerkleRoot = offerMerkleRoot_call
        let offersParams = (params: IOffersParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let offers_call = async (params: IOffersParams, options?: TransactionOptions): Promise<{provider:string,locked:boolean,allowAll:boolean,amount:BigNumber,receiving:BigNumber,restrictedPrice:BigNumber,startDate:BigNumber,expire:BigNumber}> => {
            let result = await this.call('offers',offersParams(params),options);
            return {
                provider: result.provider,
                locked: result.locked,
                allowAll: result.allowAll,
                amount: new BigNumber(result.amount),
                receiving: new BigNumber(result.receiving),
                restrictedPrice: new BigNumber(result.restrictedPrice),
                startDate: new BigNumber(result.startDate),
                expire: new BigNumber(result.expire)
            };
        }
        this.offers = offers_call
        let prepaidFeeBalanceParams = (params: IPrepaidFeeBalanceParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let prepaidFeeBalance_call = async (params: IPrepaidFeeBalanceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('prepaidFeeBalance',prepaidFeeBalanceParams(params),options);
            return new BigNumber(result);
        }
        this.prepaidFeeBalance = prepaidFeeBalance_call
        let protocolFeeBalance0_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('protocolFeeBalance0',[],options);
            return new BigNumber(result);
        }
        this.protocolFeeBalance0 = protocolFeeBalance0_call
        let protocolFeeBalance1_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('protocolFeeBalance1',[],options);
            return new BigNumber(result);
        }
        this.protocolFeeBalance1 = protocolFeeBalance1_call
        let providerOfferIndexParams = (params: IProviderOfferIndexParams) => [params.param1,params.param2,this.wallet.utils.toString(params.param3)];
        let providerOfferIndex_call = async (params: IProviderOfferIndexParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('providerOfferIndex',providerOfferIndexParams(params),options);
            return new BigNumber(result);
        }
        this.providerOfferIndex = providerOfferIndex_call
        let restrictedLiquidityProvider_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('restrictedLiquidityProvider',[],options);
            return result;
        }
        this.restrictedLiquidityProvider = restrictedLiquidityProvider_call
        let scaleDirection_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('scaleDirection',[],options);
            return result;
        }
        this.scaleDirection = scaleDirection_call
        let scaler_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('scaler',[],options);
            return new BigNumber(result);
        }
        this.scaler = scaler_call
        let token0_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token0',[],options);
            return result;
        }
        this.token0 = token0_call
        let token1_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token1',[],options);
            return result;
        }
        this.token1 = token1_call
        let traderAllocationParams = (params: ITraderAllocationParams) => [params.param1,this.wallet.utils.toString(params.param2),params.param3];
        let traderAllocation_call = async (params: ITraderAllocationParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('traderAllocation',traderAllocationParams(params),options);
            return new BigNumber(result);
        }
        this.traderAllocation = traderAllocation_call
        let traderOfferParams = (params: ITraderOfferParams) => [params.param1,params.param2,this.wallet.utils.toString(params.param3)];
        let traderOffer_call = async (params: ITraderOfferParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('traderOffer',traderOfferParams(params),options);
            return new BigNumber(result);
        }
        this.traderOffer = traderOffer_call
        let whitelistFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('whitelistFactory',[],options);
            return result;
        }
        this.whitelistFactory = whitelistFactory_call
        let addLiquidityParams = (params: IAddLiquidityParams) => [params.direction,this.wallet.utils.toString(params.index),this.wallet.utils.toString(params.feeIn)];
        let addLiquidity_send = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        let addLiquidity_call = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('addLiquidity',addLiquidityParams(params),options);
            return;
        }
        let addLiquidity_txData = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        this.addLiquidity = Object.assign(addLiquidity_send, {
            call:addLiquidity_call
            , txData:addLiquidity_txData
        });
        let createOrderParams = (params: ICreateOrderParams) => [params.provider,params.direction,params.allowAll,this.wallet.utils.toString(params.restrictedPrice),this.wallet.utils.toString(params.startDate),this.wallet.utils.toString(params.expire)];
        let createOrder_send = async (params: ICreateOrderParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('createOrder',createOrderParams(params),options);
            return result;
        }
        let createOrder_call = async (params: ICreateOrderParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('createOrder',createOrderParams(params),options);
            return new BigNumber(result);
        }
        let createOrder_txData = async (params: ICreateOrderParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('createOrder',createOrderParams(params),options);
            return result;
        }
        this.createOrder = Object.assign(createOrder_send, {
            call:createOrder_call
            , txData:createOrder_txData
        });
        let initializeParams = (params: IInitializeParams) => [params.token0,params.token1];
        let initialize_send = async (params: IInitializeParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('initialize',initializeParams(params),options);
            return result;
        }
        let initialize_call = async (params: IInitializeParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('initialize',initializeParams(params),options);
            return;
        }
        let initialize_txData = async (params: IInitializeParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('initialize',initializeParams(params),options);
            return result;
        }
        this.initialize = Object.assign(initialize_send, {
            call:initialize_call
            , txData:initialize_txData
        });
        let lockOfferParams = (params: ILockOfferParams) => [params.direction,this.wallet.utils.toString(params.index)];
        let lockOffer_send = async (params: ILockOfferParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('lockOffer',lockOfferParams(params),options);
            return result;
        }
        let lockOffer_call = async (params: ILockOfferParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('lockOffer',lockOfferParams(params),options);
            return;
        }
        let lockOffer_txData = async (params: ILockOfferParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('lockOffer',lockOfferParams(params),options);
            return result;
        }
        this.lockOffer = Object.assign(lockOffer_send, {
            call:lockOffer_call
            , txData:lockOffer_txData
        });
        let redeemProtocolFee_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('redeemProtocolFee',[],options);
            return result;
        }
        let redeemProtocolFee_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('redeemProtocolFee',[],options);
            return;
        }
        let redeemProtocolFee_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('redeemProtocolFee',[],options);
            return result;
        }
        this.redeemProtocolFee = Object.assign(redeemProtocolFee_send, {
            call:redeemProtocolFee_call
            , txData:redeemProtocolFee_txData
        });
        let removeAllLiquidity_send = async (provider:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeAllLiquidity',[provider],options);
            return result;
        }
        let removeAllLiquidity_call = async (provider:string, options?: TransactionOptions): Promise<{amount0:BigNumber,amount1:BigNumber,feeOut:BigNumber}> => {
            let result = await this.call('removeAllLiquidity',[provider],options);
            return {
                amount0: new BigNumber(result.amount0),
                amount1: new BigNumber(result.amount1),
                feeOut: new BigNumber(result.feeOut)
            };
        }
        let removeAllLiquidity_txData = async (provider:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeAllLiquidity',[provider],options);
            return result;
        }
        this.removeAllLiquidity = Object.assign(removeAllLiquidity_send, {
            call:removeAllLiquidity_call
            , txData:removeAllLiquidity_txData
        });
        let removeAllLiquidity1DParams = (params: IRemoveAllLiquidity1DParams) => [params.provider,params.direction];
        let removeAllLiquidity1D_send = async (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeAllLiquidity1D',removeAllLiquidity1DParams(params),options);
            return result;
        }
        let removeAllLiquidity1D_call = async (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions): Promise<{totalAmount:BigNumber,totalReceiving:BigNumber,totalRemainingFee:BigNumber}> => {
            let result = await this.call('removeAllLiquidity1D',removeAllLiquidity1DParams(params),options);
            return {
                totalAmount: new BigNumber(result.totalAmount),
                totalReceiving: new BigNumber(result.totalReceiving),
                totalRemainingFee: new BigNumber(result.totalRemainingFee)
            };
        }
        let removeAllLiquidity1D_txData = async (params: IRemoveAllLiquidity1DParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeAllLiquidity1D',removeAllLiquidity1DParams(params),options);
            return result;
        }
        this.removeAllLiquidity1D = Object.assign(removeAllLiquidity1D_send, {
            call:removeAllLiquidity1D_call
            , txData:removeAllLiquidity1D_txData
        });
        let removeLiquidityParams = (params: IRemoveLiquidityParams) => [params.provider,params.direction,this.wallet.utils.toString(params.index),this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.receivingOut),this.wallet.utils.toString(params.feeOut)];
        let removeLiquidity_send = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeLiquidity',removeLiquidityParams(params),options);
            return result;
        }
        let removeLiquidity_call = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('removeLiquidity',removeLiquidityParams(params),options);
            return;
        }
        let removeLiquidity_txData = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeLiquidity',removeLiquidityParams(params),options);
            return result;
        }
        this.removeLiquidity = Object.assign(removeLiquidity_send, {
            call:removeLiquidity_call
            , txData:removeLiquidity_txData
        });
        let setApprovedTraderByMerkleProofParams = (params: ISetApprovedTraderByMerkleProofParams) => [params.direction,this.wallet.utils.toString(params.offerIndex),params.trader,this.wallet.utils.toString(params.allocation),this.wallet.utils.stringToBytes32(params.proof)];
        let setApprovedTraderByMerkleProof_send = async (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setApprovedTraderByMerkleProof',setApprovedTraderByMerkleProofParams(params),options);
            return result;
        }
        let setApprovedTraderByMerkleProof_call = async (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setApprovedTraderByMerkleProof',setApprovedTraderByMerkleProofParams(params),options);
            return;
        }
        let setApprovedTraderByMerkleProof_txData = async (params: ISetApprovedTraderByMerkleProofParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setApprovedTraderByMerkleProof',setApprovedTraderByMerkleProofParams(params),options);
            return result;
        }
        this.setApprovedTraderByMerkleProof = Object.assign(setApprovedTraderByMerkleProof_send, {
            call:setApprovedTraderByMerkleProof_call
            , txData:setApprovedTraderByMerkleProof_txData
        });
        let setLive_send = async (isLive:boolean, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setLive',[isLive],options);
            return result;
        }
        let setLive_call = async (isLive:boolean, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setLive',[isLive],options);
            return;
        }
        let setLive_txData = async (isLive:boolean, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setLive',[isLive],options);
            return result;
        }
        this.setLive = Object.assign(setLive_send, {
            call:setLive_call
            , txData:setLive_txData
        });
        let setMerkleRootParams = (params: ISetMerkleRootParams) => [params.direction,this.wallet.utils.toString(params.index),this.wallet.utils.stringToBytes32(params.merkleRoot),params.ipfsCid];
        let setMerkleRoot_send = async (params: ISetMerkleRootParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setMerkleRoot',setMerkleRootParams(params),options);
            return result;
        }
        let setMerkleRoot_call = async (params: ISetMerkleRootParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setMerkleRoot',setMerkleRootParams(params),options);
            return;
        }
        let setMerkleRoot_txData = async (params: ISetMerkleRootParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setMerkleRoot',setMerkleRootParams(params),options);
            return result;
        }
        this.setMerkleRoot = Object.assign(setMerkleRoot_send, {
            call:setMerkleRoot_call
            , txData:setMerkleRoot_txData
        });
        let swapParams = (params: ISwapParams) => [this.wallet.utils.toString(params.amount0Out),this.wallet.utils.toString(params.amount1Out),params.to,params.trader,this.wallet.utils.stringToBytes(params.param5)];
        let swap_send = async (params: ISwapParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swap',swapParams(params),options);
            return result;
        }
        let swap_call = async (params: ISwapParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('swap',swapParams(params),options);
            return;
        }
        let swap_txData = async (params: ISwapParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swap',swapParams(params),options);
            return result;
        }
        this.swap = Object.assign(swap_send, {
            call:swap_call
            , txData:swap_txData
        });
        let sync_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('sync',[],options);
            return result;
        }
        let sync_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('sync',[],options);
            return;
        }
        let sync_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('sync',[],options);
            return result;
        }
        this.sync = Object.assign(sync_send, {
            call:sync_call
            , txData:sync_txData
        });
    }
}
export module OSWAP_RestrictedPair4{
    export interface AddLiquidityEvent {provider:string,direction:boolean,index:BigNumber,amount:BigNumber,newAmountBalance:BigNumber,feeIn:BigNumber,newFeeBalance:BigNumber,_event:Event}
    export interface ApprovedTraderEvent {direction:boolean,offerIndex:BigNumber,trader:string,allocation:BigNumber,_event:Event}
    export interface LockEvent {direction:boolean,index:BigNumber,_event:Event}
    export interface MerkleRootEvent {provider:string,direction:boolean,index:BigNumber,merkleRoot:string,ipfsCid:string,_event:Event}
    export interface NewProviderOfferEvent {provider:string,direction:boolean,index:BigNumber,allowAll:boolean,restrictedPrice:BigNumber,startDate:BigNumber,expire:BigNumber,_event:Event}
    export interface RemoveLiquidityEvent {provider:string,direction:boolean,index:BigNumber,amountOut:BigNumber,receivingOut:BigNumber,feeOut:BigNumber,newAmountBalance:BigNumber,newReceivingBalance:BigNumber,newFeeBalance:BigNumber,_event:Event}
    export interface SwapEvent {to:string,direction:boolean,amountIn:BigNumber,amountOut:BigNumber,tradeFee:BigNumber,protocolFee:BigNumber,_event:Event}
    export interface SwappedOneOfferEvent {provider:string,direction:boolean,index:BigNumber,price:BigNumber,amountOut:BigNumber,amountIn:BigNumber,newAmountBalance:BigNumber,newReceivingBalance:BigNumber,_event:Event}
}