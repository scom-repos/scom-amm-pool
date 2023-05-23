import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_RangeFactory.json";
export interface IDeployParams {governance:string;oracleFactory:string;pairCreator:string;tradeFee:number|BigNumber;stakeAmount:(number|BigNumber)[];liquidityProviderShare:(number|BigNumber)[];protocolFeeTo:string}
export interface ICreatePairParams {tokenA:string;tokenB:string}
export interface IGetPairParams {param1:string;param2:string}
export interface ISetLiquidityProviderShareParams {stakeAmount:(number|BigNumber)[];liquidityProviderShare:(number|BigNumber)[]}
export interface ISetLiveForPairParams {pair:string;live:boolean}
export class OSWAP_RangeFactory extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.oracleFactory,params.pairCreator,this.wallet.utils.toString(params.tradeFee),this.wallet.utils.toString(params.stakeAmount),this.wallet.utils.toString(params.liquidityProviderShare),params.protocolFeeTo], options);
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): OSWAP_RangeFactory.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parsePairCreatedEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.PairCreatedEvent[]{
        return this.parseEvents(receipt, "PairCreated").map(e=>this.decodePairCreatedEvent(e));
    }
    decodePairCreatedEvent(event: Event): OSWAP_RangeFactory.PairCreatedEvent{
        let result = event.data;
        return {
            token0: result.token0,
            token1: result.token1,
            pair: result.pair,
            newSize: new BigNumber(result.newSize),
            _event: event
        };
    }
    parsePairRestartedEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.PairRestartedEvent[]{
        return this.parseEvents(receipt, "PairRestarted").map(e=>this.decodePairRestartedEvent(e));
    }
    decodePairRestartedEvent(event: Event): OSWAP_RangeFactory.PairRestartedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parsePairShutdownedEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.PairShutdownedEvent[]{
        return this.parseEvents(receipt, "PairShutdowned").map(e=>this.decodePairShutdownedEvent(e));
    }
    decodePairShutdownedEvent(event: Event): OSWAP_RangeFactory.PairShutdownedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parseParamSetEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.ParamSetEvent[]{
        return this.parseEvents(receipt, "ParamSet").map(e=>this.decodeParamSetEvent(e));
    }
    decodeParamSetEvent(event: Event): OSWAP_RangeFactory.ParamSetEvent{
        let result = event.data;
        return {
            name: result.name,
            value: result.value,
            _event: event
        };
    }
    parseParamSet2Event(receipt: TransactionReceipt): OSWAP_RangeFactory.ParamSet2Event[]{
        return this.parseEvents(receipt, "ParamSet2").map(e=>this.decodeParamSet2Event(e));
    }
    decodeParamSet2Event(event: Event): OSWAP_RangeFactory.ParamSet2Event{
        let result = event.data;
        return {
            name: result.name,
            value1: result.value1,
            value2: result.value2,
            _event: event
        };
    }
    parseRestartedEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.RestartedEvent[]{
        return this.parseEvents(receipt, "Restarted").map(e=>this.decodeRestartedEvent(e));
    }
    decodeRestartedEvent(event: Event): OSWAP_RangeFactory.RestartedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    parseShutdownedEvent(receipt: TransactionReceipt): OSWAP_RangeFactory.ShutdownedEvent[]{
        return this.parseEvents(receipt, "Shutdowned").map(e=>this.decodeShutdownedEvent(e));
    }
    decodeShutdownedEvent(event: Event): OSWAP_RangeFactory.ShutdownedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    allPairs: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    allPairsLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    checkAndGetSwapParams: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    createPair: {
        (params: ICreatePairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
        txData: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
    }
    getAllLiquidityProviderShare: {
        (options?: TransactionOptions): Promise<{_stakeAmount:BigNumber[],_liquidityProviderShare:BigNumber[]}>;
    }
    getCreateAddresses: {
        (options?: TransactionOptions): Promise<{_governance:string,_rangeLiquidityProvider:string,_oracleFactory:string}>;
    }
    getLiquidityProviderShare: {
        (stake:number|BigNumber, options?: TransactionOptions): Promise<BigNumber>;
    }
    getPair: {
        (params: IGetPairParams, options?: TransactionOptions): Promise<string>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    isLive: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    liquidityProviderShare: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber>;
    }
    oracleFactory: {
        (options?: TransactionOptions): Promise<string>;
    }
    owner: {
        (options?: TransactionOptions): Promise<string>;
    }
    pairCreator: {
        (options?: TransactionOptions): Promise<string>;
    }
    protocolFeeTo: {
        (options?: TransactionOptions): Promise<string>;
    }
    rangeLiquidityProvider: {
        (options?: TransactionOptions): Promise<string>;
    }
    renounceOwnership: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    setLiquidityProviderShare: {
        (params: ISetLiquidityProviderShareParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetLiquidityProviderShareParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetLiquidityProviderShareParams, options?: TransactionOptions) => Promise<string>;
    }
    setLive: {
        (isLive:boolean, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (isLive:boolean, options?: TransactionOptions) => Promise<void>;
        txData: (isLive:boolean, options?: TransactionOptions) => Promise<string>;
    }
    setLiveForPair: {
        (params: ISetLiveForPairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetLiveForPairParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetLiveForPairParams, options?: TransactionOptions) => Promise<string>;
    }
    setProtocolFeeTo: {
        (protocolFeeTo:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (protocolFeeTo:string, options?: TransactionOptions) => Promise<void>;
        txData: (protocolFeeTo:string, options?: TransactionOptions) => Promise<string>;
    }
    setRangeLiquidityProvider: {
        (rangeLiquidityProvider:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (rangeLiquidityProvider:string, options?: TransactionOptions) => Promise<void>;
        txData: (rangeLiquidityProvider:string, options?: TransactionOptions) => Promise<string>;
    }
    setTradeFee: {
        (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    stakeAmount: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber>;
    }
    tradeFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transferOwnership: {
        (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (newOwner:string, options?: TransactionOptions) => Promise<void>;
        txData: (newOwner:string, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let allPairs_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('allPairs',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.allPairs = allPairs_call
        let allPairsLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('allPairsLength',[],options);
            return new BigNumber(result);
        }
        this.allPairsLength = allPairsLength_call
        let checkAndGetSwapParams_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('checkAndGetSwapParams',[],options);
            return new BigNumber(result);
        }
        this.checkAndGetSwapParams = checkAndGetSwapParams_call
        let getAllLiquidityProviderShare_call = async (options?: TransactionOptions): Promise<{_stakeAmount:BigNumber[],_liquidityProviderShare:BigNumber[]}> => {
            let result = await this.call('getAllLiquidityProviderShare',[],options);
            return {
                _stakeAmount: result._stakeAmount.map(e=>new BigNumber(e)),
                _liquidityProviderShare: result._liquidityProviderShare.map(e=>new BigNumber(e))
            };
        }
        this.getAllLiquidityProviderShare = getAllLiquidityProviderShare_call
        let getCreateAddresses_call = async (options?: TransactionOptions): Promise<{_governance:string,_rangeLiquidityProvider:string,_oracleFactory:string}> => {
            let result = await this.call('getCreateAddresses',[],options);
            return {
                _governance: result._governance,
                _rangeLiquidityProvider: result._rangeLiquidityProvider,
                _oracleFactory: result._oracleFactory
            };
        }
        this.getCreateAddresses = getCreateAddresses_call
        let getLiquidityProviderShare_call = async (stake:number|BigNumber, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getLiquidityProviderShare',[this.wallet.utils.toString(stake)],options);
            return new BigNumber(result);
        }
        this.getLiquidityProviderShare = getLiquidityProviderShare_call
        let getPairParams = (params: IGetPairParams) => [params.param1,params.param2];
        let getPair_call = async (params: IGetPairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('getPair',getPairParams(params),options);
            return result;
        }
        this.getPair = getPair_call
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
        let liquidityProviderShare_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('liquidityProviderShare',[this.wallet.utils.toString(param1)],options);
            return new BigNumber(result);
        }
        this.liquidityProviderShare = liquidityProviderShare_call
        let oracleFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracleFactory',[],options);
            return result;
        }
        this.oracleFactory = oracleFactory_call
        let owner_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('owner',[],options);
            return result;
        }
        this.owner = owner_call
        let pairCreator_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('pairCreator',[],options);
            return result;
        }
        this.pairCreator = pairCreator_call
        let protocolFeeTo_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('protocolFeeTo',[],options);
            return result;
        }
        this.protocolFeeTo = protocolFeeTo_call
        let rangeLiquidityProvider_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('rangeLiquidityProvider',[],options);
            return result;
        }
        this.rangeLiquidityProvider = rangeLiquidityProvider_call
        let stakeAmount_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('stakeAmount',[this.wallet.utils.toString(param1)],options);
            return new BigNumber(result);
        }
        this.stakeAmount = stakeAmount_call
        let tradeFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('tradeFee',[],options);
            return new BigNumber(result);
        }
        this.tradeFee = tradeFee_call
        let createPairParams = (params: ICreatePairParams) => [params.tokenA,params.tokenB];
        let createPair_send = async (params: ICreatePairParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('createPair',createPairParams(params),options);
            return result;
        }
        let createPair_call = async (params: ICreatePairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('createPair',createPairParams(params),options);
            return result;
        }
        let createPair_txData = async (params: ICreatePairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('createPair',createPairParams(params),options);
            return result;
        }
        this.createPair = Object.assign(createPair_send, {
            call:createPair_call
            , txData:createPair_txData
        });
        let renounceOwnership_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('renounceOwnership',[],options);
            return result;
        }
        let renounceOwnership_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('renounceOwnership',[],options);
            return;
        }
        let renounceOwnership_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('renounceOwnership',[],options);
            return result;
        }
        this.renounceOwnership = Object.assign(renounceOwnership_send, {
            call:renounceOwnership_call
            , txData:renounceOwnership_txData
        });
        let setLiquidityProviderShareParams = (params: ISetLiquidityProviderShareParams) => [this.wallet.utils.toString(params.stakeAmount),this.wallet.utils.toString(params.liquidityProviderShare)];
        let setLiquidityProviderShare_send = async (params: ISetLiquidityProviderShareParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setLiquidityProviderShare',setLiquidityProviderShareParams(params),options);
            return result;
        }
        let setLiquidityProviderShare_call = async (params: ISetLiquidityProviderShareParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setLiquidityProviderShare',setLiquidityProviderShareParams(params),options);
            return;
        }
        let setLiquidityProviderShare_txData = async (params: ISetLiquidityProviderShareParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setLiquidityProviderShare',setLiquidityProviderShareParams(params),options);
            return result;
        }
        this.setLiquidityProviderShare = Object.assign(setLiquidityProviderShare_send, {
            call:setLiquidityProviderShare_call
            , txData:setLiquidityProviderShare_txData
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
        let setLiveForPairParams = (params: ISetLiveForPairParams) => [params.pair,params.live];
        let setLiveForPair_send = async (params: ISetLiveForPairParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setLiveForPair',setLiveForPairParams(params),options);
            return result;
        }
        let setLiveForPair_call = async (params: ISetLiveForPairParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setLiveForPair',setLiveForPairParams(params),options);
            return;
        }
        let setLiveForPair_txData = async (params: ISetLiveForPairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setLiveForPair',setLiveForPairParams(params),options);
            return result;
        }
        this.setLiveForPair = Object.assign(setLiveForPair_send, {
            call:setLiveForPair_call
            , txData:setLiveForPair_txData
        });
        let setProtocolFeeTo_send = async (protocolFeeTo:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setProtocolFeeTo',[protocolFeeTo],options);
            return result;
        }
        let setProtocolFeeTo_call = async (protocolFeeTo:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setProtocolFeeTo',[protocolFeeTo],options);
            return;
        }
        let setProtocolFeeTo_txData = async (protocolFeeTo:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setProtocolFeeTo',[protocolFeeTo],options);
            return result;
        }
        this.setProtocolFeeTo = Object.assign(setProtocolFeeTo_send, {
            call:setProtocolFeeTo_call
            , txData:setProtocolFeeTo_txData
        });
        let setRangeLiquidityProvider_send = async (rangeLiquidityProvider:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setRangeLiquidityProvider',[rangeLiquidityProvider],options);
            return result;
        }
        let setRangeLiquidityProvider_call = async (rangeLiquidityProvider:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setRangeLiquidityProvider',[rangeLiquidityProvider],options);
            return;
        }
        let setRangeLiquidityProvider_txData = async (rangeLiquidityProvider:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setRangeLiquidityProvider',[rangeLiquidityProvider],options);
            return result;
        }
        this.setRangeLiquidityProvider = Object.assign(setRangeLiquidityProvider_send, {
            call:setRangeLiquidityProvider_call
            , txData:setRangeLiquidityProvider_txData
        });
        let setTradeFee_send = async (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setTradeFee',[this.wallet.utils.toString(tradeFee)],options);
            return result;
        }
        let setTradeFee_call = async (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setTradeFee',[this.wallet.utils.toString(tradeFee)],options);
            return;
        }
        let setTradeFee_txData = async (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setTradeFee',[this.wallet.utils.toString(tradeFee)],options);
            return result;
        }
        this.setTradeFee = Object.assign(setTradeFee_send, {
            call:setTradeFee_call
            , txData:setTradeFee_txData
        });
        let transferOwnership_send = async (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transferOwnership',[newOwner],options);
            return result;
        }
        let transferOwnership_call = async (newOwner:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('transferOwnership',[newOwner],options);
            return;
        }
        let transferOwnership_txData = async (newOwner:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('transferOwnership',[newOwner],options);
            return result;
        }
        this.transferOwnership = Object.assign(transferOwnership_send, {
            call:transferOwnership_call
            , txData:transferOwnership_txData
        });
    }
}
export module OSWAP_RangeFactory{
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface PairCreatedEvent {token0:string,token1:string,pair:string,newSize:BigNumber,_event:Event}
    export interface PairRestartedEvent {pair:string,_event:Event}
    export interface PairShutdownedEvent {pair:string,_event:Event}
    export interface ParamSetEvent {name:string,value:string,_event:Event}
    export interface ParamSet2Event {name:string,value1:string,value2:string,_event:Event}
    export interface RestartedEvent {_event:Event}
    export interface ShutdownedEvent {_event:Event}
}