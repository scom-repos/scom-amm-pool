import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OAXDEX_VotingExecutor.json";
export interface IDeployParams {governance:string;admin:string}
export class OAXDEX_VotingExecutor extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.admin], options);
    }
    admin: {
        (options?: TransactionOptions): Promise<string>;
    }
    execute: {
        (params:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params:string[], options?: TransactionOptions) => Promise<void>;
        txData: (params:string[], options?: TransactionOptions) => Promise<string>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let admin_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('admin',[],options);
            return result;
        }
        this.admin = admin_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
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
    }
}