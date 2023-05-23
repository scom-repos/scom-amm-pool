import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_PausableFactory.json";
export interface ISetLiveForPairParams {pair:string;live:boolean}
export class OSWAP_PausableFactory extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(governance:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([governance], options);
    }
    parsePairRestartedEvent(receipt: TransactionReceipt): OSWAP_PausableFactory.PairRestartedEvent[]{
        return this.parseEvents(receipt, "PairRestarted").map(e=>this.decodePairRestartedEvent(e));
    }
    decodePairRestartedEvent(event: Event): OSWAP_PausableFactory.PairRestartedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parsePairShutdownedEvent(receipt: TransactionReceipt): OSWAP_PausableFactory.PairShutdownedEvent[]{
        return this.parseEvents(receipt, "PairShutdowned").map(e=>this.decodePairShutdownedEvent(e));
    }
    decodePairShutdownedEvent(event: Event): OSWAP_PausableFactory.PairShutdownedEvent{
        let result = event.data;
        return {
            pair: result.pair,
            _event: event
        };
    }
    parseRestartedEvent(receipt: TransactionReceipt): OSWAP_PausableFactory.RestartedEvent[]{
        return this.parseEvents(receipt, "Restarted").map(e=>this.decodeRestartedEvent(e));
    }
    decodeRestartedEvent(event: Event): OSWAP_PausableFactory.RestartedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    parseShutdownedEvent(receipt: TransactionReceipt): OSWAP_PausableFactory.ShutdownedEvent[]{
        return this.parseEvents(receipt, "Shutdowned").map(e=>this.decodeShutdownedEvent(e));
    }
    decodeShutdownedEvent(event: Event): OSWAP_PausableFactory.ShutdownedEvent{
        let result = event.data;
        return {
            _event: event
        };
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    isLive: {
        (options?: TransactionOptions): Promise<boolean>;
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
    private assign(){
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
    }
}
export module OSWAP_PausableFactory{
    export interface PairRestartedEvent {pair:string,_event:Event}
    export interface PairShutdownedEvent {pair:string,_event:Event}
    export interface RestartedEvent {_event:Event}
    export interface ShutdownedEvent {_event:Event}
}