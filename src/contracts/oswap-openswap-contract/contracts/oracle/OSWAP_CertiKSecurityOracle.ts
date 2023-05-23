import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_CertiKSecurityOracle.json";
export class OSWAP_CertiKSecurityOracle extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(oracleAddress:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([oracleAddress], options);
    }
    getSecurityScore: {
        (oracle:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    oracleAddress: {
        (options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let getSecurityScore_call = async (oracle:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getSecurityScore',[oracle],options);
            return new BigNumber(result);
        }
        this.getSecurityScore = getSecurityScore_call
        let oracleAddress_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('oracleAddress',[],options);
            return result;
        }
        this.oracleAddress = oracleAddress_call
    }
}