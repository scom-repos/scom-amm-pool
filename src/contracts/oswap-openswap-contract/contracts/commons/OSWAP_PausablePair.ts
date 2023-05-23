import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_PausablePair.json";
export class OSWAP_PausablePair extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    factory: {
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
    private assign(){
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
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
    }
}