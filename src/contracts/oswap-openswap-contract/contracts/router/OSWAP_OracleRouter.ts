import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_OracleRouter.json";
export interface IDeployParams {ammFactory:string;oracleFactory:string;WETH:string}
export interface IGetAmountInParams {amountOut:number|BigNumber;tokenIn:string;tokenOut:string;data:string}
export interface IGetAmountOutParams {amountIn:number|BigNumber;tokenIn:string;tokenOut:string;data:string}
export interface IGetAmountsInParams {amountOut:number|BigNumber;path:string[];useOracle:boolean[];data:string}
export interface IGetAmountsOutParams {amountIn:number|BigNumber;path:string[];useOracle:boolean[];data:string}
export interface IGetLatestPriceParams {tokenIn:string;tokenOut:string;data:string}
export interface ISwapETHForExactTokensParams {amountOut:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactETHForTokensParams {amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactETHForTokensSupportingFeeOnTransferTokensParams {amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactTokensForETHParams {amountIn:number|BigNumber;amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactTokensForETHSupportingFeeOnTransferTokensParams {amountIn:number|BigNumber;amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactTokensForTokensParams {amountIn:number|BigNumber;amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams {amountIn:number|BigNumber;amountOutMin:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapTokensForExactETHParams {amountOut:number|BigNumber;amountInMax:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export interface ISwapTokensForExactTokensParams {amountOut:number|BigNumber;amountInMax:number|BigNumber;path:string[];to:string;deadline:number|BigNumber;useOracle:boolean[];data:string}
export class OSWAP_OracleRouter extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.ammFactory,params.oracleFactory,params.WETH], options);
    }
    WETH: {
        (options?: TransactionOptions): Promise<string>;
    }
    ammFactory: {
        (options?: TransactionOptions): Promise<string>;
    }
    getAmountIn: {
        (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountOut: {
        (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    getAmountsIn: {
        (params: IGetAmountsInParams, options?: TransactionOptions): Promise<BigNumber[]>;
    }
    getAmountsOut: {
        (params: IGetAmountsOutParams, options?: TransactionOptions): Promise<BigNumber[]>;
    }
    getLatestPrice: {
        (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    oracleFactory: {
        (options?: TransactionOptions): Promise<string>;
    }
    swapETHForExactTokens: {
        (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    swapExactETHForTokens: {
        (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    swapExactETHForTokensSupportingFeeOnTransferTokens: {
        (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    swapExactTokensForETH: {
        (params: ISwapExactTokensForETHParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactTokensForETHParams, options?: TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapExactTokensForETHParams, options?: TransactionOptions) => Promise<string>;
    }
    swapExactTokensForETHSupportingFeeOnTransferTokens: {
        (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    swapExactTokensForTokens: {
        (params: ISwapExactTokensForTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactTokensForTokensParams, options?: TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapExactTokensForTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    swapExactTokensForTokensSupportingFeeOnTransferTokens: {
        (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    swapTokensForExactETH: {
        (params: ISwapTokensForExactETHParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapTokensForExactETHParams, options?: TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapTokensForExactETHParams, options?: TransactionOptions) => Promise<string>;
    }
    swapTokensForExactTokens: {
        (params: ISwapTokensForExactTokensParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISwapTokensForExactTokensParams, options?: TransactionOptions) => Promise<BigNumber[]>;
        txData: (params: ISwapTokensForExactTokensParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let WETH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('WETH',[],options);
            return result;
        }
        this.WETH = WETH_call
        let ammFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('ammFactory',[],options);
            return result;
        }
        this.ammFactory = ammFactory_call
        let getAmountInParams = (params: IGetAmountInParams) => [this.wallet.utils.toString(params.amountOut),params.tokenIn,params.tokenOut,this.wallet.utils.stringToBytes(params.data)];
        let getAmountIn_call = async (params: IGetAmountInParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountIn',getAmountInParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountIn = getAmountIn_call
        let getAmountOutParams = (params: IGetAmountOutParams) => [this.wallet.utils.toString(params.amountIn),params.tokenIn,params.tokenOut,this.wallet.utils.stringToBytes(params.data)];
        let getAmountOut_call = async (params: IGetAmountOutParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getAmountOut',getAmountOutParams(params),options);
            return new BigNumber(result);
        }
        this.getAmountOut = getAmountOut_call
        let getAmountsInParams = (params: IGetAmountsInParams) => [this.wallet.utils.toString(params.amountOut),params.path,params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let getAmountsIn_call = async (params: IGetAmountsInParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('getAmountsIn',getAmountsInParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        this.getAmountsIn = getAmountsIn_call
        let getAmountsOutParams = (params: IGetAmountsOutParams) => [this.wallet.utils.toString(params.amountIn),params.path,params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let getAmountsOut_call = async (params: IGetAmountsOutParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('getAmountsOut',getAmountsOutParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        this.getAmountsOut = getAmountsOut_call
        let getLatestPriceParams = (params: IGetLatestPriceParams) => [params.tokenIn,params.tokenOut,this.wallet.utils.stringToBytes(params.data)];
        let getLatestPrice_call = async (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getLatestPrice',getLatestPriceParams(params),options);
            return new BigNumber(result);
        }
        this.getLatestPrice = getLatestPrice_call
        let oracleFactory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracleFactory',[],options);
            return result;
        }
        this.oracleFactory = oracleFactory_call
        let swapETHForExactTokensParams = (params: ISwapETHForExactTokensParams) => [this.wallet.utils.toString(params.amountOut),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapETHForExactTokens_send = async (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapETHForExactTokens',swapETHForExactTokensParams(params),options);
            return result;
        }
        let swapETHForExactTokens_call = async (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapETHForExactTokens',swapETHForExactTokensParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapETHForExactTokens_txData = async (params: ISwapETHForExactTokensParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('swapETHForExactTokens',swapETHForExactTokensParams(params),options);
            return result;
        }
        this.swapETHForExactTokens = Object.assign(swapETHForExactTokens_send, {
            call:swapETHForExactTokens_call
            , txData:swapETHForExactTokens_txData
        });
        let swapExactETHForTokensParams = (params: ISwapExactETHForTokensParams) => [this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactETHForTokens_send = async (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactETHForTokens',swapExactETHForTokensParams(params),options);
            return result;
        }
        let swapExactETHForTokens_call = async (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapExactETHForTokens',swapExactETHForTokensParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapExactETHForTokens_txData = async (params: ISwapExactETHForTokensParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactETHForTokens',swapExactETHForTokensParams(params),options);
            return result;
        }
        this.swapExactETHForTokens = Object.assign(swapExactETHForTokens_send, {
            call:swapExactETHForTokens_call
            , txData:swapExactETHForTokens_txData
        });
        let swapExactETHForTokensSupportingFeeOnTransferTokensParams = (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams) => [this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactETHForTokensSupportingFeeOnTransferTokens_send = async (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactETHForTokensSupportingFeeOnTransferTokens',swapExactETHForTokensSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        let swapExactETHForTokensSupportingFeeOnTransferTokens_call = async (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('swapExactETHForTokensSupportingFeeOnTransferTokens',swapExactETHForTokensSupportingFeeOnTransferTokensParams(params),options);
            return;
        }
        let swapExactETHForTokensSupportingFeeOnTransferTokens_txData = async (params: ISwapExactETHForTokensSupportingFeeOnTransferTokensParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactETHForTokensSupportingFeeOnTransferTokens',swapExactETHForTokensSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        this.swapExactETHForTokensSupportingFeeOnTransferTokens = Object.assign(swapExactETHForTokensSupportingFeeOnTransferTokens_send, {
            call:swapExactETHForTokensSupportingFeeOnTransferTokens_call
            , txData:swapExactETHForTokensSupportingFeeOnTransferTokens_txData
        });
        let swapExactTokensForETHParams = (params: ISwapExactTokensForETHParams) => [this.wallet.utils.toString(params.amountIn),this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactTokensForETH_send = async (params: ISwapExactTokensForETHParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactTokensForETH',swapExactTokensForETHParams(params),options);
            return result;
        }
        let swapExactTokensForETH_call = async (params: ISwapExactTokensForETHParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapExactTokensForETH',swapExactTokensForETHParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapExactTokensForETH_txData = async (params: ISwapExactTokensForETHParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactTokensForETH',swapExactTokensForETHParams(params),options);
            return result;
        }
        this.swapExactTokensForETH = Object.assign(swapExactTokensForETH_send, {
            call:swapExactTokensForETH_call
            , txData:swapExactTokensForETH_txData
        });
        let swapExactTokensForETHSupportingFeeOnTransferTokensParams = (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams) => [this.wallet.utils.toString(params.amountIn),this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactTokensForETHSupportingFeeOnTransferTokens_send = async (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactTokensForETHSupportingFeeOnTransferTokens',swapExactTokensForETHSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        let swapExactTokensForETHSupportingFeeOnTransferTokens_call = async (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('swapExactTokensForETHSupportingFeeOnTransferTokens',swapExactTokensForETHSupportingFeeOnTransferTokensParams(params),options);
            return;
        }
        let swapExactTokensForETHSupportingFeeOnTransferTokens_txData = async (params: ISwapExactTokensForETHSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactTokensForETHSupportingFeeOnTransferTokens',swapExactTokensForETHSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        this.swapExactTokensForETHSupportingFeeOnTransferTokens = Object.assign(swapExactTokensForETHSupportingFeeOnTransferTokens_send, {
            call:swapExactTokensForETHSupportingFeeOnTransferTokens_call
            , txData:swapExactTokensForETHSupportingFeeOnTransferTokens_txData
        });
        let swapExactTokensForTokensParams = (params: ISwapExactTokensForTokensParams) => [this.wallet.utils.toString(params.amountIn),this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactTokensForTokens_send = async (params: ISwapExactTokensForTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactTokensForTokens',swapExactTokensForTokensParams(params),options);
            return result;
        }
        let swapExactTokensForTokens_call = async (params: ISwapExactTokensForTokensParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapExactTokensForTokens',swapExactTokensForTokensParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapExactTokensForTokens_txData = async (params: ISwapExactTokensForTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactTokensForTokens',swapExactTokensForTokensParams(params),options);
            return result;
        }
        this.swapExactTokensForTokens = Object.assign(swapExactTokensForTokens_send, {
            call:swapExactTokensForTokens_call
            , txData:swapExactTokensForTokens_txData
        });
        let swapExactTokensForTokensSupportingFeeOnTransferTokensParams = (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams) => [this.wallet.utils.toString(params.amountIn),this.wallet.utils.toString(params.amountOutMin),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapExactTokensForTokensSupportingFeeOnTransferTokens_send = async (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapExactTokensForTokensSupportingFeeOnTransferTokens',swapExactTokensForTokensSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        let swapExactTokensForTokensSupportingFeeOnTransferTokens_call = async (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('swapExactTokensForTokensSupportingFeeOnTransferTokens',swapExactTokensForTokensSupportingFeeOnTransferTokensParams(params),options);
            return;
        }
        let swapExactTokensForTokensSupportingFeeOnTransferTokens_txData = async (params: ISwapExactTokensForTokensSupportingFeeOnTransferTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapExactTokensForTokensSupportingFeeOnTransferTokens',swapExactTokensForTokensSupportingFeeOnTransferTokensParams(params),options);
            return result;
        }
        this.swapExactTokensForTokensSupportingFeeOnTransferTokens = Object.assign(swapExactTokensForTokensSupportingFeeOnTransferTokens_send, {
            call:swapExactTokensForTokensSupportingFeeOnTransferTokens_call
            , txData:swapExactTokensForTokensSupportingFeeOnTransferTokens_txData
        });
        let swapTokensForExactETHParams = (params: ISwapTokensForExactETHParams) => [this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.amountInMax),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapTokensForExactETH_send = async (params: ISwapTokensForExactETHParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapTokensForExactETH',swapTokensForExactETHParams(params),options);
            return result;
        }
        let swapTokensForExactETH_call = async (params: ISwapTokensForExactETHParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapTokensForExactETH',swapTokensForExactETHParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapTokensForExactETH_txData = async (params: ISwapTokensForExactETHParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapTokensForExactETH',swapTokensForExactETHParams(params),options);
            return result;
        }
        this.swapTokensForExactETH = Object.assign(swapTokensForExactETH_send, {
            call:swapTokensForExactETH_call
            , txData:swapTokensForExactETH_txData
        });
        let swapTokensForExactTokensParams = (params: ISwapTokensForExactTokensParams) => [this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.amountInMax),params.path,params.to,this.wallet.utils.toString(params.deadline),params.useOracle,this.wallet.utils.stringToBytes(params.data)];
        let swapTokensForExactTokens_send = async (params: ISwapTokensForExactTokensParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('swapTokensForExactTokens',swapTokensForExactTokensParams(params),options);
            return result;
        }
        let swapTokensForExactTokens_call = async (params: ISwapTokensForExactTokensParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('swapTokensForExactTokens',swapTokensForExactTokensParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        let swapTokensForExactTokens_txData = async (params: ISwapTokensForExactTokensParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('swapTokensForExactTokens',swapTokensForExactTokensParams(params),options);
            return result;
        }
        this.swapTokensForExactTokens = Object.assign(swapTokensForExactTokens_send, {
            call:swapTokensForExactTokens_call
            , txData:swapTokensForExactTokens_txData
        });
    }
}