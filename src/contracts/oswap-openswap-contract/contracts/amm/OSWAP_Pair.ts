import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_Pair.json";
export interface IAllowanceParams {param1:string;param2:string}
export interface IApproveParams {spender:string;value:number|BigNumber}
export interface IGetAmountInParams {tokenOut:string;amountOut:number|BigNumber}
export interface IGetAmountOutParams {tokenIn:string;amountIn:number|BigNumber}
export interface IInitializeParams {token0:string;token1:string}
export interface IPermitParams {owner:string;spender:string;value:number|BigNumber;deadline:number|BigNumber;v:number|BigNumber;r:string;s:string}
export interface ISwapParams {amount0Out:number|BigNumber;amount1Out:number|BigNumber;to:string;data:string}
export interface ITransferParams {to:string;value:number|BigNumber}
export interface ITransferFromParams {from:string;to:string;value:number|BigNumber}
export class OSWAP_Pair extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(options?: TransactionOptions): Promise<string>{
        return this.__deploy([], options);
    }
    parseApprovalEvent(receipt: TransactionReceipt): OSWAP_Pair.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): OSWAP_Pair.ApprovalEvent{
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseBurnEvent(receipt: TransactionReceipt): OSWAP_Pair.BurnEvent[]{
        return this.parseEvents(receipt, "Burn").map(e=>this.decodeBurnEvent(e));
    }
    decodeBurnEvent(event: Event): OSWAP_Pair.BurnEvent{
        let result = event.data;
        return {
            sender: result.sender,
            amount0: new BigNumber(result.amount0),
            amount1: new BigNumber(result.amount1),
            to: result.to,
            _event: event
        };
    }
    parseMintEvent(receipt: TransactionReceipt): OSWAP_Pair.MintEvent[]{
        return this.parseEvents(receipt, "Mint").map(e=>this.decodeMintEvent(e));
    }
    decodeMintEvent(event: Event): OSWAP_Pair.MintEvent{
        let result = event.data;
        return {
            sender: result.sender,
            amount0: new BigNumber(result.amount0),
            amount1: new BigNumber(result.amount1),
            _event: event
        };
    }
    parseProtocolFeeSetEvent(receipt: TransactionReceipt): OSWAP_Pair.ProtocolFeeSetEvent[]{
        return this.parseEvents(receipt, "ProtocolFeeSet").map(e=>this.decodeProtocolFeeSetEvent(e));
    }
    decodeProtocolFeeSetEvent(event: Event): OSWAP_Pair.ProtocolFeeSetEvent{
        let result = event.data;
        return {
            protocolFee: new BigNumber(result.protocolFee),
            _event: event
        };
    }
    parseSwapEvent(receipt: TransactionReceipt): OSWAP_Pair.SwapEvent[]{
        return this.parseEvents(receipt, "Swap").map(e=>this.decodeSwapEvent(e));
    }
    decodeSwapEvent(event: Event): OSWAP_Pair.SwapEvent{
        let result = event.data;
        return {
            sender: result.sender,
            amount0In: new BigNumber(result.amount0In),
            amount1In: new BigNumber(result.amount1In),
            amount0Out: new BigNumber(result.amount0Out),
            amount1Out: new BigNumber(result.amount1Out),
            to: result.to,
            _event: event
        };
    }
    parseSyncEvent(receipt: TransactionReceipt): OSWAP_Pair.SyncEvent[]{
        return this.parseEvents(receipt, "Sync").map(e=>this.decodeSyncEvent(e));
    }
    decodeSyncEvent(event: Event): OSWAP_Pair.SyncEvent{
        let result = event.data;
        return {
            reserve0: new BigNumber(result.reserve0),
            reserve1: new BigNumber(result.reserve1),
            _event: event
        };
    }
    parseTradeFeeSetEvent(receipt: TransactionReceipt): OSWAP_Pair.TradeFeeSetEvent[]{
        return this.parseEvents(receipt, "TradeFeeSet").map(e=>this.decodeTradeFeeSetEvent(e));
    }
    decodeTradeFeeSetEvent(event: Event): OSWAP_Pair.TradeFeeSetEvent{
        let result = event.data;
        return {
            tradeFee: new BigNumber(result.tradeFee),
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): OSWAP_Pair.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): OSWAP_Pair.TransferEvent{
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    EIP712_TYPEHASH: {
        (options?: TransactionOptions): Promise<string>;
    }
    MINIMUM_LIQUIDITY: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    NAME_HASH: {
        (options?: TransactionOptions): Promise<string>;
    }
    PERMIT_TYPEHASH: {
        (options?: TransactionOptions): Promise<string>;
    }
    VERSION_HASH: {
        (options?: TransactionOptions): Promise<string>;
    }
    allowance: {
        (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    approve: {
        (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IApproveParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: IApproveParams, options?: TransactionOptions) => Promise<string>;
    }
    balanceOf: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    burn: {
        (to:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (to:string, options?: TransactionOptions) => Promise<{amount0:BigNumber,amount1:BigNumber}>;
        txData: (to:string, options?: TransactionOptions) => Promise<string>;
    }
    decimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    factory: {
        (options?: TransactionOptions): Promise<string>;
    }
    getAmountIn: {
        (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountOut: {
        (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getReserves: {
        (options?: TransactionOptions): Promise<{_reserve0:BigNumber,_reserve1:BigNumber,_blockTimestampLast:BigNumber}>;
    }
    initialize: {
        (params: IInitializeParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IInitializeParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IInitializeParams, options?: TransactionOptions) => Promise<string>;
    }
    isLive: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    kLast: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    mint: {
        (to:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (to:string, options?: TransactionOptions) => Promise<BigNumber>;
        txData: (to:string, options?: TransactionOptions) => Promise<string>;
    }
    name: {
        (options?: TransactionOptions): Promise<string>;
    }
    nonces: {
        (param1:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    permit: {
        (params: IPermitParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IPermitParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IPermitParams, options?: TransactionOptions) => Promise<string>;
    }
    price0CumulativeLast: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    price1CumulativeLast: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    protocolFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    setLive: {
        (isLive:boolean, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (isLive:boolean, options?: TransactionOptions) => Promise<void>;
        txData: (isLive:boolean, options?: TransactionOptions) => Promise<string>;
    }
    skim: {
        (to:string, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (to:string, options?: TransactionOptions) => Promise<void>;
        txData: (to:string, options?: TransactionOptions) => Promise<string>;
    }
    swap: {
        (params: ISwapParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISwapParams, options?: TransactionOptions) => Promise<string>;
    }
    symbol: {
        (options?: TransactionOptions): Promise<string>;
    }
    sync: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    token0: {
        (options?: TransactionOptions): Promise<string>;
    }
    token1: {
        (options?: TransactionOptions): Promise<string>;
    }
    totalSupply: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    tradeFee: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transfer: {
        (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: ITransferParams, options?: TransactionOptions) => Promise<string>;
    }
    transferFrom: {
        (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferFromParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: ITransferFromParams, options?: TransactionOptions) => Promise<string>;
    }
    updateFee: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    updateProtocolFee: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let EIP712_TYPEHASH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('EIP712_TYPEHASH',[],options);
            return result;
        }
        this.EIP712_TYPEHASH = EIP712_TYPEHASH_call
        let MINIMUM_LIQUIDITY_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('MINIMUM_LIQUIDITY',[],options);
            return new BigNumber(result);
        }
        this.MINIMUM_LIQUIDITY = MINIMUM_LIQUIDITY_call
        let NAME_HASH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('NAME_HASH',[],options);
            return result;
        }
        this.NAME_HASH = NAME_HASH_call
        let PERMIT_TYPEHASH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('PERMIT_TYPEHASH',[],options);
            return result;
        }
        this.PERMIT_TYPEHASH = PERMIT_TYPEHASH_call
        let VERSION_HASH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('VERSION_HASH',[],options);
            return result;
        }
        this.VERSION_HASH = VERSION_HASH_call
        let allowanceParams = (params: IAllowanceParams) => [params.param1,params.param2];
        let allowance_call = async (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('allowance',allowanceParams(params),options);
            return new BigNumber(result);
        }
        this.allowance = allowance_call
        let balanceOf_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('balanceOf',[param1],options);
            return new BigNumber(result);
        }
        this.balanceOf = balanceOf_call
        let decimals_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('decimals',[],options);
            return new BigNumber(result);
        }
        this.decimals = decimals_call
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
        let getAmountInParams = (params: IGetAmountInParams) => [params.tokenOut,this.wallet.utils.toString(params.amountOut)];
        let getAmountIn_call = async (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountIn',getAmountInParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountIn = getAmountIn_call
        let getAmountOutParams = (params: IGetAmountOutParams) => [params.tokenIn,this.wallet.utils.toString(params.amountIn)];
        let getAmountOut_call = async (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountOut',getAmountOutParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountOut = getAmountOut_call
        let getReserves_call = async (options?: TransactionOptions): Promise<{_reserve0:BigNumber,_reserve1:BigNumber,_blockTimestampLast:BigNumber}> => {
            let result = await this.call('getReserves',[],options);
            return {
                _reserve0: new BigNumber(result._reserve0),
                _reserve1: new BigNumber(result._reserve1),
                _blockTimestampLast: new BigNumber(result._blockTimestampLast)
            };
        }
        this.getReserves = getReserves_call
        let isLive_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isLive',[],options);
            return result;
        }
        this.isLive = isLive_call
        let kLast_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('kLast',[],options);
            return new BigNumber(result);
        }
        this.kLast = kLast_call
        let name_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('name',[],options);
            return result;
        }
        this.name = name_call
        let nonces_call = async (param1:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('nonces',[param1],options);
            return new BigNumber(result);
        }
        this.nonces = nonces_call
        let price0CumulativeLast_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('price0CumulativeLast',[],options);
            return new BigNumber(result);
        }
        this.price0CumulativeLast = price0CumulativeLast_call
        let price1CumulativeLast_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('price1CumulativeLast',[],options);
            return new BigNumber(result);
        }
        this.price1CumulativeLast = price1CumulativeLast_call
        let protocolFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('protocolFee',[],options);
            return new BigNumber(result);
        }
        this.protocolFee = protocolFee_call
        let symbol_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('symbol',[],options);
            return result;
        }
        this.symbol = symbol_call
        let token0_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token0',[],options);
            return result;
        }
        this.token0 = token0_call
        let token1_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('token1',[],options);
            return result;
        }
        this.token1 = token1_call
        let totalSupply_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalSupply',[],options);
            return new BigNumber(result);
        }
        this.totalSupply = totalSupply_call
        let tradeFee_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('tradeFee',[],options);
            return new BigNumber(result);
        }
        this.tradeFee = tradeFee_call
        let approveParams = (params: IApproveParams) => [params.spender,this.wallet.utils.toString(params.value)];
        let approve_send = async (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('approve',approveParams(params),options);
            return result;
        }
        let approve_call = async (params: IApproveParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('approve',approveParams(params),options);
            return result;
        }
        let approve_txData = async (params: IApproveParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('approve',approveParams(params),options);
            return result;
        }
        this.approve = Object.assign(approve_send, {
            call:approve_call
            , txData:approve_txData
        });
        let burn_send = async (to:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('burn',[to],options);
            return result;
        }
        let burn_call = async (to:string, options?: TransactionOptions): Promise<{amount0:BigNumber,amount1:BigNumber}> => {
            let result = await this.call('burn',[to],options);
            return {
                amount0: new BigNumber(result.amount0),
                amount1: new BigNumber(result.amount1)
            };
        }
        let burn_txData = async (to:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('burn',[to],options);
            return result;
        }
        this.burn = Object.assign(burn_send, {
            call:burn_call
            , txData:burn_txData
        });
        let initializeParams = (params: IInitializeParams) => [params.token0,params.token1];
        let initialize_send = async (params: IInitializeParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('initialize',initializeParams(params),options);
            return result;
        }
        let initialize_call = async (params: IInitializeParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('initialize',initializeParams(params),options);
            return;
        }
        let initialize_txData = async (params: IInitializeParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('initialize',initializeParams(params),options);
            return result;
        }
        this.initialize = Object.assign(initialize_send, {
            call:initialize_call
            , txData:initialize_txData
        });
        let mint_send = async (to:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('mint',[to],options);
            return result;
        }
        let mint_call = async (to:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('mint',[to],options);
            return new BigNumber(result);
        }
        let mint_txData = async (to:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('mint',[to],options);
            return result;
        }
        this.mint = Object.assign(mint_send, {
            call:mint_call
            , txData:mint_txData
        });
        let permitParams = (params: IPermitParams) => [params.owner,params.spender,this.wallet.utils.toString(params.value),this.wallet.utils.toString(params.deadline),this.wallet.utils.toString(params.v),this.wallet.utils.stringToBytes32(params.r),this.wallet.utils.stringToBytes32(params.s)];
        let permit_send = async (params: IPermitParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('permit',permitParams(params),options);
            return result;
        }
        let permit_call = async (params: IPermitParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('permit',permitParams(params),options);
            return;
        }
        let permit_txData = async (params: IPermitParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('permit',permitParams(params),options);
            return result;
        }
        this.permit = Object.assign(permit_send, {
            call:permit_call
            , txData:permit_txData
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
        let skim_send = async (to:string, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('skim',[to],options);
            return result;
        }
        let skim_call = async (to:string, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('skim',[to],options);
            return;
        }
        let skim_txData = async (to:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('skim',[to],options);
            return result;
        }
        this.skim = Object.assign(skim_send, {
            call:skim_call
            , txData:skim_txData
        });
        let swapParams = (params: ISwapParams) => [this.wallet.utils.toString(params.amount0Out),this.wallet.utils.toString(params.amount1Out),params.to,this.wallet.utils.stringToBytes(params.data)];
        let swap_send = async (params: ISwapParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swap',swapParams(params),options);
            return result;
        }
        let swap_call = async (params: ISwapParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('swap',swapParams(params),options);
            return;
        }
        let swap_txData = async (params: ISwapParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swap',swapParams(params),options);
            return result;
        }
        this.swap = Object.assign(swap_send, {
            call:swap_call
            , txData:swap_txData
        });
        let sync_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('sync',[],options);
            return result;
        }
        let sync_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('sync',[],options);
            return;
        }
        let sync_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('sync',[],options);
            return result;
        }
        this.sync = Object.assign(sync_send, {
            call:sync_call
            , txData:sync_txData
        });
        let transferParams = (params: ITransferParams) => [params.to,this.wallet.utils.toString(params.value)];
        let transfer_send = async (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transfer',transferParams(params),options);
            return result;
        }
        let transfer_call = async (params: ITransferParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transfer',transferParams(params),options);
            return result;
        }
        let transfer_txData = async (params: ITransferParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('transfer',transferParams(params),options);
            return result;
        }
        this.transfer = Object.assign(transfer_send, {
            call:transfer_call
            , txData:transfer_txData
        });
        let transferFromParams = (params: ITransferFromParams) => [params.from,params.to,this.wallet.utils.toString(params.value)];
        let transferFrom_send = async (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transferFrom',transferFromParams(params),options);
            return result;
        }
        let transferFrom_call = async (params: ITransferFromParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transferFrom',transferFromParams(params),options);
            return result;
        }
        let transferFrom_txData = async (params: ITransferFromParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('transferFrom',transferFromParams(params),options);
            return result;
        }
        this.transferFrom = Object.assign(transferFrom_send, {
            call:transferFrom_call
            , txData:transferFrom_txData
        });
        let updateFee_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateFee',[],options);
            return result;
        }
        let updateFee_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateFee',[],options);
            return;
        }
        let updateFee_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateFee',[],options);
            return result;
        }
        this.updateFee = Object.assign(updateFee_send, {
            call:updateFee_call
            , txData:updateFee_txData
        });
        let updateProtocolFee_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateProtocolFee',[],options);
            return result;
        }
        let updateProtocolFee_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateProtocolFee',[],options);
            return;
        }
        let updateProtocolFee_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateProtocolFee',[],options);
            return result;
        }
        this.updateProtocolFee = Object.assign(updateProtocolFee_send, {
            call:updateProtocolFee_call
            , txData:updateProtocolFee_txData
        });
    }
}
export module OSWAP_Pair{
    export interface ApprovalEvent {owner:string,spender:string,value:BigNumber,_event:Event}
    export interface BurnEvent {sender:string,amount0:BigNumber,amount1:BigNumber,to:string,_event:Event}
    export interface MintEvent {sender:string,amount0:BigNumber,amount1:BigNumber,_event:Event}
    export interface ProtocolFeeSetEvent {protocolFee:BigNumber,_event:Event}
    export interface SwapEvent {sender:string,amount0In:BigNumber,amount1In:BigNumber,amount0Out:BigNumber,amount1Out:BigNumber,to:string,_event:Event}
    export interface SyncEvent {reserve0:BigNumber,reserve1:BigNumber,_event:Event}
    export interface TradeFeeSetEvent {tradeFee:BigNumber,_event:Event}
    export interface TransferEvent {from:string,to:string,value:BigNumber,_event:Event}
}