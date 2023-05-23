import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_ConfigStore.json";
export interface ISetCustomParamParams {paramName:string;paramValue:string}
export interface ISetMultiCustomParamParams {paramName:string[];paramValue:string[]}
export class OSWAP_ConfigStore extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(governance:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([governance], options);
    }
    parseParamSetEvent(receipt: TransactionReceipt): OSWAP_ConfigStore.ParamSetEvent[]{
        return this.parseEvents(receipt, "ParamSet").map(e=>this.decodeParamSetEvent(e));
    }
    decodeParamSetEvent(event: Event): OSWAP_ConfigStore.ParamSetEvent{
        let result = event.data;
        return {
            name: result.name,
            value: result.value,
            _event: event
        };
    }
    customParam: {
        (param1:string, options?: TransactionOptions): Promise<string>;
    }
    customParamNames: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    customParamNamesIdx: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    customParamNamesLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    setCustomParam: {
        (params: ISetCustomParamParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetCustomParamParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetCustomParamParams, options?: TransactionOptions) => Promise<string>;
    }
    setMultiCustomParam: {
        (params: ISetMultiCustomParamParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetMultiCustomParamParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetMultiCustomParamParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let customParam_call = async (param1:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('customParam',[this.wallet.utils.stringToBytes32(param1)],options);
            return result;
        }
        this.customParam = customParam_call
        let customParamNames_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('customParamNames',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.customParamNames = customParamNames_call
        let customParamNamesIdx_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('customParamNamesIdx',[this.wallet.utils.stringToBytes32(param1)],options);
            return new BigNumber(result);
        }
        this.customParamNamesIdx = customParamNamesIdx_call
        let customParamNamesLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('customParamNamesLength',[],options);
            return new BigNumber(result);
        }
        this.customParamNamesLength = customParamNamesLength_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let setCustomParamParams = (params: ISetCustomParamParams) => [this.wallet.utils.stringToBytes32(params.paramName),this.wallet.utils.stringToBytes32(params.paramValue)];
        let setCustomParam_send = async (params: ISetCustomParamParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setCustomParam',setCustomParamParams(params),options);
            return result;
        }
        let setCustomParam_call = async (params: ISetCustomParamParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setCustomParam',setCustomParamParams(params),options);
            return;
        }
        let setCustomParam_txData = async (params: ISetCustomParamParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setCustomParam',setCustomParamParams(params),options);
            return result;
        }
        this.setCustomParam = Object.assign(setCustomParam_send, {
            call:setCustomParam_call
            , txData:setCustomParam_txData
        });
        let setMultiCustomParamParams = (params: ISetMultiCustomParamParams) => [this.wallet.utils.stringToBytes32(params.paramName),this.wallet.utils.stringToBytes32(params.paramValue)];
        let setMultiCustomParam_send = async (params: ISetMultiCustomParamParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setMultiCustomParam',setMultiCustomParamParams(params),options);
            return result;
        }
        let setMultiCustomParam_call = async (params: ISetMultiCustomParamParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setMultiCustomParam',setMultiCustomParamParams(params),options);
            return;
        }
        let setMultiCustomParam_txData = async (params: ISetMultiCustomParamParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setMultiCustomParam',setMultiCustomParamParams(params),options);
            return result;
        }
        this.setMultiCustomParam = Object.assign(setMultiCustomParam_send, {
            call:setMultiCustomParam_call
            , txData:setMultiCustomParam_txData
        });
    }
}
export module OSWAP_ConfigStore{
    export interface ParamSetEvent {name:string,value:string,_event:Event}
}