import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_HybridRouterRegistry.json";
export interface IInitParams {name:string[];factory:string[];fee:(number|BigNumber)[];feeBase:(number|BigNumber)[];typeCode:(number|BigNumber)[]}
export interface IRegisterPairParams {token0:string;token1:string;pairAddress:string;fee:number|BigNumber;feeBase:number|BigNumber;typeCode:number|BigNumber}
export interface IRegisterPairByAddressParams {factory:string;pairAddress:string}
export interface IRegisterPairByIndexParams {factory:string;index:number|BigNumber}
export interface IRegisterPairByTokensParams {factory:string;token0:string;token1:string}
export interface IRegisterPairByTokensV3Params {factory:string;token0:string;token1:string;pairIndex:number|BigNumber}
export interface IRegisterPairsByAddressParams {factory:string;pairAddress:string[]}
export interface IRegisterPairsByAddress2Params {factory:string[];pairAddress:string[]}
export interface IRegisterPairsByIndexParams {factory:string;index:(number|BigNumber)[]}
export interface IRegisterPairsByTokensParams {factory:string;token0:string[];token1:string[]}
export interface IRegisterPairsByTokensV3Params {factory:string;token0:string[];token1:string[];pairIndex:(number|BigNumber)[]}
export interface IRegisterProtocolParams {name:string;factory:string;fee:number|BigNumber;feeBase:number|BigNumber;typeCode:number|BigNumber}
export class OSWAP_HybridRouterRegistry extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(governance:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([governance], options);
    }
    parseCustomPairRegisterEvent(receipt: TransactionReceipt): OSWAP_HybridRouterRegistry.CustomPairRegisterEvent[]{
        return this.parseEvents(receipt, "CustomPairRegister").map(e=>this.decodeCustomPairRegisterEvent(e));
    }
    decodeCustomPairRegisterEvent(event: Event): OSWAP_HybridRouterRegistry.CustomPairRegisterEvent{
        let result = event.data;
        return {
            pair: result.pair,
            fee: new BigNumber(result.fee),
            feeBase: new BigNumber(result.feeBase),
            typeCode: new BigNumber(result.typeCode),
            _event: event
        };
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): OSWAP_HybridRouterRegistry.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): OSWAP_HybridRouterRegistry.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parsePairRegisterEvent(receipt: TransactionReceipt): OSWAP_HybridRouterRegistry.PairRegisterEvent[]{
        return this.parseEvents(receipt, "PairRegister").map(e=>this.decodePairRegisterEvent(e));
    }
    decodePairRegisterEvent(event: Event): OSWAP_HybridRouterRegistry.PairRegisterEvent{
        let result = event.data;
        return {
            factory: result.factory,
            pair: result.pair,
            token0: result.token0,
            token1: result.token1,
            _event: event
        };
    }
    parseProtocolRegisterEvent(receipt: TransactionReceipt): OSWAP_HybridRouterRegistry.ProtocolRegisterEvent[]{
        return this.parseEvents(receipt, "ProtocolRegister").map(e=>this.decodeProtocolRegisterEvent(e));
    }
    decodeProtocolRegisterEvent(event: Event): OSWAP_HybridRouterRegistry.ProtocolRegisterEvent{
        let result = event.data;
        return {
            factory: result.factory,
            name: result.name,
            fee: new BigNumber(result.fee),
            feeBase: new BigNumber(result.feeBase),
            typeCode: new BigNumber(result.typeCode),
            _event: event
        };
    }
    customPairs: {
        (param1:string, options?: TransactionOptions): Promise<{fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber}>;
    }
    execute: {
        (params:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params:string[], options?: TransactionOptions) => Promise<void>;
        txData: (params:string[], options?: TransactionOptions) => Promise<string>;
    }
    getFee: {
        (pairAddress:string, options?: TransactionOptions): Promise<{fee:BigNumber,feeBase:BigNumber}>;
    }
    getPairTokens: {
        (pairAddress:string[], options?: TransactionOptions): Promise<{token0:string[],token1:string[]}>;
    }
    getTypeCode: {
        (pairAddress:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    init: {
        (params: IInitParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IInitParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IInitParams, options?: TransactionOptions) => Promise<string>;
    }
    owner: {
        (options?: TransactionOptions): Promise<string>;
    }
    pairs: {
        (param1:string, options?: TransactionOptions): Promise<{factory:string,token0:string,token1:string}>;
    }
    protocolList: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    protocolListLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    protocols: {
        (param1:string, options?: TransactionOptions): Promise<{name:string,fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber}>;
    }
    registerPair: {
        (params: IRegisterPairParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairByAddress: {
        (params: IRegisterPairByAddressParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairByAddressParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairByAddressParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairByIndex: {
        (params: IRegisterPairByIndexParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairByIndexParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairByIndexParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairByTokens: {
        (params: IRegisterPairByTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairByTokensParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairByTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairByTokensV3: {
        (params: IRegisterPairByTokensV3Params, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairByTokensV3Params, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairByTokensV3Params, options?: TransactionOptions) => Promise<string>;
    }
    registerPairsByAddress: {
        (params: IRegisterPairsByAddressParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairsByAddressParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairsByAddressParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairsByAddress2: {
        (params: IRegisterPairsByAddress2Params, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairsByAddress2Params, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairsByAddress2Params, options?: TransactionOptions) => Promise<string>;
    }
    registerPairsByIndex: {
        (params: IRegisterPairsByIndexParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairsByIndexParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairsByIndexParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairsByTokens: {
        (params: IRegisterPairsByTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairsByTokensParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairsByTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    registerPairsByTokensV3: {
        (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions) => Promise<string>;
    }
    registerProtocol: {
        (params: IRegisterProtocolParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRegisterProtocolParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRegisterProtocolParams, options?: TransactionOptions) => Promise<string>;
    }
    renounceOwnership: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    transferOwnership: {
        (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (newOwner:string, options?: TransactionOptions) => Promise<void>;
        txData: (newOwner:string, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let customPairs_call = async (param1:string, options?: TransactionOptions): Promise<{fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber}> => {
            let result = await this.call('customPairs',[param1],options);
            return {
                fee: new BigNumber(result.fee),
                feeBase: new BigNumber(result.feeBase),
                typeCode: new BigNumber(result.typeCode)
            };
        }
        this.customPairs = customPairs_call
        let getFee_call = async (pairAddress:string, options?: TransactionOptions): Promise<{fee:BigNumber,feeBase:BigNumber}> => {
            let result = await this.call('getFee',[pairAddress],options);
            return {
                fee: new BigNumber(result.fee),
                feeBase: new BigNumber(result.feeBase)
            };
        }
        this.getFee = getFee_call
        let getPairTokens_call = async (pairAddress:string[], options?: TransactionOptions): Promise<{token0:string[],token1:string[]}> => {
            let result = await this.call('getPairTokens',[pairAddress],options);
            return {
                token0: result.token0,
                token1: result.token1
            };
        }
        this.getPairTokens = getPairTokens_call
        let getTypeCode_call = async (pairAddress:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getTypeCode',[pairAddress],options);
            return new BigNumber(result);
        }
        this.getTypeCode = getTypeCode_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let owner_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('owner',[],options);
            return result;
        }
        this.owner = owner_call
        let pairs_call = async (param1:string, options?: TransactionOptions): Promise<{factory:string,token0:string,token1:string}> => {
            let result = await this.call('pairs',[param1],options);
            return {
                factory: result.factory,
                token0: result.token0,
                token1: result.token1
            };
        }
        this.pairs = pairs_call
        let protocolList_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('protocolList',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.protocolList = protocolList_call
        let protocolListLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('protocolListLength',[],options);
            return new BigNumber(result);
        }
        this.protocolListLength = protocolListLength_call
        let protocols_call = async (param1:string, options?: TransactionOptions): Promise<{name:string,fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber}> => {
            let result = await this.call('protocols',[param1],options);
            return {
                name: result.name,
                fee: new BigNumber(result.fee),
                feeBase: new BigNumber(result.feeBase),
                typeCode: new BigNumber(result.typeCode)
            };
        }
        this.protocols = protocols_call
        let execute_send = async (params:string[], options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return result;
        }
        let execute_call = async (params:string[], options?: TransactionOptions): Promise<void> => {
            let result = await this.call('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return;
        }
        let execute_txData = async (params:string[], options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return result;
        }
        this.execute = Object.assign(execute_send, {
            call:execute_call
            , txData:execute_txData
        });
        let initParams = (params: IInitParams) => [this.wallet.utils.stringToBytes32(params.name),params.factory,this.wallet.utils.toString(params.fee),this.wallet.utils.toString(params.feeBase),this.wallet.utils.toString(params.typeCode)];
        let init_send = async (params: IInitParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('init',initParams(params),options);
            return result;
        }
        let init_call = async (params: IInitParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('init',initParams(params),options);
            return;
        }
        let init_txData = async (params: IInitParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('init',initParams(params),options);
            return result;
        }
        this.init = Object.assign(init_send, {
            call:init_call
            , txData:init_txData
        });
        let registerPairParams = (params: IRegisterPairParams) => [params.token0,params.token1,params.pairAddress,this.wallet.utils.toString(params.fee),this.wallet.utils.toString(params.feeBase),this.wallet.utils.toString(params.typeCode)];
        let registerPair_send = async (params: IRegisterPairParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPair',registerPairParams(params),options);
            return result;
        }
        let registerPair_call = async (params: IRegisterPairParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPair',registerPairParams(params),options);
            return;
        }
        let registerPair_txData = async (params: IRegisterPairParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPair',registerPairParams(params),options);
            return result;
        }
        this.registerPair = Object.assign(registerPair_send, {
            call:registerPair_call
            , txData:registerPair_txData
        });
        let registerPairByAddressParams = (params: IRegisterPairByAddressParams) => [params.factory,params.pairAddress];
        let registerPairByAddress_send = async (params: IRegisterPairByAddressParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairByAddress',registerPairByAddressParams(params),options);
            return result;
        }
        let registerPairByAddress_call = async (params: IRegisterPairByAddressParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairByAddress',registerPairByAddressParams(params),options);
            return;
        }
        let registerPairByAddress_txData = async (params: IRegisterPairByAddressParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairByAddress',registerPairByAddressParams(params),options);
            return result;
        }
        this.registerPairByAddress = Object.assign(registerPairByAddress_send, {
            call:registerPairByAddress_call
            , txData:registerPairByAddress_txData
        });
        let registerPairByIndexParams = (params: IRegisterPairByIndexParams) => [params.factory,this.wallet.utils.toString(params.index)];
        let registerPairByIndex_send = async (params: IRegisterPairByIndexParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairByIndex',registerPairByIndexParams(params),options);
            return result;
        }
        let registerPairByIndex_call = async (params: IRegisterPairByIndexParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairByIndex',registerPairByIndexParams(params),options);
            return;
        }
        let registerPairByIndex_txData = async (params: IRegisterPairByIndexParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairByIndex',registerPairByIndexParams(params),options);
            return result;
        }
        this.registerPairByIndex = Object.assign(registerPairByIndex_send, {
            call:registerPairByIndex_call
            , txData:registerPairByIndex_txData
        });
        let registerPairByTokensParams = (params: IRegisterPairByTokensParams) => [params.factory,params.token0,params.token1];
        let registerPairByTokens_send = async (params: IRegisterPairByTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairByTokens',registerPairByTokensParams(params),options);
            return result;
        }
        let registerPairByTokens_call = async (params: IRegisterPairByTokensParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairByTokens',registerPairByTokensParams(params),options);
            return;
        }
        let registerPairByTokens_txData = async (params: IRegisterPairByTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairByTokens',registerPairByTokensParams(params),options);
            return result;
        }
        this.registerPairByTokens = Object.assign(registerPairByTokens_send, {
            call:registerPairByTokens_call
            , txData:registerPairByTokens_txData
        });
        let registerPairByTokensV3Params = (params: IRegisterPairByTokensV3Params) => [params.factory,params.token0,params.token1,this.wallet.utils.toString(params.pairIndex)];
        let registerPairByTokensV3_send = async (params: IRegisterPairByTokensV3Params, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairByTokensV3',registerPairByTokensV3Params(params),options);
            return result;
        }
        let registerPairByTokensV3_call = async (params: IRegisterPairByTokensV3Params, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairByTokensV3',registerPairByTokensV3Params(params),options);
            return;
        }
        let registerPairByTokensV3_txData = async (params: IRegisterPairByTokensV3Params, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairByTokensV3',registerPairByTokensV3Params(params),options);
            return result;
        }
        this.registerPairByTokensV3 = Object.assign(registerPairByTokensV3_send, {
            call:registerPairByTokensV3_call
            , txData:registerPairByTokensV3_txData
        });
        let registerPairsByAddressParams = (params: IRegisterPairsByAddressParams) => [params.factory,params.pairAddress];
        let registerPairsByAddress_send = async (params: IRegisterPairsByAddressParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairsByAddress',registerPairsByAddressParams(params),options);
            return result;
        }
        let registerPairsByAddress_call = async (params: IRegisterPairsByAddressParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairsByAddress',registerPairsByAddressParams(params),options);
            return;
        }
        let registerPairsByAddress_txData = async (params: IRegisterPairsByAddressParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairsByAddress',registerPairsByAddressParams(params),options);
            return result;
        }
        this.registerPairsByAddress = Object.assign(registerPairsByAddress_send, {
            call:registerPairsByAddress_call
            , txData:registerPairsByAddress_txData
        });
        let registerPairsByAddress2Params = (params: IRegisterPairsByAddress2Params) => [params.factory,params.pairAddress];
        let registerPairsByAddress2_send = async (params: IRegisterPairsByAddress2Params, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairsByAddress2',registerPairsByAddress2Params(params),options);
            return result;
        }
        let registerPairsByAddress2_call = async (params: IRegisterPairsByAddress2Params, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairsByAddress2',registerPairsByAddress2Params(params),options);
            return;
        }
        let registerPairsByAddress2_txData = async (params: IRegisterPairsByAddress2Params, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairsByAddress2',registerPairsByAddress2Params(params),options);
            return result;
        }
        this.registerPairsByAddress2 = Object.assign(registerPairsByAddress2_send, {
            call:registerPairsByAddress2_call
            , txData:registerPairsByAddress2_txData
        });
        let registerPairsByIndexParams = (params: IRegisterPairsByIndexParams) => [params.factory,this.wallet.utils.toString(params.index)];
        let registerPairsByIndex_send = async (params: IRegisterPairsByIndexParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairsByIndex',registerPairsByIndexParams(params),options);
            return result;
        }
        let registerPairsByIndex_call = async (params: IRegisterPairsByIndexParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairsByIndex',registerPairsByIndexParams(params),options);
            return;
        }
        let registerPairsByIndex_txData = async (params: IRegisterPairsByIndexParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairsByIndex',registerPairsByIndexParams(params),options);
            return result;
        }
        this.registerPairsByIndex = Object.assign(registerPairsByIndex_send, {
            call:registerPairsByIndex_call
            , txData:registerPairsByIndex_txData
        });
        let registerPairsByTokensParams = (params: IRegisterPairsByTokensParams) => [params.factory,params.token0,params.token1];
        let registerPairsByTokens_send = async (params: IRegisterPairsByTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairsByTokens',registerPairsByTokensParams(params),options);
            return result;
        }
        let registerPairsByTokens_call = async (params: IRegisterPairsByTokensParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairsByTokens',registerPairsByTokensParams(params),options);
            return;
        }
        let registerPairsByTokens_txData = async (params: IRegisterPairsByTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairsByTokens',registerPairsByTokensParams(params),options);
            return result;
        }
        this.registerPairsByTokens = Object.assign(registerPairsByTokens_send, {
            call:registerPairsByTokens_call
            , txData:registerPairsByTokens_txData
        });
        let registerPairsByTokensV3Params = (params: IRegisterPairsByTokensV3Params) => [params.factory,params.token0,params.token1,this.wallet.utils.toString(params.pairIndex)];
        let registerPairsByTokensV3_send = async (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerPairsByTokensV3',registerPairsByTokensV3Params(params),options);
            return result;
        }
        let registerPairsByTokensV3_call = async (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerPairsByTokensV3',registerPairsByTokensV3Params(params),options);
            return;
        }
        let registerPairsByTokensV3_txData = async (params: IRegisterPairsByTokensV3Params, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerPairsByTokensV3',registerPairsByTokensV3Params(params),options);
            return result;
        }
        this.registerPairsByTokensV3 = Object.assign(registerPairsByTokensV3_send, {
            call:registerPairsByTokensV3_call
            , txData:registerPairsByTokensV3_txData
        });
        let registerProtocolParams = (params: IRegisterProtocolParams) => [this.wallet.utils.stringToBytes32(params.name),params.factory,this.wallet.utils.toString(params.fee),this.wallet.utils.toString(params.feeBase),this.wallet.utils.toString(params.typeCode)];
        let registerProtocol_send = async (params: IRegisterProtocolParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('registerProtocol',registerProtocolParams(params),options);
            return result;
        }
        let registerProtocol_call = async (params: IRegisterProtocolParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('registerProtocol',registerProtocolParams(params),options);
            return;
        }
        let registerProtocol_txData = async (params: IRegisterProtocolParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('registerProtocol',registerProtocolParams(params),options);
            return result;
        }
        this.registerProtocol = Object.assign(registerProtocol_send, {
            call:registerProtocol_call
            , txData:registerProtocol_txData
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
export module OSWAP_HybridRouterRegistry{
    export interface CustomPairRegisterEvent {pair:string,fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber,_event:Event}
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface PairRegisterEvent {factory:string,pair:string,token0:string,token1:string,_event:Event}
    export interface ProtocolRegisterEvent {factory:string,name:string,fee:BigNumber,feeBase:BigNumber,typeCode:BigNumber,_event:Event}
}