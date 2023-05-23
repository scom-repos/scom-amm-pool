import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_RangePair.json";
export interface IAddLiquidityParams {provider:string;direction:boolean;staked:number|BigNumber;lowerLimit:number|BigNumber;upperLimit:number|BigNumber;startDate:number|BigNumber;expire:number|BigNumber}
export interface IGetAmountInParams {tokenOut:string;amountOut:number|BigNumber;data:string}
export interface IGetAmountOutParams {tokenIn:string;amountIn:number|BigNumber;data:string}
export interface IGetLatestPriceParams {direction:boolean;payload:string}
export interface IGetOffersParams {direction:boolean;start:number|BigNumber;end:number|BigNumber}
export interface IGetProviderOfferParams {provider:string;direction:boolean}
export interface IInitializeParams {token0:string;token1:string}
export interface IOffersParams {param1:boolean;param2:number|BigNumber}
export interface IRemoveLiquidityParams {provider:string;direction:boolean;unstake:number|BigNumber;amountOut:number|BigNumber;reserveOut:number|BigNumber;lowerLimit:number|BigNumber;upperLimit:number|BigNumber;startDate:number|BigNumber;expire:number|BigNumber}
export interface IReplenishParams {provider:string;direction:boolean;amountIn:number|BigNumber}
export interface ISwapParams {amount0Out:number|BigNumber;amount1Out:number|BigNumber;to:string;data:string}
export interface IUpdateProviderOfferParams {provider:string;direction:boolean;replenishAmount:number|BigNumber;lowerLimit:number|BigNumber;upperLimit:number|BigNumber;startDate:number|BigNumber;expire:number|BigNumber;privateReplenish:boolean}
export class OSWAP_RangePair extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    parseAddLiquidityEvent(receipt: TransactionReceipt): OSWAP_RangePair.AddLiquidityEvent[]{
        return this.parseEvents(receipt, "AddLiquidity").map(e=>this.decodeAddLiquidityEvent(e));
    }
    decodeAddLiquidityEvent(event: Event): OSWAP_RangePair.AddLiquidityEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            staked: new BigNumber(result.staked),
            amount: new BigNumber(result.amount),
            newStakeBalance: new BigNumber(result.newStakeBalance),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            lowerLimit: new BigNumber(result.lowerLimit),
            upperLimit: new BigNumber(result.upperLimit),
            startDate: new BigNumber(result.startDate),
            expire: new BigNumber(result.expire),
            _event: event
        };
    }
    parseNewProviderEvent(receipt: TransactionReceipt): OSWAP_RangePair.NewProviderEvent[]{
        return this.parseEvents(receipt, "NewProvider").map(e=>this.decodeNewProviderEvent(e));
    }
    decodeNewProviderEvent(event: Event): OSWAP_RangePair.NewProviderEvent{
        let result = event.data;
        return {
            provider: result.provider,
            index: new BigNumber(result.index),
            _event: event
        };
    }
    parseRemoveAllLiquidityEvent(receipt: TransactionReceipt): OSWAP_RangePair.RemoveAllLiquidityEvent[]{
        return this.parseEvents(receipt, "RemoveAllLiquidity").map(e=>this.decodeRemoveAllLiquidityEvent(e));
    }
    decodeRemoveAllLiquidityEvent(event: Event): OSWAP_RangePair.RemoveAllLiquidityEvent{
        let result = event.data;
        return {
            provider: result.provider,
            unstake: new BigNumber(result.unstake),
            amount0Out: new BigNumber(result.amount0Out),
            amount1Out: new BigNumber(result.amount1Out),
            _event: event
        };
    }
    parseRemoveLiquidityEvent(receipt: TransactionReceipt): OSWAP_RangePair.RemoveLiquidityEvent[]{
        return this.parseEvents(receipt, "RemoveLiquidity").map(e=>this.decodeRemoveLiquidityEvent(e));
    }
    decodeRemoveLiquidityEvent(event: Event): OSWAP_RangePair.RemoveLiquidityEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            unstake: new BigNumber(result.unstake),
            amountOut: new BigNumber(result.amountOut),
            reserveOut: new BigNumber(result.reserveOut),
            newStakeBalance: new BigNumber(result.newStakeBalance),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newReserveBalance: new BigNumber(result.newReserveBalance),
            lowerLimit: new BigNumber(result.lowerLimit),
            upperLimit: new BigNumber(result.upperLimit),
            startDate: new BigNumber(result.startDate),
            expire: new BigNumber(result.expire),
            _event: event
        };
    }
    parseReplenishEvent(receipt: TransactionReceipt): OSWAP_RangePair.ReplenishEvent[]{
        return this.parseEvents(receipt, "Replenish").map(e=>this.decodeReplenishEvent(e));
    }
    decodeReplenishEvent(event: Event): OSWAP_RangePair.ReplenishEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            amountIn: new BigNumber(result.amountIn),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newReserveBalance: new BigNumber(result.newReserveBalance),
            _event: event
        };
    }
    parseSwapEvent(receipt: TransactionReceipt): OSWAP_RangePair.SwapEvent[]{
        return this.parseEvents(receipt, "Swap").map(e=>this.decodeSwapEvent(e));
    }
    decodeSwapEvent(event: Event): OSWAP_RangePair.SwapEvent{
        let result = event.data;
        return {
            to: result.to,
            direction: result.direction,
            price: new BigNumber(result.price),
            amountIn: new BigNumber(result.amountIn),
            amountOut: new BigNumber(result.amountOut),
            tradeFee: new BigNumber(result.tradeFee),
            protocolFee: new BigNumber(result.protocolFee),
            _event: event
        };
    }
    parseSwappedOneProviderEvent(receipt: TransactionReceipt): OSWAP_RangePair.SwappedOneProviderEvent[]{
        return this.parseEvents(receipt, "SwappedOneProvider").map(e=>this.decodeSwappedOneProviderEvent(e));
    }
    decodeSwappedOneProviderEvent(event: Event): OSWAP_RangePair.SwappedOneProviderEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            amountOut: new BigNumber(result.amountOut),
            amountIn: new BigNumber(result.amountIn),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newCounterReserveBalance: new BigNumber(result.newCounterReserveBalance),
            _event: event
        };
    }
    parseUpdateProviderOfferEvent(receipt: TransactionReceipt): OSWAP_RangePair.UpdateProviderOfferEvent[]{
        return this.parseEvents(receipt, "UpdateProviderOffer").map(e=>this.decodeUpdateProviderOfferEvent(e));
    }
    decodeUpdateProviderOfferEvent(event: Event): OSWAP_RangePair.UpdateProviderOfferEvent{
        let result = event.data;
        return {
            provider: result.provider,
            direction: result.direction,
            replenish: new BigNumber(result.replenish),
            newAmountBalance: new BigNumber(result.newAmountBalance),
            newReserveBalance: new BigNumber(result.newReserveBalance),
            lowerLimit: new BigNumber(result.lowerLimit),
            upperLimit: new BigNumber(result.upperLimit),
            startDate: new BigNumber(result.startDate),
            expire: new BigNumber(result.expire),
            privateReplenish: result.privateReplenish,
            _event: event
        };
    }
    addLiquidity: {
        (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<BigNumber>;
        txData: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    counter: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    factory: {
        (options?: TransactionOptions): Promise<string>;
    }
    getAmountIn: {
        (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountOut: {
        (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getBalances: {
        (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber,param3:BigNumber}>;
    }
    getLastBalances: {
        (options?: TransactionOptions): Promise<{param1:BigNumber,param2:BigNumber}>;
    }
    getLatestPrice: {
        (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getOffers: {
        (params: IGetOffersParams, options?: TransactionOptions): Promise<{provider:string[],amountAndReserve:BigNumber[],lowerLimitAndUpperLimit:BigNumber[],startDateAndExpire:BigNumber[],privateReplenish:boolean[]}>;
    }
    getProviderOffer: {
        (params: IGetProviderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber,staked:BigNumber,amount:BigNumber,reserve:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,privateReplenish:boolean}>;
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
    offers: {
        (params: IOffersParams, options?: TransactionOptions): Promise<{provider:string,amount:BigNumber,reserve:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,privateReplenish:boolean}>;
    }
    oracleFactory: {
        (options?: TransactionOptions): Promise<string>;
    }
    protocolFeeBalance0: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFeeBalance1: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    providerOfferIndex: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    providerStaking: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    rangeLiquidityProvider: {
        (options?: TransactionOptions): Promise<string>;
    }
    redeemProtocolFee: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    removeAllLiquidity: {
        (provider:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (provider:string, options?: TransactionOptions) => Promise<{amount0:BigNumber,amount1:BigNumber,staked:BigNumber}>;
        txData: (provider:string, options?: TransactionOptions) => Promise<string>;
    }
    removeLiquidity: {
        (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    replenish: {
        (params: IReplenishParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IReplenishParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IReplenishParams, options?: TransactionOptions) => Promise<string>;
    }
    scaleDirection: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    scaler: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    setLive: {
        (isLive:boolean, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (isLive:boolean, options?: TransactionOptions) => Promise<void>;
        txData: (isLive:boolean, options?: TransactionOptions) => Promise<string>;
    }
    stakeBalance: {
        (options?: TransactionOptions): Promise<BigNumber>;
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
    updateProviderOffer: {
        (params: IUpdateProviderOfferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IUpdateProviderOfferParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IUpdateProviderOfferParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let counter_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('counter',[],options);
            return new BigNumber(result);
        }
        this.counter = counter_call
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
        let getAmountInParams = (params: IGetAmountInParams) => [params.tokenOut,this.wallet.utils.toString(params.amountOut),this.wallet.utils.stringToBytes(params.data)];
        let getAmountIn_call = async (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountIn',getAmountInParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountIn = getAmountIn_call
        let getAmountOutParams = (params: IGetAmountOutParams) => [params.tokenIn,this.wallet.utils.toString(params.amountIn),this.wallet.utils.stringToBytes(params.data)];
        let getAmountOut_call = async (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountOut',getAmountOutParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountOut = getAmountOut_call
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
        let getLatestPriceParams = (params: IGetLatestPriceParams) => [params.direction,this.wallet.utils.stringToBytes(params.payload)];
        let getLatestPrice_call = async (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getLatestPrice',getLatestPriceParams(params),options);
            return new BigNumber(result);
        }
        this.getLatestPrice = getLatestPrice_call
        let getOffersParams = (params: IGetOffersParams) => [params.direction,this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.end)];
        let getOffers_call = async (params: IGetOffersParams, options?: TransactionOptions): Promise<{provider:string[],amountAndReserve:BigNumber[],lowerLimitAndUpperLimit:BigNumber[],startDateAndExpire:BigNumber[],privateReplenish:boolean[]}> => {
            let result = await this.call('getOffers',getOffersParams(params),options);
            return {
                provider: result.provider,
                amountAndReserve: result.amountAndReserve.map(e=>new BigNumber(e)),
                lowerLimitAndUpperLimit: result.lowerLimitAndUpperLimit.map(e=>new BigNumber(e)),
                startDateAndExpire: result.startDateAndExpire.map(e=>new BigNumber(e)),
                privateReplenish: result.privateReplenish
            };
        }
        this.getOffers = getOffers_call
        let getProviderOfferParams = (params: IGetProviderOfferParams) => [params.provider,params.direction];
        let getProviderOffer_call = async (params: IGetProviderOfferParams, options?: TransactionOptions): Promise<{index:BigNumber,staked:BigNumber,amount:BigNumber,reserve:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,privateReplenish:boolean}> => {
            let result = await this.call('getProviderOffer',getProviderOfferParams(params),options);
            return {
                index: new BigNumber(result.index),
                staked: new BigNumber(result.staked),
                amount: new BigNumber(result.amount),
                reserve: new BigNumber(result.reserve),
                lowerLimit: new BigNumber(result.lowerLimit),
                upperLimit: new BigNumber(result.upperLimit),
                startDate: new BigNumber(result.startDate),
                expire: new BigNumber(result.expire),
                privateReplenish: result.privateReplenish
            };
        }
        this.getProviderOffer = getProviderOffer_call
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
        let offersParams = (params: IOffersParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let offers_call = async (params: IOffersParams, options?: TransactionOptions): Promise<{provider:string,amount:BigNumber,reserve:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,privateReplenish:boolean}> => {
            let result = await this.call('offers',offersParams(params),options);
            return {
                provider: result.provider,
                amount: new BigNumber(result.amount),
                reserve: new BigNumber(result.reserve),
                lowerLimit: new BigNumber(result.lowerLimit),
                upperLimit: new BigNumber(result.upperLimit),
                startDate: new BigNumber(result.startDate),
                expire: new BigNumber(result.expire),
                privateReplenish: result.privateReplenish
            };
        }
        this.offers = offers_call
        let oracleFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracleFactory',[],options);
            return result;
        }
        this.oracleFactory = oracleFactory_call
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
        let providerOfferIndex_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('providerOfferIndex',[param1],options);
            return new BigNumber(result);
        }
        this.providerOfferIndex = providerOfferIndex_call
        let providerStaking_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('providerStaking',[param1],options);
            return new BigNumber(result);
        }
        this.providerStaking = providerStaking_call
        let rangeLiquidityProvider_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('rangeLiquidityProvider',[],options);
            return result;
        }
        this.rangeLiquidityProvider = rangeLiquidityProvider_call
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
        let stakeBalance_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('stakeBalance',[],options);
            return new BigNumber(result);
        }
        this.stakeBalance = stakeBalance_call
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
        let addLiquidityParams = (params: IAddLiquidityParams) => [params.provider,params.direction,this.wallet.utils.toString(params.staked),this.wallet.utils.toString(params.lowerLimit),this.wallet.utils.toString(params.upperLimit),this.wallet.utils.toString(params.startDate),this.wallet.utils.toString(params.expire)];
        let addLiquidity_send = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        let addLiquidity_call = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('addLiquidity',addLiquidityParams(params),options);
            return new BigNumber(result);
        }
        let addLiquidity_txData = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        this.addLiquidity = Object.assign(addLiquidity_send, {
            call:addLiquidity_call
            , txData:addLiquidity_txData
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
        let removeAllLiquidity_call = async (provider:string, options?: TransactionOptions): Promise<{amount0:BigNumber,amount1:BigNumber,staked:BigNumber}> => {
            let result = await this.call('removeAllLiquidity',[provider],options);
            return {
                amount0: new BigNumber(result.amount0),
                amount1: new BigNumber(result.amount1),
                staked: new BigNumber(result.staked)
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
        let removeLiquidityParams = (params: IRemoveLiquidityParams) => [params.provider,params.direction,this.wallet.utils.toString(params.unstake),this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.reserveOut),this.wallet.utils.toString(params.lowerLimit),this.wallet.utils.toString(params.upperLimit),this.wallet.utils.toString(params.startDate),this.wallet.utils.toString(params.expire)];
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
        let replenishParams = (params: IReplenishParams) => [params.provider,params.direction,this.wallet.utils.toString(params.amountIn)];
        let replenish_send = async (params: IReplenishParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('replenish',replenishParams(params),options);
            return result;
        }
        let replenish_call = async (params: IReplenishParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('replenish',replenishParams(params),options);
            return;
        }
        let replenish_txData = async (params: IReplenishParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('replenish',replenishParams(params),options);
            return result;
        }
        this.replenish = Object.assign(replenish_send, {
            call:replenish_call
            , txData:replenish_txData
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
        let swapParams = (params: ISwapParams) => [this.wallet.utils.toString(params.amount0Out),this.wallet.utils.toString(params.amount1Out),params.to,this.wallet.utils.stringToBytes(params.data)];
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
        let updateProviderOfferParams = (params: IUpdateProviderOfferParams) => [params.provider,params.direction,this.wallet.utils.toString(params.replenishAmount),this.wallet.utils.toString(params.lowerLimit),this.wallet.utils.toString(params.upperLimit),this.wallet.utils.toString(params.startDate),this.wallet.utils.toString(params.expire),params.privateReplenish];
        let updateProviderOffer_send = async (params: IUpdateProviderOfferParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateProviderOffer',updateProviderOfferParams(params),options);
            return result;
        }
        let updateProviderOffer_call = async (params: IUpdateProviderOfferParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateProviderOffer',updateProviderOfferParams(params),options);
            return;
        }
        let updateProviderOffer_txData = async (params: IUpdateProviderOfferParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateProviderOffer',updateProviderOfferParams(params),options);
            return result;
        }
        this.updateProviderOffer = Object.assign(updateProviderOffer_send, {
            call:updateProviderOffer_call
            , txData:updateProviderOffer_txData
        });
    }
}
export module OSWAP_RangePair{
    export interface AddLiquidityEvent {provider:string,direction:boolean,staked:BigNumber,amount:BigNumber,newStakeBalance:BigNumber,newAmountBalance:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,_event:Event}
    export interface NewProviderEvent {provider:string,index:BigNumber,_event:Event}
    export interface RemoveAllLiquidityEvent {provider:string,unstake:BigNumber,amount0Out:BigNumber,amount1Out:BigNumber,_event:Event}
    export interface RemoveLiquidityEvent {provider:string,direction:boolean,unstake:BigNumber,amountOut:BigNumber,reserveOut:BigNumber,newStakeBalance:BigNumber,newAmountBalance:BigNumber,newReserveBalance:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,_event:Event}
    export interface ReplenishEvent {provider:string,direction:boolean,amountIn:BigNumber,newAmountBalance:BigNumber,newReserveBalance:BigNumber,_event:Event}
    export interface SwapEvent {to:string,direction:boolean,price:BigNumber,amountIn:BigNumber,amountOut:BigNumber,tradeFee:BigNumber,protocolFee:BigNumber,_event:Event}
    export interface SwappedOneProviderEvent {provider:string,direction:boolean,amountOut:BigNumber,amountIn:BigNumber,newAmountBalance:BigNumber,newCounterReserveBalance:BigNumber,_event:Event}
    export interface UpdateProviderOfferEvent {provider:string,direction:boolean,replenish:BigNumber,newAmountBalance:BigNumber,newReserveBalance:BigNumber,lowerLimit:BigNumber,upperLimit:BigNumber,startDate:BigNumber,expire:BigNumber,privateReplenish:boolean,_event:Event}
}