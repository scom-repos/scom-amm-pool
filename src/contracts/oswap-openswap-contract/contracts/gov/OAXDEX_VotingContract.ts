import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OAXDEX_VotingContract.json";
export interface IDeployParams {governance:string;executor:string;id:number|BigNumber;name:string;options:string[];quorum:number|BigNumber;threshold:number|BigNumber;voteEndTime:number|BigNumber;executeDelay:number|BigNumber;executeParam:string[]}
export class OAXDEX_VotingContract extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.executor,this.wallet.utils.toString(params.id),this.wallet.utils.stringToBytes32(params.name),this.wallet.utils.stringToBytes32(params.options),this.wallet.utils.toString(params.quorum),this.wallet.utils.toString(params.threshold),this.wallet.utils.toString(params.voteEndTime),this.wallet.utils.toString(params.executeDelay),this.wallet.utils.stringToBytes32(params.executeParam)], options);
    }
    _executeParam: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    _options: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    _optionsWeight: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber>;
    }
    accountVoteOption: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    accountVoteWeight: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    execute: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    executeDelay: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    executeParam: {
        (options?: TransactionOptions): Promise<string[]>;
    }
    executed: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    executor: {
        (options?: TransactionOptions): Promise<string>;
    }
    getParams: {
        (options?: TransactionOptions): Promise<{executor_:string,id_:BigNumber,name_:string,options_:string[],voteStartTime_:BigNumber,voteEndTime_:BigNumber,executeDelay_:BigNumber,status_:boolean[],optionsWeight_:BigNumber[],quorum_:BigNumber[],executeParam_:string[]}>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    id: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    name: {
        (options?: TransactionOptions): Promise<string>;
    }
    options: {
        (options?: TransactionOptions): Promise<string[]>;
    }
    optionsCount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    optionsWeight: {
        (options?: TransactionOptions): Promise<BigNumber[]>;
    }
    quorum: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    threshold: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    totalVoteWeight: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    totalWeight: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    updateWeight: {
        (account:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (account:string, options?: TransactionOptions) => Promise<void>;
        txData: (account:string, options?: TransactionOptions) => Promise<string>;
    }
    veto: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    vetoed: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    vote: {
        (option:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (option:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (option:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    voteEndTime: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    voteStartTime: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    private assign(){
        let _executeParam_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('_executeParam',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this._executeParam = _executeParam_call
        let _options_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('_options',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this._options = _options_call
        let _optionsWeight_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('_optionsWeight',[this.wallet.utils.toString(param1)],options);
            return new BigNumber(result);
        }
        this._optionsWeight = _optionsWeight_call
        let accountVoteOption_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('accountVoteOption',[param1],options);
            return new BigNumber(result);
        }
        this.accountVoteOption = accountVoteOption_call
        let accountVoteWeight_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('accountVoteWeight',[param1],options);
            return new BigNumber(result);
        }
        this.accountVoteWeight = accountVoteWeight_call
        let executeDelay_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('executeDelay',[],options);
            return new BigNumber(result);
        }
        this.executeDelay = executeDelay_call
        let executeParam_call = async (options?: TransactionOptions): Promise<string[]> => {
            let result = await this.call('executeParam',[],options);
            return result;
        }
        this.executeParam = executeParam_call
        let executed_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('executed',[],options);
            return result;
        }
        this.executed = executed_call
        let executor_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('executor',[],options);
            return result;
        }
        this.executor = executor_call
        let getParams_call = async (options?: TransactionOptions): Promise<{executor_:string,id_:BigNumber,name_:string,options_:string[],voteStartTime_:BigNumber,voteEndTime_:BigNumber,executeDelay_:BigNumber,status_:boolean[],optionsWeight_:BigNumber[],quorum_:BigNumber[],executeParam_:string[]}> => {
            let result = await this.call('getParams',[],options);
            return {
                executor_: result.executor_,
                id_: new BigNumber(result.id_),
                name_: result.name_,
                options_: result.options_,
                voteStartTime_: new BigNumber(result.voteStartTime_),
                voteEndTime_: new BigNumber(result.voteEndTime_),
                executeDelay_: new BigNumber(result.executeDelay_),
                status_: result.status_,
                optionsWeight_: result.optionsWeight_.map(e=>new BigNumber(e)),
                quorum_: result.quorum_.map(e=>new BigNumber(e)),
                executeParam_: result.executeParam_
            };
        }
        this.getParams = getParams_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let id_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('id',[],options);
            return new BigNumber(result);
        }
        this.id = id_call
        let name_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('name',[],options);
            return result;
        }
        this.name = name_call
        let options_call = async (options?: TransactionOptions): Promise<string[]> => {
            let result = await this.call('options',[],options);
            return result;
        }
        this.options = options_call
        let optionsCount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('optionsCount',[],options);
            return new BigNumber(result);
        }
        this.optionsCount = optionsCount_call
        let optionsWeight_call = async (options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('optionsWeight',[],options);
            return result.map(e=>new BigNumber(e));
        }
        this.optionsWeight = optionsWeight_call
        let quorum_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('quorum',[],options);
            return new BigNumber(result);
        }
        this.quorum = quorum_call
        let threshold_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('threshold',[],options);
            return new BigNumber(result);
        }
        this.threshold = threshold_call
        let totalVoteWeight_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalVoteWeight',[],options);
            return new BigNumber(result);
        }
        this.totalVoteWeight = totalVoteWeight_call
        let totalWeight_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalWeight',[],options);
            return new BigNumber(result);
        }
        this.totalWeight = totalWeight_call
        let vetoed_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('vetoed',[],options);
            return result;
        }
        this.vetoed = vetoed_call
        let voteEndTime_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('voteEndTime',[],options);
            return new BigNumber(result);
        }
        this.voteEndTime = voteEndTime_call
        let voteStartTime_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('voteStartTime',[],options);
            return new BigNumber(result);
        }
        this.voteStartTime = voteStartTime_call
        let execute_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('execute',[],options);
            return result;
        }
        let execute_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('execute',[],options);
            return;
        }
        let execute_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('execute',[],options);
            return result;
        }
        this.execute = Object.assign(execute_send, {
            call:execute_call
            , txData:execute_txData
        });
        let updateWeight_send = async (account:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateWeight',[account],options);
            return result;
        }
        let updateWeight_call = async (account:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateWeight',[account],options);
            return;
        }
        let updateWeight_txData = async (account:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateWeight',[account],options);
            return result;
        }
        this.updateWeight = Object.assign(updateWeight_send, {
            call:updateWeight_call
            , txData:updateWeight_txData
        });
        let veto_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('veto',[],options);
            return result;
        }
        let veto_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('veto',[],options);
            return;
        }
        let veto_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('veto',[],options);
            return result;
        }
        this.veto = Object.assign(veto_send, {
            call:veto_call
            , txData:veto_txData
        });
        let vote_send = async (option:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('vote',[this.wallet.utils.toString(option)],options);
            return result;
        }
        let vote_call = async (option:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('vote',[this.wallet.utils.toString(option)],options);
            return;
        }
        let vote_txData = async (option:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('vote',[this.wallet.utils.toString(option)],options);
            return result;
        }
        this.vote = Object.assign(vote_send, {
            call:vote_call
            , txData:vote_txData
        });
    }
}