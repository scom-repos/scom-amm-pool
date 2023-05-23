import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_OracleFactory.json";
export interface IDeployParams {governance:string;pairCreator:string;tradeFee:number|BigNumber;protocolFee:number|BigNumber;feePerDelegator:number|BigNumber;protocolFeeTo:string}
export interface IAddOldOracleToNewPairParams {tokenA:string;tokenB:string;oracle:string}
export interface ICheckAndGetOracleParams {tokenA:string;tokenB:string}
export interface ICheckAndGetOracleSwapParamsParams {tokenA:string;tokenB:string}
export interface ICreatePairParams {tokenA:string;tokenB:string}
export interface IGetPairParams {param1:string;param2:string}
export interface IOraclesParams {param1:string;param2:string}
export interface ISetLiveForPairParams {pair:string;live:boolean}
export interface ISetMinLotSizeParams {token:string;minLotSize:number|BigNumber}
export interface ISetOracleParams {tokenA:string;tokenB:string;oracle:string}
export interface ISetOracleLiquidityProviderParams {oracleRouter:string;oracleLiquidityProvider:string}
export interface ISetSecurityScoreOracleParams {securityScoreOracle:string;minOracleScore:number|BigNumber}
export interface ISetWhiteListParams {who:string;allow:boolean}
export class OSWAP_OracleFactory extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.pairCreator,this.wallet.utils.toString(params.tradeFee),this.wallet.utils.toString(params.protocolFee),this.wallet.utils.toString(params.feePerDelegator),params.protocolFeeTo], options);
    }
    parseOracleAddedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.OracleAddedEvent[]{
        return this.parseEvents(receipt, "OracleAdded").map(e=>this.decodeOracleAddedEvent(e));
    }
    decodeOracleAddedEvent(event: Event): OSWAP_OracleFactory.OracleAddedEvent{
        let result = event.data;
        return {
            token0: result.token0,
            token1: result.token1,
            oracle: result.oracle,
            _event: event
        };
    }
    parseOracleScoresEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.OracleScoresEvent[]{
        return this.parseEvents(receipt, "OracleScores").map(e=>this.decodeOracleScoresEvent(e));
    }
    decodeOracleScoresEvent(event: Event): OSWAP_OracleFactory.OracleScoresEvent{
        let result = event.data;
        return {
            oracle: result.oracle,
            score: new BigNumber(result.score),
            _event: event
        };
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): OSWAP_OracleFactory.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parsePairCreatedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.PairCreatedEvent[]{
        return this.parseEvents(receipt, "PairCreated").map(e=>this.decodePairCreatedEvent(e));
    }
    decodePairCreatedEvent(event: Event): OSWAP_OracleFactory.PairCreatedEvent{
        let result = event.data;
        return {
            token0: result.token0,
            token1: result.token1,
            pair: result.pair,
            newSize: new BigNumber(result.newSize),
            _event: event
        };
    }
    parsePairRestartedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.PairRestartedEvent[]{
        return this.parseEvents(receipt, "PairRestarted").map(e=>this.decodePairRestartedEvent(e));
    }
    decodePairRestartedEvent(event: Event): OSWAP_OracleFactory.PairRestartedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parsePairShutdownedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.PairShutdownedEvent[]{
        return this.parseEvents(receipt, "PairShutdowned").map(e=>this.decodePairShutdownedEvent(e));
    }
    decodePairShutdownedEvent(event: Event): OSWAP_OracleFactory.PairShutdownedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parseParamSetEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.ParamSetEvent[]{
        return this.parseEvents(receipt, "ParamSet").map(e=>this.decodeParamSetEvent(e));
    }
    decodeParamSetEvent(event: Event): OSWAP_OracleFactory.ParamSetEvent{
        let result = event.data;
        return {
            name: result.name,
            value: result.value,
            _event: event
        };
    }
    parseParamSet2Event(receipt: TransactionReceipt): OSWAP_OracleFactory.ParamSet2Event[]{
        return this.parseEvents(receipt, "ParamSet2").map(e=>this.decodeParamSet2Event(e));
    }
    decodeParamSet2Event(event: Event): OSWAP_OracleFactory.ParamSet2Event{
        let result = event.data;
        return {
            name: result.name,
            value1: result.value1,
            value2: result.value2,
            _event: event
        };
    }
    parseRestartedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.RestartedEvent[]{
        return this.parseEvents(receipt, "Restarted").map(e=>this.decodeRestartedEvent(e));
    }
    decodeRestartedEvent(event: Event): OSWAP_OracleFactory.RestartedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    parseShutdownedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.ShutdownedEvent[]{
        return this.parseEvents(receipt, "Shutdowned").map(e=>this.decodeShutdownedEvent(e));
    }
    decodeShutdownedEvent(event: Event): OSWAP_OracleFactory.ShutdownedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    parseWhitelistedEvent(receipt: TransactionReceipt): OSWAP_OracleFactory.WhitelistedEvent[]{
        return this.parseEvents(receipt, "Whitelisted").map(e=>this.decodeWhitelistedEvent(e));
    }
    decodeWhitelistedEvent(event: Event): OSWAP_OracleFactory.WhitelistedEvent{
        let result = event.data;
        return {
            who: result.who,
            allow: result.allow,
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
    allWhiteListed: {
        (options?: TransactionOptions): Promise<{list:string[],allowed:boolean[]}>;
    }
    checkAndGetOracle: {
        (params: ICheckAndGetOracleParams, options?: TransactionOptions): Promise<string>;
    }
    checkAndGetOracleSwapParams: {
        (params: ICheckAndGetOracleSwapParamsParams, options?: TransactionOptions): Promise<{oracle_:string,tradeFee_:BigNumber,protocolFee_:BigNumber}>;
    }
    createPair: {
        (params: ICreatePairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
        txData: (params: ICreatePairParams, options?: TransactionOptions) => Promise<string>;
    }
    feePerDelegator: {
        (options?: TransactionOptions): Promise<BigNumber>;
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
    isOracle: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    isWhitelisted: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    minLotSize: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    minOracleScore: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    oracleLiquidityProvider: {
        (options?: TransactionOptions): Promise<string>;
    }
    oracleScores: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
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
    securityScoreOracle: {
        (options?: TransactionOptions): Promise<string>;
    }
    setFeePerDelegator: {
        (feePerDelegator:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (feePerDelegator:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (feePerDelegator:number|BigNumber, options?: TransactionOptions) => Promise<string>;
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
    setMinLotSize: {
        (params: ISetMinLotSizeParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetMinLotSizeParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetMinLotSizeParams, options?: TransactionOptions) => Promise<string>;
    }
    setOracle: {
        (params: ISetOracleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetOracleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetOracleParams, options?: TransactionOptions) => Promise<string>;
    }
    setOracleLiquidityProvider: {
        (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions) => Promise<string>;
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
    setSecurityScoreOracle: {
        (params: ISetSecurityScoreOracleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetSecurityScoreOracleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetSecurityScoreOracleParams, options?: TransactionOptions) => Promise<string>;
    }
    setTradeFee: {
        (tradeFee:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (tradeFee:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    setWhiteList: {
        (params: ISetWhiteListParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetWhiteListParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetWhiteListParams, options?: TransactionOptions) => Promise<string>;
    }
    tradeFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transferOwnership: {
        (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (newOwner:string, options?: TransactionOptions) => Promise<void>;
        txData: (newOwner:string, options?: TransactionOptions) => Promise<string>;
    }
    updateOracleScore: {
        (oracle:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (oracle:string, options?: TransactionOptions) => Promise<void>;
        txData: (oracle:string, options?: TransactionOptions) => Promise<string>;
    }
    whitelisted: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    whitelistedInv: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    whitelistedLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
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
        let allWhiteListed_call = async (options?: TransactionOptions): Promise<{list:string[],allowed:boolean[]}> => {
            let result = await this.call('allWhiteListed',[],options);
            return {
                list: result.list,
                allowed: result.allowed
            };
        }
        this.allWhiteListed = allWhiteListed_call
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
        let feePerDelegator_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('feePerDelegator',[],options);
            return new BigNumber(result);
        }
        this.feePerDelegator = feePerDelegator_call
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
        let isOracle_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isOracle',[param1],options);
            return result;
        }
        this.isOracle = isOracle_call
        let isWhitelisted_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isWhitelisted',[param1],options);
            return result;
        }
        this.isWhitelisted = isWhitelisted_call
        let minLotSize_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('minLotSize',[param1],options);
            return new BigNumber(result);
        }
        this.minLotSize = minLotSize_call
        let minOracleScore_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('minOracleScore',[],options);
            return new BigNumber(result);
        }
        this.minOracleScore = minOracleScore_call
        let oracleLiquidityProvider_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracleLiquidityProvider',[],options);
            return result;
        }
        this.oracleLiquidityProvider = oracleLiquidityProvider_call
        let oracleScores_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('oracleScores',[param1],options);
            return new BigNumber(result);
        }
        this.oracleScores = oracleScores_call
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
        let securityScoreOracle_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('securityScoreOracle',[],options);
            return result;
        }
        this.securityScoreOracle = securityScoreOracle_call
        let tradeFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('tradeFee',[],options);
            return new BigNumber(result);
        }
        this.tradeFee = tradeFee_call
        let whitelisted_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('whitelisted',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.whitelisted = whitelisted_call
        let whitelistedInv_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('whitelistedInv',[param1],options);
            return new BigNumber(result);
        }
        this.whitelistedInv = whitelistedInv_call
        let whitelistedLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('whitelistedLength',[],options);
            return new BigNumber(result);
        }
        this.whitelistedLength = whitelistedLength_call
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
        let setFeePerDelegator_send = async (feePerDelegator:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setFeePerDelegator',[this.wallet.utils.toString(feePerDelegator)],options);
            return result;
        }
        let setFeePerDelegator_call = async (feePerDelegator:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setFeePerDelegator',[this.wallet.utils.toString(feePerDelegator)],options);
            return;
        }
        let setFeePerDelegator_txData = async (feePerDelegator:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setFeePerDelegator',[this.wallet.utils.toString(feePerDelegator)],options);
            return result;
        }
        this.setFeePerDelegator = Object.assign(setFeePerDelegator_send, {
            call:setFeePerDelegator_call
            , txData:setFeePerDelegator_txData
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
        let setMinLotSizeParams = (params: ISetMinLotSizeParams) => [params.token,this.wallet.utils.toString(params.minLotSize)];
        let setMinLotSize_send = async (params: ISetMinLotSizeParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setMinLotSize',setMinLotSizeParams(params),options);
            return result;
        }
        let setMinLotSize_call = async (params: ISetMinLotSizeParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setMinLotSize',setMinLotSizeParams(params),options);
            return;
        }
        let setMinLotSize_txData = async (params: ISetMinLotSizeParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setMinLotSize',setMinLotSizeParams(params),options);
            return result;
        }
        this.setMinLotSize = Object.assign(setMinLotSize_send, {
            call:setMinLotSize_call
            , txData:setMinLotSize_txData
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
        let setOracleLiquidityProviderParams = (params: ISetOracleLiquidityProviderParams) => [params.oracleRouter,params.oracleLiquidityProvider];
        let setOracleLiquidityProvider_send = async (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setOracleLiquidityProvider',setOracleLiquidityProviderParams(params),options);
            return result;
        }
        let setOracleLiquidityProvider_call = async (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setOracleLiquidityProvider',setOracleLiquidityProviderParams(params),options);
            return;
        }
        let setOracleLiquidityProvider_txData = async (params: ISetOracleLiquidityProviderParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setOracleLiquidityProvider',setOracleLiquidityProviderParams(params),options);
            return result;
        }
        this.setOracleLiquidityProvider = Object.assign(setOracleLiquidityProvider_send, {
            call:setOracleLiquidityProvider_call
            , txData:setOracleLiquidityProvider_txData
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
        let setSecurityScoreOracleParams = (params: ISetSecurityScoreOracleParams) => [params.securityScoreOracle,this.wallet.utils.toString(params.minOracleScore)];
        let setSecurityScoreOracle_send = async (params: ISetSecurityScoreOracleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setSecurityScoreOracle',setSecurityScoreOracleParams(params),options);
            return result;
        }
        let setSecurityScoreOracle_call = async (params: ISetSecurityScoreOracleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setSecurityScoreOracle',setSecurityScoreOracleParams(params),options);
            return;
        }
        let setSecurityScoreOracle_txData = async (params: ISetSecurityScoreOracleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setSecurityScoreOracle',setSecurityScoreOracleParams(params),options);
            return result;
        }
        this.setSecurityScoreOracle = Object.assign(setSecurityScoreOracle_send, {
            call:setSecurityScoreOracle_call
            , txData:setSecurityScoreOracle_txData
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
        let setWhiteListParams = (params: ISetWhiteListParams) => [params.who,params.allow];
        let setWhiteList_send = async (params: ISetWhiteListParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setWhiteList',setWhiteListParams(params),options);
            return result;
        }
        let setWhiteList_call = async (params: ISetWhiteListParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setWhiteList',setWhiteListParams(params),options);
            return;
        }
        let setWhiteList_txData = async (params: ISetWhiteListParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setWhiteList',setWhiteListParams(params),options);
            return result;
        }
        this.setWhiteList = Object.assign(setWhiteList_send, {
            call:setWhiteList_call
            , txData:setWhiteList_txData
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
        let updateOracleScore_send = async (oracle:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateOracleScore',[oracle],options);
            return result;
        }
        let updateOracleScore_call = async (oracle:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateOracleScore',[oracle],options);
            return;
        }
        let updateOracleScore_txData = async (oracle:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateOracleScore',[oracle],options);
            return result;
        }
        this.updateOracleScore = Object.assign(updateOracleScore_send, {
            call:updateOracleScore_call
            , txData:updateOracleScore_txData
        });
    }
}
export module OSWAP_OracleFactory{
    export interface OracleAddedEvent {token0:string,token1:string,oracle:string,_event:Event}
    export interface OracleScoresEvent {oracle:string,score:BigNumber,_event:Event}
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface PairCreatedEvent {token0:string,token1:string,pair:string,newSize:BigNumber,_event:Event}
    export interface PairRestartedEvent {pair:string,_event:Event}
    export interface PairShutdownedEvent {pair:string,_event:Event}
    export interface ParamSetEvent {name:string,value:string,_event:Event}
    export interface ParamSet2Event {name:string,value1:string,value2:string,_event:Event}
    export interface RestartedEvent {_event:Event}
    export interface ShutdownedEvent {_event:Event}
    export interface WhitelistedEvent {who:string,allow:boolean,_event:Event}
}