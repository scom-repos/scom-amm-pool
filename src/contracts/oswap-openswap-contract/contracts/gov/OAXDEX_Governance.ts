import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OAXDEX_Governance.json";
export interface IDeployParams {oaxToken:string;votingToken:string;names:string[];minExeDelay:(number|BigNumber)[];minVoteDuration:(number|BigNumber)[];maxVoteDuration:(number|BigNumber)[];minOaxTokenToCreateVote:(number|BigNumber)[];minQuorum:(number|BigNumber)[];minStakePeriod:number|BigNumber}
export interface IAddVotingConfigParams {name:string;minExeDelay:number|BigNumber;minVoteDuration:number|BigNumber;maxVoteDuration:number|BigNumber;minOaxTokenToCreateVote:number|BigNumber;minQuorum:number|BigNumber}
export interface IGetVotingConfigProfilesParams {start:number|BigNumber;length:number|BigNumber}
export interface IGetVotingsParams {start:number|BigNumber;count:number|BigNumber}
export interface INewVoteParams {vote:string;isExecutiveVote:boolean}
export interface ISetVotingConfigParams {configName:string;paramName:string;paramValue:number|BigNumber}
export interface ISetVotingExecutorParams {votingExecutor:string;bool:boolean}
export interface IVotedParams {poll:boolean;account:string;option:number|BigNumber}
export class OAXDEX_Governance extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.oaxToken,params.votingToken,this.wallet.utils.stringToBytes32(params.names),this.wallet.utils.toString(params.minExeDelay),this.wallet.utils.toString(params.minVoteDuration),this.wallet.utils.toString(params.maxVoteDuration),this.wallet.utils.toString(params.minOaxTokenToCreateVote),this.wallet.utils.toString(params.minQuorum),this.wallet.utils.toString(params.minStakePeriod)], options);
    }
    parseAddVotingConfigEvent(receipt: TransactionReceipt): OAXDEX_Governance.AddVotingConfigEvent[]{
        return this.parseEvents(receipt, "AddVotingConfig").map(e=>this.decodeAddVotingConfigEvent(e));
    }
    decodeAddVotingConfigEvent(event: Event): OAXDEX_Governance.AddVotingConfigEvent{
        let result = event.data;
        return {
            name: result.name,
            minExeDelay: new BigNumber(result.minExeDelay),
            minVoteDuration: new BigNumber(result.minVoteDuration),
            maxVoteDuration: new BigNumber(result.maxVoteDuration),
            minOaxTokenToCreateVote: new BigNumber(result.minOaxTokenToCreateVote),
            minQuorum: new BigNumber(result.minQuorum),
            _event: event
        };
    }
    parseExecutedEvent(receipt: TransactionReceipt): OAXDEX_Governance.ExecutedEvent[]{
        return this.parseEvents(receipt, "Executed").map(e=>this.decodeExecutedEvent(e));
    }
    decodeExecutedEvent(event: Event): OAXDEX_Governance.ExecutedEvent{
        let result = event.data;
        return {
            vote: result.vote,
            _event: event
        };
    }
    parseNewPollEvent(receipt: TransactionReceipt): OAXDEX_Governance.NewPollEvent[]{
        return this.parseEvents(receipt, "NewPoll").map(e=>this.decodeNewPollEvent(e));
    }
    decodeNewPollEvent(event: Event): OAXDEX_Governance.NewPollEvent{
        let result = event.data;
        return {
            poll: result.poll,
            _event: event
        };
    }
    parseNewVoteEvent(receipt: TransactionReceipt): OAXDEX_Governance.NewVoteEvent[]{
        return this.parseEvents(receipt, "NewVote").map(e=>this.decodeNewVoteEvent(e));
    }
    decodeNewVoteEvent(event: Event): OAXDEX_Governance.NewVoteEvent{
        let result = event.data;
        return {
            vote: result.vote,
            _event: event
        };
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): OAXDEX_Governance.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): OAXDEX_Governance.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parseParamSetEvent(receipt: TransactionReceipt): OAXDEX_Governance.ParamSetEvent[]{
        return this.parseEvents(receipt, "ParamSet").map(e=>this.decodeParamSetEvent(e));
    }
    decodeParamSetEvent(event: Event): OAXDEX_Governance.ParamSetEvent{
        let result = event.data;
        return {
            name: result.name,
            value: result.value,
            _event: event
        };
    }
    parseParamSet2Event(receipt: TransactionReceipt): OAXDEX_Governance.ParamSet2Event[]{
        return this.parseEvents(receipt, "ParamSet2").map(e=>this.decodeParamSet2Event(e));
    }
    decodeParamSet2Event(event: Event): OAXDEX_Governance.ParamSet2Event{
        let result = event.data;
        return {
            name: result.name,
            value1: result.value1,
            value2: result.value2,
            _event: event
        };
    }
    parsePollEvent(receipt: TransactionReceipt): OAXDEX_Governance.PollEvent[]{
        return this.parseEvents(receipt, "Poll").map(e=>this.decodePollEvent(e));
    }
    decodePollEvent(event: Event): OAXDEX_Governance.PollEvent{
        let result = event.data;
        return {
            account: result.account,
            poll: result.poll,
            option: new BigNumber(result.option),
            _event: event
        };
    }
    parseSetVotingConfigEvent(receipt: TransactionReceipt): OAXDEX_Governance.SetVotingConfigEvent[]{
        return this.parseEvents(receipt, "SetVotingConfig").map(e=>this.decodeSetVotingConfigEvent(e));
    }
    decodeSetVotingConfigEvent(event: Event): OAXDEX_Governance.SetVotingConfigEvent{
        let result = event.data;
        return {
            configName: result.configName,
            paramName: result.paramName,
            minExeDelay: new BigNumber(result.minExeDelay),
            _event: event
        };
    }
    parseStakeEvent(receipt: TransactionReceipt): OAXDEX_Governance.StakeEvent[]{
        return this.parseEvents(receipt, "Stake").map(e=>this.decodeStakeEvent(e));
    }
    decodeStakeEvent(event: Event): OAXDEX_Governance.StakeEvent{
        let result = event.data;
        return {
            who: result.who,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseUnstakeEvent(receipt: TransactionReceipt): OAXDEX_Governance.UnstakeEvent[]{
        return this.parseEvents(receipt, "Unstake").map(e=>this.decodeUnstakeEvent(e));
    }
    decodeUnstakeEvent(event: Event): OAXDEX_Governance.UnstakeEvent{
        let result = event.data;
        return {
            who: result.who,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseVetoEvent(receipt: TransactionReceipt): OAXDEX_Governance.VetoEvent[]{
        return this.parseEvents(receipt, "Veto").map(e=>this.decodeVetoEvent(e));
    }
    decodeVetoEvent(event: Event): OAXDEX_Governance.VetoEvent{
        let result = event.data;
        return {
            vote: result.vote,
            _event: event
        };
    }
    parseVoteEvent(receipt: TransactionReceipt): OAXDEX_Governance.VoteEvent[]{
        return this.parseEvents(receipt, "Vote").map(e=>this.decodeVoteEvent(e));
    }
    decodeVoteEvent(event: Event): OAXDEX_Governance.VoteEvent{
        let result = event.data;
        return {
            account: result.account,
            vote: result.vote,
            option: new BigNumber(result.option),
            _event: event
        };
    }
    addVotingConfig: {
        (params: IAddVotingConfigParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddVotingConfigParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IAddVotingConfigParams, options?: TransactionOptions) => Promise<string>;
    }
    admin: {
        (options?: TransactionOptions): Promise<string>;
    }
    allVotings: {
        (options?: TransactionOptions): Promise<string[]>;
    }
    closeVote: {
        (vote:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (vote:string, options?: TransactionOptions) => Promise<void>;
        txData: (vote:string, options?: TransactionOptions) => Promise<string>;
    }
    executed: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    freezedStake: {
        (param1:string, options?: TransactionOptions): Promise<{amount:BigNumber,timestamp:BigNumber}>;
    }
    getNewVoteId: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<BigNumber>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    getVotingConfigProfiles: {
        (params: IGetVotingConfigProfilesParams, options?: TransactionOptions): Promise<string[]>;
    }
    getVotingCount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    getVotingParams: {
        (name:string, options?: TransactionOptions): Promise<{_minExeDelay:BigNumber,_minVoteDuration:BigNumber,_maxVoteDuration:BigNumber,_minOaxTokenToCreateVote:BigNumber,_minQuorum:BigNumber}>;
    }
    getVotings: {
        (params: IGetVotingsParams, options?: TransactionOptions): Promise<string[]>;
    }
    initAdmin: {
        (admin:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (admin:string, options?: TransactionOptions) => Promise<void>;
        txData: (admin:string, options?: TransactionOptions) => Promise<string>;
    }
    initVotingExecutor: {
        (votingExecutor:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (votingExecutor:string[], options?: TransactionOptions) => Promise<void>;
        txData: (votingExecutor:string[], options?: TransactionOptions) => Promise<string>;
    }
    isVotingContract: {
        (votingContract:string, options?: TransactionOptions): Promise<boolean>;
    }
    isVotingExecutor: {
        (param1:string, options?: TransactionOptions): Promise<boolean>;
    }
    minStakePeriod: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    newVote: {
        (params: INewVoteParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: INewVoteParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: INewVoteParams, options?: TransactionOptions) => Promise<string>;
    }
    oaxToken: {
        (options?: TransactionOptions): Promise<string>;
    }
    owner: {
        (options?: TransactionOptions): Promise<string>;
    }
    renounceOwnership: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    setAdmin: {
        (admin:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (admin:string, options?: TransactionOptions) => Promise<void>;
        txData: (admin:string, options?: TransactionOptions) => Promise<string>;
    }
    setMinStakePeriod: {
        (minStakePeriod:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (minStakePeriod:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (minStakePeriod:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    setVotingConfig: {
        (params: ISetVotingConfigParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetVotingConfigParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetVotingConfigParams, options?: TransactionOptions) => Promise<string>;
    }
    setVotingExecutor: {
        (params: ISetVotingExecutorParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetVotingExecutorParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetVotingExecutorParams, options?: TransactionOptions) => Promise<string>;
    }
    setVotingRegister: {
        (votingRegister:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (votingRegister:string, options?: TransactionOptions) => Promise<void>;
        txData: (votingRegister:string, options?: TransactionOptions) => Promise<string>;
    }
    stake: {
        (value:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (value:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (value:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    stakeOf: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    totalStake: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transferOwnership: {
        (newOwner:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (newOwner:string, options?: TransactionOptions) => Promise<void>;
        txData: (newOwner:string, options?: TransactionOptions) => Promise<string>;
    }
    unlockStake: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    unstake: {
        (value:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (value:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (value:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    veto: {
        (voting:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (voting:string, options?: TransactionOptions) => Promise<void>;
        txData: (voting:string, options?: TransactionOptions) => Promise<string>;
    }
    voteCount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    voted: {
        (params: IVotedParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IVotedParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IVotedParams, options?: TransactionOptions) => Promise<string>;
    }
    votingConfigProfiles: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    votingConfigProfilesLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    votingConfigs: {
        (param1:string, options?: TransactionOptions): Promise<{minExeDelay:BigNumber,minVoteDuration:BigNumber,maxVoteDuration:BigNumber,minOaxTokenToCreateVote:BigNumber,minQuorum:BigNumber}>;
    }
    votingExecutor: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    votingExecutorInv: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    votingExecutorLength: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    votingIdx: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    votingRegister: {
        (options?: TransactionOptions): Promise<string>;
    }
    votingToken: {
        (options?: TransactionOptions): Promise<string>;
    }
    votings: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let admin_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('admin',[],options);
            return result;
        }
        this.admin = admin_call
        let allVotings_call = async (options?: TransactionOptions): Promise<string[]> => {
            let result = await this.call('allVotings',[],options);
            return result;
        }
        this.allVotings = allVotings_call
        let freezedStake_call = async (param1:string, options?: TransactionOptions): Promise<{amount:BigNumber,timestamp:BigNumber}> => {
            let result = await this.call('freezedStake',[param1],options);
            return {
                amount: new BigNumber(result.amount),
                timestamp: new BigNumber(result.timestamp)
            };
        }
        this.freezedStake = freezedStake_call
        let getVotingConfigProfilesParams = (params: IGetVotingConfigProfilesParams) => [this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.length)];
        let getVotingConfigProfiles_call = async (params: IGetVotingConfigProfilesParams, options?: TransactionOptions): Promise<string[]> => {
            let result = await this.call('getVotingConfigProfiles',getVotingConfigProfilesParams(params),options);
            return result;
        }
        this.getVotingConfigProfiles = getVotingConfigProfiles_call
        let getVotingCount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getVotingCount',[],options);
            return new BigNumber(result);
        }
        this.getVotingCount = getVotingCount_call
        let getVotingParams_call = async (name:string, options?: TransactionOptions): Promise<{_minExeDelay:BigNumber,_minVoteDuration:BigNumber,_maxVoteDuration:BigNumber,_minOaxTokenToCreateVote:BigNumber,_minQuorum:BigNumber}> => {
            let result = await this.call('getVotingParams',[this.wallet.utils.stringToBytes32(name)],options);
            return {
                _minExeDelay: new BigNumber(result._minExeDelay),
                _minVoteDuration: new BigNumber(result._minVoteDuration),
                _maxVoteDuration: new BigNumber(result._maxVoteDuration),
                _minOaxTokenToCreateVote: new BigNumber(result._minOaxTokenToCreateVote),
                _minQuorum: new BigNumber(result._minQuorum)
            };
        }
        this.getVotingParams = getVotingParams_call
        let getVotingsParams = (params: IGetVotingsParams) => [this.wallet.utils.toString(params.start),this.wallet.utils.toString(params.count)];
        let getVotings_call = async (params: IGetVotingsParams, options?: TransactionOptions): Promise<string[]> => {
            let result = await this.call('getVotings',getVotingsParams(params),options);
            return result;
        }
        this.getVotings = getVotings_call
        let isVotingContract_call = async (votingContract:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isVotingContract',[votingContract],options);
            return result;
        }
        this.isVotingContract = isVotingContract_call
        let isVotingExecutor_call = async (param1:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isVotingExecutor',[param1],options);
            return result;
        }
        this.isVotingExecutor = isVotingExecutor_call
        let minStakePeriod_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('minStakePeriod',[],options);
            return new BigNumber(result);
        }
        this.minStakePeriod = minStakePeriod_call
        let oaxToken_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oaxToken',[],options);
            return result;
        }
        this.oaxToken = oaxToken_call
        let owner_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('owner',[],options);
            return result;
        }
        this.owner = owner_call
        let stakeOf_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('stakeOf',[param1],options);
            return new BigNumber(result);
        }
        this.stakeOf = stakeOf_call
        let totalStake_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalStake',[],options);
            return new BigNumber(result);
        }
        this.totalStake = totalStake_call
        let voteCount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('voteCount',[],options);
            return new BigNumber(result);
        }
        this.voteCount = voteCount_call
        let votingConfigProfiles_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('votingConfigProfiles',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.votingConfigProfiles = votingConfigProfiles_call
        let votingConfigProfilesLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('votingConfigProfilesLength',[],options);
            return new BigNumber(result);
        }
        this.votingConfigProfilesLength = votingConfigProfilesLength_call
        let votingConfigs_call = async (param1:string, options?: TransactionOptions): Promise<{minExeDelay:BigNumber,minVoteDuration:BigNumber,maxVoteDuration:BigNumber,minOaxTokenToCreateVote:BigNumber,minQuorum:BigNumber}> => {
            let result = await this.call('votingConfigs',[this.wallet.utils.stringToBytes32(param1)],options);
            return {
                minExeDelay: new BigNumber(result.minExeDelay),
                minVoteDuration: new BigNumber(result.minVoteDuration),
                maxVoteDuration: new BigNumber(result.maxVoteDuration),
                minOaxTokenToCreateVote: new BigNumber(result.minOaxTokenToCreateVote),
                minQuorum: new BigNumber(result.minQuorum)
            };
        }
        this.votingConfigs = votingConfigs_call
        let votingExecutor_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('votingExecutor',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.votingExecutor = votingExecutor_call
        let votingExecutorInv_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('votingExecutorInv',[param1],options);
            return new BigNumber(result);
        }
        this.votingExecutorInv = votingExecutorInv_call
        let votingExecutorLength_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('votingExecutorLength',[],options);
            return new BigNumber(result);
        }
        this.votingExecutorLength = votingExecutorLength_call
        let votingIdx_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('votingIdx',[param1],options);
            return new BigNumber(result);
        }
        this.votingIdx = votingIdx_call
        let votingRegister_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('votingRegister',[],options);
            return result;
        }
        this.votingRegister = votingRegister_call
        let votingToken_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('votingToken',[],options);
            return result;
        }
        this.votingToken = votingToken_call
        let votings_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('votings',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.votings = votings_call
        let addVotingConfigParams = (params: IAddVotingConfigParams) => [this.wallet.utils.stringToBytes32(params.name),this.wallet.utils.toString(params.minExeDelay),this.wallet.utils.toString(params.minVoteDuration),this.wallet.utils.toString(params.maxVoteDuration),this.wallet.utils.toString(params.minOaxTokenToCreateVote),this.wallet.utils.toString(params.minQuorum)];
        let addVotingConfig_send = async (params: IAddVotingConfigParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addVotingConfig',addVotingConfigParams(params),options);
            return result;
        }
        let addVotingConfig_call = async (params: IAddVotingConfigParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('addVotingConfig',addVotingConfigParams(params),options);
            return;
        }
        let addVotingConfig_txData = async (params: IAddVotingConfigParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('addVotingConfig',addVotingConfigParams(params),options);
            return result;
        }
        this.addVotingConfig = Object.assign(addVotingConfig_send, {
            call:addVotingConfig_call
            , txData:addVotingConfig_txData
        });
        let closeVote_send = async (vote:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('closeVote',[vote],options);
            return result;
        }
        let closeVote_call = async (vote:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('closeVote',[vote],options);
            return;
        }
        let closeVote_txData = async (vote:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('closeVote',[vote],options);
            return result;
        }
        this.closeVote = Object.assign(closeVote_send, {
            call:closeVote_call
            , txData:closeVote_txData
        });
        let executed_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('executed',[],options);
            return result;
        }
        let executed_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('executed',[],options);
            return;
        }
        let executed_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('executed',[],options);
            return result;
        }
        this.executed = Object.assign(executed_send, {
            call:executed_call
            , txData:executed_txData
        });
        let getNewVoteId_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('getNewVoteId',[],options);
            return result;
        }
        let getNewVoteId_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getNewVoteId',[],options);
            return new BigNumber(result);
        }
        let getNewVoteId_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('getNewVoteId',[],options);
            return result;
        }
        this.getNewVoteId = Object.assign(getNewVoteId_send, {
            call:getNewVoteId_call
            , txData:getNewVoteId_txData
        });
        let initAdmin_send = async (admin:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('initAdmin',[admin],options);
            return result;
        }
        let initAdmin_call = async (admin:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('initAdmin',[admin],options);
            return;
        }
        let initAdmin_txData = async (admin:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('initAdmin',[admin],options);
            return result;
        }
        this.initAdmin = Object.assign(initAdmin_send, {
            call:initAdmin_call
            , txData:initAdmin_txData
        });
        let initVotingExecutor_send = async (votingExecutor:string[], options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('initVotingExecutor',[votingExecutor],options);
            return result;
        }
        let initVotingExecutor_call = async (votingExecutor:string[], options?: TransactionOptions): Promise<void> => {
            let result = await this.call('initVotingExecutor',[votingExecutor],options);
            return;
        }
        let initVotingExecutor_txData = async (votingExecutor:string[], options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('initVotingExecutor',[votingExecutor],options);
            return result;
        }
        this.initVotingExecutor = Object.assign(initVotingExecutor_send, {
            call:initVotingExecutor_call
            , txData:initVotingExecutor_txData
        });
        let newVoteParams = (params: INewVoteParams) => [params.vote,params.isExecutiveVote];
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
        let setAdmin_send = async (admin:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setAdmin',[admin],options);
            return result;
        }
        let setAdmin_call = async (admin:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setAdmin',[admin],options);
            return;
        }
        let setAdmin_txData = async (admin:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setAdmin',[admin],options);
            return result;
        }
        this.setAdmin = Object.assign(setAdmin_send, {
            call:setAdmin_call
            , txData:setAdmin_txData
        });
        let setMinStakePeriod_send = async (minStakePeriod:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setMinStakePeriod',[this.wallet.utils.toString(minStakePeriod)],options);
            return result;
        }
        let setMinStakePeriod_call = async (minStakePeriod:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setMinStakePeriod',[this.wallet.utils.toString(minStakePeriod)],options);
            return;
        }
        let setMinStakePeriod_txData = async (minStakePeriod:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setMinStakePeriod',[this.wallet.utils.toString(minStakePeriod)],options);
            return result;
        }
        this.setMinStakePeriod = Object.assign(setMinStakePeriod_send, {
            call:setMinStakePeriod_call
            , txData:setMinStakePeriod_txData
        });
        let setVotingConfigParams = (params: ISetVotingConfigParams) => [this.wallet.utils.stringToBytes32(params.configName),this.wallet.utils.stringToBytes32(params.paramName),this.wallet.utils.toString(params.paramValue)];
        let setVotingConfig_send = async (params: ISetVotingConfigParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setVotingConfig',setVotingConfigParams(params),options);
            return result;
        }
        let setVotingConfig_call = async (params: ISetVotingConfigParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setVotingConfig',setVotingConfigParams(params),options);
            return;
        }
        let setVotingConfig_txData = async (params: ISetVotingConfigParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setVotingConfig',setVotingConfigParams(params),options);
            return result;
        }
        this.setVotingConfig = Object.assign(setVotingConfig_send, {
            call:setVotingConfig_call
            , txData:setVotingConfig_txData
        });
        let setVotingExecutorParams = (params: ISetVotingExecutorParams) => [params.votingExecutor,params.bool];
        let setVotingExecutor_send = async (params: ISetVotingExecutorParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setVotingExecutor',setVotingExecutorParams(params),options);
            return result;
        }
        let setVotingExecutor_call = async (params: ISetVotingExecutorParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setVotingExecutor',setVotingExecutorParams(params),options);
            return;
        }
        let setVotingExecutor_txData = async (params: ISetVotingExecutorParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setVotingExecutor',setVotingExecutorParams(params),options);
            return result;
        }
        this.setVotingExecutor = Object.assign(setVotingExecutor_send, {
            call:setVotingExecutor_call
            , txData:setVotingExecutor_txData
        });
        let setVotingRegister_send = async (votingRegister:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setVotingRegister',[votingRegister],options);
            return result;
        }
        let setVotingRegister_call = async (votingRegister:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setVotingRegister',[votingRegister],options);
            return;
        }
        let setVotingRegister_txData = async (votingRegister:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setVotingRegister',[votingRegister],options);
            return result;
        }
        this.setVotingRegister = Object.assign(setVotingRegister_send, {
            call:setVotingRegister_call
            , txData:setVotingRegister_txData
        });
        let stake_send = async (value:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('stake',[this.wallet.utils.toString(value)],options);
            return result;
        }
        let stake_call = async (value:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('stake',[this.wallet.utils.toString(value)],options);
            return;
        }
        let stake_txData = async (value:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('stake',[this.wallet.utils.toString(value)],options);
            return result;
        }
        this.stake = Object.assign(stake_send, {
            call:stake_call
            , txData:stake_txData
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
        let unlockStake_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('unlockStake',[],options);
            return result;
        }
        let unlockStake_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('unlockStake',[],options);
            return;
        }
        let unlockStake_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('unlockStake',[],options);
            return result;
        }
        this.unlockStake = Object.assign(unlockStake_send, {
            call:unlockStake_call
            , txData:unlockStake_txData
        });
        let unstake_send = async (value:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('unstake',[this.wallet.utils.toString(value)],options);
            return result;
        }
        let unstake_call = async (value:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('unstake',[this.wallet.utils.toString(value)],options);
            return;
        }
        let unstake_txData = async (value:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('unstake',[this.wallet.utils.toString(value)],options);
            return result;
        }
        this.unstake = Object.assign(unstake_send, {
            call:unstake_call
            , txData:unstake_txData
        });
        let veto_send = async (voting:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('veto',[voting],options);
            return result;
        }
        let veto_call = async (voting:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('veto',[voting],options);
            return;
        }
        let veto_txData = async (voting:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('veto',[voting],options);
            return result;
        }
        this.veto = Object.assign(veto_send, {
            call:veto_call
            , txData:veto_txData
        });
        let votedParams = (params: IVotedParams) => [params.poll,params.account,this.wallet.utils.toString(params.option)];
        let voted_send = async (params: IVotedParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('voted',votedParams(params),options);
            return result;
        }
        let voted_call = async (params: IVotedParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('voted',votedParams(params),options);
            return;
        }
        let voted_txData = async (params: IVotedParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('voted',votedParams(params),options);
            return result;
        }
        this.voted = Object.assign(voted_send, {
            call:voted_call
            , txData:voted_txData
        });
    }
}
export module OAXDEX_Governance{
    export interface AddVotingConfigEvent {name:string,minExeDelay:BigNumber,minVoteDuration:BigNumber,maxVoteDuration:BigNumber,minOaxTokenToCreateVote:BigNumber,minQuorum:BigNumber,_event:Event}
    export interface ExecutedEvent {vote:string,_event:Event}
    export interface NewPollEvent {poll:string,_event:Event}
    export interface NewVoteEvent {vote:string,_event:Event}
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface ParamSetEvent {name:string,value:string,_event:Event}
    export interface ParamSet2Event {name:string,value1:string,value2:string,_event:Event}
    export interface PollEvent {account:string,poll:string,option:BigNumber,_event:Event}
    export interface SetVotingConfigEvent {configName:string,paramName:string,minExeDelay:BigNumber,_event:Event}
    export interface StakeEvent {who:string,value:BigNumber,_event:Event}
    export interface UnstakeEvent {who:string,value:BigNumber,_event:Event}
    export interface VetoEvent {vote:string,_event:Event}
    export interface VoteEvent {account:string,vote:string,option:BigNumber,_event:Event}
}