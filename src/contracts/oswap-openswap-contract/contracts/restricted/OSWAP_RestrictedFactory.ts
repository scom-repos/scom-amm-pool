import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_RestrictedFactory.json";
export interface IDeployParams {governance:string;whitelistFactory:string;pairCreator:string;configStore:string;tradeFee:number|BigNumber;protocolFee:number|BigNumber;protocolFeeTo:string}
export interface IAddOldOracleToNewPairParams {tokenA:string;tokenB:string;oracle:string}
export interface ICheckAndGetOracleParams {tokenA:string;tokenB:string}
export interface ICheckAndGetOracleSwapParamsParams {tokenA:string;tokenB:string}
export interface ICreatePairParams {tokenA:string;tokenB:string}
export interface IGetPairParams {param1:string;param2:string;param3:number|BigNumber}
export interface IOraclesParams {param1:string;param2:string}
export interface IPairLengthParams {tokenA:string;tokenB:string}
export interface ISetLiveForPairParams {pair:string;live:boolean}
export interface ISetOracleParams {tokenA:string;tokenB:string;oracle:string}
export class OSWAP_RestrictedFactory extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.whitelistFactory,params.pairCreator,params.configStore,this.wallet.utils.toString(params.tradeFee),this.wallet.utils.toString(params.protocolFee),params.protocolFeeTo], options);
    }
    parseOracleAddedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.OracleAddedEvent[]{
        return this.parseEvents(receipt, "OracleAdded").map(e=>this.decodeOracleAddedEvent(e));
    }
    decodeOracleAddedEvent(event: Event): OSWAP_RestrictedFactory.OracleAddedEvent{
        let result = event.data;
        return {
            token0: result.token0,
            token1: result.token1,
            oracle: result.oracle,
            _event: event
        };
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): OSWAP_RestrictedFactory.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parsePairCreatedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.PairCreatedEvent[]{
        return this.parseEvents(receipt, "PairCreated").map(e=>this.decodePairCreatedEvent(e));
    }
    decodePairCreatedEvent(event: Event): OSWAP_RestrictedFactory.PairCreatedEvent{
        let result = event.data;
        return {
            token0: result.token0,
            token1: result.token1,
            pair: result.pair,
            newPairSize: new BigNumber(result.newPairSize),
            newSize: new BigNumber(result.newSize),
            _event: event
        };
    }
    parsePairRestartedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.PairRestartedEvent[]{
        return this.parseEvents(receipt, "PairRestarted").map(e=>this.decodePairRestartedEvent(e));
    }
    decodePairRestartedEvent(event: Event): OSWAP_RestrictedFactory.PairRestartedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parsePairShutdownedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.PairShutdownedEvent[]{
        return this.parseEvents(receipt, "PairShutdowned").map(e=>this.decodePairShutdownedEvent(e));
    }
    decodePairShutdownedEvent(event: Event): OSWAP_RestrictedFactory.PairShutdownedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parseParamSetEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.ParamSetEvent[]{
        return this.parseEvents(receipt, "ParamSet").map(e=>this.decodeParamSetEvent(e));
    }
    decodeParamSetEvent(event: Event): OSWAP_RestrictedFactory.ParamSetEvent{
        let result = event.data;
        return {
            name: result.name,
            value: result.value,
            _event: event
        };
    }
    parseParamSet2Event(receipt: TransactionReceipt): OSWAP_RestrictedFactory.ParamSet2Event[]{
        return this.parseEvents(receipt, "ParamSet2").map(e=>this.decodeParamSet2Event(e));
    }
    decodeParamSet2Event(event: Event): OSWAP_RestrictedFactory.ParamSet2Event{
        let result = event.data;
        return {
            name: result.name,
            value1: result.value1,
            value2: result.value2,
            _event: event
        };
    }
    parseRestartedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.RestartedEvent[]{
        return this.parseEvents(receipt, "Restarted").map(e=>this.decodeRestartedEvent(e));
    }
    decodeRestartedEvent(event: Event): OSWAP_RestrictedFactory.RestartedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    parseShutdownedEvent(receipt: TransactionReceipt): OSWAP_RestrictedFactory.ShutdownedEvent[]{
        return this.parseEvents(receipt, "Shutdowned").map(e=>this.decodeShutdownedEvent(e));
    }
    decodeShutdownedEvent(event: Event): OSWAP_RestrictedFactory.ShutdownedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    addOldOracleToNewPair: {
        (params: IAddOldOracleToNewPairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddOldOracleToNewPairParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IAddOldOracleToNewPairParams, options?: TransactionOptions) => Promise<string>;
    }
    allPairs: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    allPairsLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    checkAndGetOracle: {
        (params: ICheckAndGetOracleParams, options?: TransactionOptions): Promise<string>;
    }
    checkAndGetOracleSwapParams: {
        (params: ICheckAndGetOracleSwapParamsParams, options?: TransactionOptions): Promise<{oracle_:string,tradeFee_:BigNumber,protocolFee_:BigNumber}>;
    }
    configStore: {
        (options?: TransactionOptions): Promise<string>;
    }
    createPair: {
        (params: ICreatePairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
        txData: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
    }
    getCreateAddresses: {
        (options?: TransactionOptions): Promise<{_governance:string,_whitelistFactory:string,_restrictedLiquidityProvider:string,_configStore:string}>;
    }
    getPair: {
        (params: IGetPairParams, options?: TransactionOptions): Promise<string>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    init: {
        (restrictedLiquidityProvider:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (restrictedLiquidityProvider:string, options?: TransactionOptions) => Promise<void>;
        txData: (restrictedLiquidityProvider:string, options?: TransactionOptions) => Promise<string>;
    }
    isLive: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    isOracle: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    isPair: {
        (pair:string, options?: TransactionOptions): Promise<boolean>;
    }
    oracles: {
        (params: IOraclesParams, options?: TransactionOptions): Promise<string>;
    }
    owner: {
        (options?: TransactionOptions): Promise<string>;
    }
    pairCreator: {
        (options?: TransactionOptions): Promise<string>;
    }
    pairIdx: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    pairLength: {
        (params: IPairLengthParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFeeTo: {
        (options?: TransactionOptions): Promise<string>;
    }
    renounceOwnership: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    restrictedLiquidityProvider: {
        (options?: TransactionOptions): Promise<string>;
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
    setOracle: {
        (params: ISetOracleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetOracleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetOracleParams, options?: TransactionOptions) => Promise<string>;
    }
    setProtocolFee: {
        (protocolFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (protocolFee:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (protocolFee:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    setProtocolFeeTo: {
        (protocolFeeTo:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (protocolFeeTo:string, options?: TransactionOptions) => Promise<void>;
        txData: (protocolFeeTo:string, options?: TransactionOptions) => Promise<string>;
    }
    setTradeFee: {
        (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    tradeFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transferOwnership: {
        (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (newOwner:string, options?: TransactionOptions) => Promise<void>;
        txData: (newOwner:string, options?: TransactionOptions) => Promise<string>;
    }
    whitelistFactory: {
        (options?: TransactionOptions): Promise<string>;
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
        let checkAndGetOracleParams = (params: ICheckAndGetOracleParams) => [params.tokenA,params.tokenB];
        let checkAndGetOracle_call = async (params: ICheckAndGetOracleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('checkAndGetOracle',checkAndGetOracleParams(params),options);
            return result;
        }
        this.checkAndGetOracle = checkAndGetOracle_call
        let checkAndGetOracleSwapParamsParams = (params: ICheckAndGetOracleSwapParamsParams) => [params.tokenA,params.tokenB];
        let checkAndGetOracleSwapParams_call = async (params: ICheckAndGetOracleSwapParamsParams, options?: TransactionOptions): Promise<{oracle_:string,tradeFee_:BigNumber,protocolFee_:BigNumber}> => {
            let result = await this.call('checkAndGetOracleSwapParams',checkAndGetOracleSwapParamsParams(params),options);
            return {
                oracle_: result.oracle_,
                tradeFee_: new BigNumber(result.tradeFee_),
                protocolFee_: new BigNumber(result.protocolFee_)
            };
        }
        this.checkAndGetOracleSwapParams = checkAndGetOracleSwapParams_call
        let configStore_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('configStore',[],options);
            return result;
        }
        this.configStore = configStore_call
        let getCreateAddresses_call = async (options?: TransactionOptions): Promise<{_governance:string,_whitelistFactory:string,_restrictedLiquidityProvider:string,_configStore:string}> => {
            let result = await this.call('getCreateAddresses',[],options);
            return {
                _governance: result._governance,
                _whitelistFactory: result._whitelistFactory,
                _restrictedLiquidityProvider: result._restrictedLiquidityProvider,
                _configStore: result._configStore
            };
        }
        this.getCreateAddresses = getCreateAddresses_call
        let getPairParams = (params: IGetPairParams) => [params.param1,params.param2,this.wallet.utils.toString(params.param3)];
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
        let isOracle_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isOracle',[param1],options);
            return result;
        }
        this.isOracle = isOracle_call
        let isPair_call = async (pair:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isPair',[pair],options);
            return result;
        }
        this.isPair = isPair_call
        let oraclesParams = (params: IOraclesParams) => [params.param1,params.param2];
        let oracles_call = async (params: IOraclesParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracles',oraclesParams(params),options);
            return result;
        }
        this.oracles = oracles_call
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
        let pairIdx_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('pairIdx',[param1],options);
            return new BigNumber(result);
        }
        this.pairIdx = pairIdx_call
        let pairLengthParams = (params: IPairLengthParams) => [params.tokenA,params.tokenB];
        let pairLength_call = async (params: IPairLengthParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('pairLength',pairLengthParams(params),options);
            return new BigNumber(result);
        }
        this.pairLength = pairLength_call
        let protocolFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('protocolFee',[],options);
            return new BigNumber(result);
        }
        this.protocolFee = protocolFee_call
        let protocolFeeTo_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('protocolFeeTo',[],options);
            return result;
        }
        this.protocolFeeTo = protocolFeeTo_call
        let restrictedLiquidityProvider_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('restrictedLiquidityProvider',[],options);
            return result;
        }
        this.restrictedLiquidityProvider = restrictedLiquidityProvider_call
        let tradeFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('tradeFee',[],options);
            return new BigNumber(result);
        }
        this.tradeFee = tradeFee_call
        let whitelistFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('whitelistFactory',[],options);
            return result;
        }
        this.whitelistFactory = whitelistFactory_call
        let addOldOracleToNewPairParams = (params: IAddOldOracleToNewPairParams) => [params.tokenA,params.tokenB,params.oracle];
        let addOldOracleToNewPair_send = async (params: IAddOldOracleToNewPairParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addOldOracleToNewPair',addOldOracleToNewPairParams(params),options);
            return result;
        }
        let addOldOracleToNewPair_call = async (params: IAddOldOracleToNewPairParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('addOldOracleToNewPair',addOldOracleToNewPairParams(params),options);
            return;
        }
        let addOldOracleToNewPair_txData = async (params: IAddOldOracleToNewPairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('addOldOracleToNewPair',addOldOracleToNewPairParams(params),options);
            return result;
        }
        this.addOldOracleToNewPair = Object.assign(addOldOracleToNewPair_send, {
            call:addOldOracleToNewPair_call
            , txData:addOldOracleToNewPair_txData
        });
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
        let init_send = async (restrictedLiquidityProvider:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('init',[restrictedLiquidityProvider],options);
            return result;
        }
        let init_call = async (restrictedLiquidityProvider:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('init',[restrictedLiquidityProvider],options);
            return;
        }
        let init_txData = async (restrictedLiquidityProvider:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('init',[restrictedLiquidityProvider],options);
            return result;
        }
        this.init = Object.assign(init_send, {
            call:init_call
            , txData:init_txData
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
        let setOracleParams = (params: ISetOracleParams) => [params.tokenA,params.tokenB,params.oracle];
        let setOracle_send = async (params: ISetOracleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setOracle',setOracleParams(params),options);
            return result;
        }
        let setOracle_call = async (params: ISetOracleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setOracle',setOracleParams(params),options);
            return;
        }
        let setOracle_txData = async (params: ISetOracleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setOracle',setOracleParams(params),options);
            return result;
        }
        this.setOracle = Object.assign(setOracle_send, {
            call:setOracle_call
            , txData:setOracle_txData
        });
        let setProtocolFee_send = async (protocolFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setProtocolFee',[this.wallet.utils.toString(protocolFee)],options);
            return result;
        }
        let setProtocolFee_call = async (protocolFee:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setProtocolFee',[this.wallet.utils.toString(protocolFee)],options);
            return;
        }
        let setProtocolFee_txData = async (protocolFee:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setProtocolFee',[this.wallet.utils.toString(protocolFee)],options);
            return result;
        }
        this.setProtocolFee = Object.assign(setProtocolFee_send, {
            call:setProtocolFee_call
            , txData:setProtocolFee_txData
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
export module OSWAP_RestrictedFactory{
    export interface OracleAddedEvent {token0:string,token1:string,oracle:string,_event:Event}
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface PairCreatedEvent {token0:string,token1:string,pair:string,newPairSize:BigNumber,newSize:BigNumber,_event:Event}
    export interface PairRestartedEvent {pair:string,_event:Event}
    export interface PairShutdownedEvent {pair:string,_event:Event}
    export interface ParamSetEvent {name:string,value:string,_event:Event}
    export interface ParamSet2Event {name:string,value1:string,value2:string,_event:Event}
    export interface RestartedEvent {_event:Event}
    export interface ShutdownedEvent {_event:Event}
}