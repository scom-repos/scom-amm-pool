import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OAXDEX_VotingRegistry.json";
export interface INewVoteParams {executor:string;name:string;options:string[];quorum:number|BigNumber;threshold:number|BigNumber;voteEndTime:number|BigNumber;executeDelay:number|BigNumber;executeParam:string[]}
export class OAXDEX_VotingRegistry extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(governance:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([governance], options);
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    newVote: {
        (params: INewVoteParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: INewVoteParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: INewVoteParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let newVoteParams = (params: INewVoteParams) => [params.executor,this.wallet.utils.stringToBytes32(params.name),this.wallet.utils.stringToBytes32(params.options),this.wallet.utils.toString(params.quorum),this.wallet.utils.toString(params.threshold),this.wallet.utils.toString(params.voteEndTime),this.wallet.utils.toString(params.executeDelay),this.wallet.utils.stringToBytes32(params.executeParam)];
        let newVote_send = async (params: INewVoteParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('newVote',newVoteParams(params),options);
            return result;
        }
        let newVote_call = async (params: INewVoteParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('newVote',newVoteParams(params),options);
            return;
        }
        let newVote_txData = async (params: INewVoteParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('newVote',newVoteParams(params),options);
            return result;
        }
        this.newVote = Object.assign(newVote_send, {
            call:newVote_call
            , txData:newVote_txData
        });
    }
}