import {IWallet,BigNumber,nullAddress} from "@ijstech/eth-contract";
import {
    OSWAP_Factory, 
    OSWAP_PairCreator, 
    OSWAP_Router, 
    OSWAP_VotingExecutor1, 
    OAXDEX_Governance, 
    OAXDEX_VotingExecutor, 
    OAXDEX_Administrator, 
    OAXDEX_VotingRegistry, 
    OSWAP_OraclePairCreator, 
    OSWAP_VotingExecutor2, 
    OSWAP_OracleFactory, 
    OSWAP_OracleLiquidityProvider, 
    OSWAP_OracleRouter, 
    OSWAP_HybridRouterRegistry, 
    OSWAP_HybridRouter2,
    OSWAP_RangePairCreator,
    OSWAP_RangeLiquidityProvider,
    OSWAP_RangeFactory,
    OSWAP_VotingExecutor3,
    OSWAP_RestrictedPairCreator1,
    OSWAP_RestrictedFactory,
    OSWAP_VotingExecutor4,
    OSWAP_ConfigStore,
    OSWAP_RestrictedPairOracle,
    OSWAP_RestrictedLiquidityProvider1
} from './contracts/index';
import { OSWAP_OtcLiquidityProvider } from "./contracts/restricted/OSWAP_OtcLiquidityProvider";
import { OSWAP_OtcPairCreator } from "./contracts/restricted/OSWAP_OtcPairCreator";
import { OSWAP_OtcPairOracle } from "./contracts/restricted/OSWAP_OtcPairOracle";
import {OpenSwap} from './OpenSwap';
export interface ICoreContractsDeploymentResult {
    administrator?: string;
    factory?: string;
    governance?: string;
    oswap?: string;
    votingToken?: string;
    pairCreator?: string;
    router?: string;
    votingRegistry?: string;
    votingExecutor?: string;
    votingExecutor1?: string;
    weth?: string;
}
export interface IOracleContractsDeploymentResult {
    oracleFactory?: string;    
    oracleLiquidityProvider?: string;
    oraclePairCreator?: string;
    oracleRouter?: string;
    votingExecutor2?: string;
}
export interface IRangeContractsDeploymentResult {
    rangeFactory?: string;    
    rangeLiquidityProvider?: string;
    rangePairCreator?: string;
    votingExecutor3?: string;
}
export interface IRestrictedContractsDeploymentResult {
    restrictedFactory?: string;    
    restrictedLiquidityProvider?: string;
    restrictedPairCreator?: string;
    configStore?: string;
    votingExecutor4?: string;
}
export interface IHybridRouterDeploymentResult {
    hybridRouter?: string;
    hybridRouterRegistry?: string;
}
export interface IDeploymentResult extends ICoreContractsDeploymentResult, IOracleContractsDeploymentResult, 
IRangeContractsDeploymentResult, IRestrictedContractsDeploymentResult, IHybridRouterDeploymentResult {
}
export interface IGovProfile {
    "minExeDelay": number,
    "minVoteDuration": number,
    "maxVoteDuration": number,
    "minGovTokenToCreateVote": number,
    "minQuorum": number
}
export interface IGovOptions{
    minStakePeriod: number;
    tradeFee: number,
    protocolFee: number,
    protocolFeeTo: string,
    profiles: {
        name: string[],
        minExeDelay: number[];
        minVoteDuration: number[],
        maxVoteDuration: number[],
        minGovTokenToCreateVote: string[],
        minQuorum: string[]
    }
}
export const DefaultGovOptions: IGovOptions = {
    minStakePeriod: 1,
    tradeFee: 0.2,
    protocolFee: 0,
    protocolFeeTo: '',
    profiles: {
        name: ['poll','vote','addOldOracleToNewPair'],
        minExeDelay: [1,1,1],
        minVoteDuration: [0,0,0],
        maxVoteDuration: [1209600,1209600,1209600], 
        minGovTokenToCreateVote: ['100000','100000','100000'],
        minQuorum: ['0','10000000','100']
    }
}
export interface IGovTokenOptions{
    initSupply: number|BigNumber;
    initSupplyTo: string;
    minter: string;
    totalSupply: number|BigNumber;
}
export const DefaultGovTokenOptions: IGovTokenOptions = {
    initSupply: 0,
    initSupplyTo: '',
    minter: '',
    totalSupply: 1000000000
}
export interface IAmmOptions{
    governance?: string;
    pairCreator?: string;
    protocolFee?: number;
    protocolFeeTo?: string;
    tradeFee?: number;
}
export interface IOracleFactoryOptions{
    feePerDelegator?: number|BigNumber;
    governance?: string;
    pairCreator?: string;
    protocolFee?: number|BigNumber;
    protocolFeeTo?: string;
    tradeFee?: number|BigNumber;
}
export interface IRangeFactoryOptions{
    governance?: string;
    oracleFactory?: string;
    pairCreator?: string;
    tradeFee?: number|BigNumber;
    stakeAmount?: number[]|BigNumber[];
    liquidityProviderShare?: number[]|BigNumber[];
    protocolFeeTo?: string;
}
export interface IRestrictedFactoryOptions{
    governance?: string;
    whitelistFactory?: string;
    pairCreator?: string;
    configStore?: string;
    tradeFee?: number|BigNumber;
    protocolFee?: number|BigNumber;
    protocolFeeTo?: string;
    type?: 'Restricted1' | 'Otc';
}
export interface IHybridRouterOptions{
    registryAddress?: string;
    weth?: string;
    governance?: string;
    name?: string[];
    factory?: string[];
    fee?:number[]|BigNumber[];
    feeBase?:number[]|BigNumber[];
    typeCode?:number[]|BigNumber[];
}
export interface IDeployOptions {
    govTokenOptions?: IGovTokenOptions;
    govOptions?: IGovOptions;
    amm?: IAmmOptions;
    oracle?: IOracleFactoryOptions;
    range?: IRangeFactoryOptions;
    restricted?: IRestrictedFactoryOptions;
    hybridRouter?: IHybridRouterOptions;
    tokens?: {
        oswap?: string;
        weth?: string;
        votingToken?: string;
    }
}
export interface IDeploymentContracts {
    openSwap: OpenSwap;
    governance: OAXDEX_Governance;
    administrator: OAXDEX_Administrator;
    registry: OAXDEX_VotingRegistry;
    pairCreator: OSWAP_PairCreator;
    factory: OSWAP_Factory;
    oraclePairCreator: OSWAP_OraclePairCreator;
    router: OSWAP_Router;
    oracleFactory: OSWAP_OracleFactory;
    oracleRouter: OSWAP_OracleRouter;
    oracleLiquidityProvider: OSWAP_OracleLiquidityProvider;
    hybridRouterRegistry: OSWAP_HybridRouterRegistry;
    hybridRouter: OSWAP_HybridRouter2;
    executor: OAXDEX_VotingExecutor;
    executor1: OSWAP_VotingExecutor1;
    executor2: OSWAP_VotingExecutor2;
}

export function toDeploymentContracts(wallet: IWallet, result: IDeploymentResult): IDeploymentContracts{
    return {
        openSwap: new OpenSwap(wallet, result.oswap),
        governance: new OAXDEX_Governance(wallet, result.governance),
        administrator: new OAXDEX_Administrator(wallet, result.administrator),
        registry: new OAXDEX_VotingRegistry(wallet, result.votingRegistry),
        pairCreator:new  OSWAP_PairCreator(wallet, result.pairCreator),
        factory: new OSWAP_Factory(wallet, result.factory),
        oraclePairCreator: new OSWAP_OraclePairCreator(wallet, result.oraclePairCreator),
        router: new OSWAP_Router(wallet, result.router),
        oracleFactory: new OSWAP_OracleFactory(wallet, result.oracleFactory),
        oracleRouter: new OSWAP_OracleRouter(wallet, result.oracleRouter),
        oracleLiquidityProvider: new OSWAP_OracleLiquidityProvider(wallet, result.oracleLiquidityProvider),
        hybridRouterRegistry: new OSWAP_HybridRouterRegistry(wallet, result.hybridRouterRegistry),
        hybridRouter: new OSWAP_HybridRouter2(wallet, result.hybridRouter),
        executor: new OAXDEX_VotingExecutor(wallet, result.votingExecutor),
        executor1: new OSWAP_VotingExecutor1(wallet, result.votingExecutor1),
        executor2: new OSWAP_VotingExecutor2(wallet, result.votingExecutor2)
    }
}

export async function deployCoreContracts(wallet: IWallet, options: IDeployOptions): Promise<ICoreContractsDeploymentResult>{
    let result: ICoreContractsDeploymentResult = {};
    //oswap
    if (!options.tokens.oswap){
        let oswap = new OpenSwap(wallet);
        result.oswap = await oswap.deploy(options.govTokenOptions);                        
    }
    else
        result.oswap = options.tokens.oswap; 
    //votingToken
    if (!options.tokens.votingToken){
        result.votingToken = result.oswap;
    }
    else {
        result.votingToken = options.tokens.votingToken;
    }      
    //weth            
    if (options.tokens.weth)
        result.weth = options.tokens.weth;           
    //governance
    let governance = new OAXDEX_Governance(wallet);
    result.governance = await governance.deploy({
        names: options.govOptions.profiles.name, 
        maxVoteDuration: options.govOptions.profiles.maxVoteDuration,
        minExeDelay: options.govOptions.profiles.minExeDelay,
        minOaxTokenToCreateVote: options.govOptions.profiles.minGovTokenToCreateVote.map(v => wallet.utils.toDecimals(v)),
        minQuorum: options.govOptions.profiles.minQuorum.map(v => wallet.utils.toDecimals(v)),
        minStakePeriod: options.govOptions.minStakePeriod,
        minVoteDuration: options.govOptions.profiles.minVoteDuration,
        oaxToken: result.oswap,
        votingToken: result.votingToken
    })
    
    //administrator
    let administrator = new OAXDEX_Administrator(wallet);
    result.administrator = await administrator.deploy(governance.address);
    await governance.initAdmin(result.administrator);
    //VotingRegistry	
    let votingRegistry = new OAXDEX_VotingRegistry(wallet);
    result.votingRegistry = await votingRegistry.deploy(result.governance);
    await governance.setVotingRegister(result.votingRegistry);
    //PairCreator
    let pairCreator = new OSWAP_PairCreator(wallet);
    result.pairCreator = await pairCreator.deploy();
    //Factory
    let factory = new OSWAP_Factory(wallet);
    result.factory = await factory.deploy({
        governance: options.amm.governance || result.governance,
        pairCreator: result.pairCreator,
        protocolFee: 0,
        protocolFeeTo: options.amm.protocolFeeTo || nullAddress,
        tradeFee: 0
    });
    //Router
    let router = new OSWAP_Router(wallet);
    result.router = await router.deploy({
        WETH: result.weth,
        factory: result.factory
    });   
    //VotingExecutor
    let votingExecutor = new OAXDEX_VotingExecutor(wallet);
    result.votingExecutor = await votingExecutor.deploy({
        admin: result.administrator,
        governance: result.governance
    });
    //VotingExecutor1
    let votingExecutor1 = new OSWAP_VotingExecutor1(wallet);
    result.votingExecutor1 = await votingExecutor1.deploy(factory.address);    
    return result;
} 

export async function deployOracleContracts(wallet: IWallet, options: IOracleFactoryOptions, coreContractsResult: ICoreContractsDeploymentResult): Promise<IOracleContractsDeploymentResult>{
    let result: IOracleContractsDeploymentResult = {};
    //OraclePairCreator
    let oraclePairCreator = new OSWAP_OraclePairCreator(wallet);
    result.oraclePairCreator = await oraclePairCreator.deploy();                       
    //OracleFactory
    let oracleFactory = new OSWAP_OracleFactory(wallet);
    result.oracleFactory = await oracleFactory.deploy({
        feePerDelegator: options.feePerDelegator || 0,
        governance: options.governance || coreContractsResult.governance,
        pairCreator: options.pairCreator || result.oraclePairCreator,
        protocolFee: options.protocolFee || 0,
        protocolFeeTo: options.protocolFeeTo || nullAddress,
        tradeFee: options.tradeFee || 0
    });
    //OracleRouter
    let oracleRouter = new OSWAP_OracleRouter(wallet);
    result.oracleRouter = await oracleRouter.deploy({
        WETH: coreContractsResult.weth,
        ammFactory: coreContractsResult.factory,
        oracleFactory: result.oracleFactory
    });
    //OracleLiquidityProvider
    let oracleLiquidityProvider = new OSWAP_OracleLiquidityProvider(wallet);
    result.oracleLiquidityProvider = await oracleLiquidityProvider.deploy({
        WETH: coreContractsResult.weth,
        factory: result.oracleFactory
    });            
    await oracleFactory.setOracleLiquidityProvider({
        oracleLiquidityProvider: result.oracleLiquidityProvider,
        oracleRouter: result.oracleRouter
    });      
    //VotingExecutor2
    let votingExecutor2 = new OSWAP_VotingExecutor2(wallet);
    result.votingExecutor2 = await votingExecutor2.deploy(oracleFactory.address);  
    return result;
} 

export async function deployRangeContracts(wallet: IWallet, options: IRangeFactoryOptions, weth: string, hybridRegistry: string): Promise<IRangeContractsDeploymentResult>{
    let result: IRangeContractsDeploymentResult = {};
    //RangePairCreator
    let rangePairCreator = new OSWAP_RangePairCreator(wallet);
    result.rangePairCreator = await rangePairCreator.deploy();                       
    //RangeFactory
    let rangeFactory = new OSWAP_RangeFactory(wallet);
    result.rangeFactory = await rangeFactory.deploy({
        governance: options.governance,
        oracleFactory: options.oracleFactory,
        pairCreator: options.pairCreator || result.rangePairCreator,
        tradeFee: options.tradeFee || 0,
        stakeAmount: options.stakeAmount || [],
        liquidityProviderShare: options.liquidityProviderShare || [],
        protocolFeeTo: options.protocolFeeTo || nullAddress
    });
    //RangeLiquidityProvider
    let rangeLiquidityProvider = new OSWAP_RangeLiquidityProvider(wallet);
    result.rangeLiquidityProvider = await rangeLiquidityProvider.deploy({
        WETH: weth,
        factory: result.rangeFactory
    });            
    await rangeFactory.setRangeLiquidityProvider(result.rangeLiquidityProvider);      
    //VotingExecutor3
    let votingExecutor3 = new OSWAP_VotingExecutor3(wallet);
    result.votingExecutor3 = await votingExecutor3.deploy({
        governance: options.governance,
        factory: rangeFactory.address,
        hybridRegistry: hybridRegistry
    });  
    return result;
} 

export async function deployRestrictedContracts(wallet: IWallet, options: IRestrictedFactoryOptions, weth: string): Promise<IRestrictedContractsDeploymentResult>{
    let result: IRestrictedContractsDeploymentResult = {};
    //ConfigStore
    if (!options.configStore) {
        let configStore = new OSWAP_ConfigStore(wallet);
        result.configStore = await configStore.deploy(options.governance);
    }
    else {
        result.configStore = options.configStore;
    }
    //RestrictedPairCreator
    if (!options.pairCreator) {
        let restrictedPairCreator;
        if (options.type == 'Otc') {
            restrictedPairCreator = new OSWAP_OtcPairCreator(wallet);
        }
        else {
            restrictedPairCreator = new OSWAP_RestrictedPairCreator1(wallet);
        }
        result.restrictedPairCreator = await restrictedPairCreator.deploy(); 
    }
    else {
        result.restrictedPairCreator = options.pairCreator;
    }

    //RestrictedFactory
    let restrictedFactory = new OSWAP_RestrictedFactory(wallet);
    result.restrictedFactory = await restrictedFactory.deploy({
        governance: options.governance,
        whitelistFactory: options.whitelistFactory,
        pairCreator: result.restrictedPairCreator,
        tradeFee: options.tradeFee || 0,
        configStore: result.configStore,
        protocolFee: options.protocolFee || 0,
        protocolFeeTo: options.protocolFeeTo || nullAddress
    });
    //RestrictedLiquidityProvider
    let restrictedLiquidityProvider;
    if (options.type == 'Otc') {
        restrictedLiquidityProvider = new OSWAP_OtcLiquidityProvider(wallet);
    }
    else {
        restrictedLiquidityProvider = new OSWAP_RestrictedLiquidityProvider1(wallet);
    }
    result.restrictedLiquidityProvider = await restrictedLiquidityProvider.deploy({
        WETH: weth,
        factory: result.restrictedFactory
    });            
    await restrictedFactory.init(result.restrictedLiquidityProvider);      
    //VotingExecutor4
    let votingExecutor4 = new OSWAP_VotingExecutor4(wallet);
    result.votingExecutor4 = await votingExecutor4.deploy({
        governance: options.governance,
        factory: restrictedFactory.address,
        configStore: result.configStore
    });  
    return result;
} 

export async function deployRestrictedPairOracle(wallet: IWallet, isOtc?: boolean){
    let restrictedPairOracle;
    if (isOtc) {
        restrictedPairOracle = new OSWAP_OtcPairOracle(wallet);
    }
    else {
        restrictedPairOracle = new OSWAP_RestrictedPairOracle(wallet);
    }
    let result = await restrictedPairOracle.deploy();
    return result;
}

export async function initHybridRouterRegistry(wallet: IWallet, options: IHybridRouterOptions) {
    let hybridRouterRegistry = new OSWAP_HybridRouterRegistry(wallet, options.registryAddress);
    let {name, factory, fee, feeBase, typeCode} = options;
    await hybridRouterRegistry.init({
        name,
        factory,
        fee,
        feeBase,
        typeCode
    }); 
}

export async function deployHybridRouter(wallet: IWallet, options: IHybridRouterOptions): Promise<IHybridRouterDeploymentResult> {
    let result: IHybridRouterDeploymentResult = {};
    //HybridRouterRegistry
    if (!options.registryAddress) {
        let hybridRouterRegistry = new OSWAP_HybridRouterRegistry(wallet);
        result.hybridRouterRegistry = await hybridRouterRegistry.deploy(options.governance);
    }
    else {
        result.hybridRouterRegistry = options.registryAddress;
    }

    //HybridRouter
    let hybridRouter = new OSWAP_HybridRouter2(wallet);
    result.hybridRouter = await hybridRouter.deploy({
        WETH: options.weth, 
        registry: result.hybridRouterRegistry
    }); 
    
    return result;
}

export function deploy(wallet: IWallet, options?: IDeployOptions): Promise<IDeploymentResult>{
    options = options || <any>{};
    if (!options.govOptions)
        options.govOptions = DefaultGovOptions;
    if (!options.govTokenOptions){
        options.govTokenOptions = DefaultGovTokenOptions;
        options.govTokenOptions.initSupplyTo = wallet.address;
        options.govTokenOptions.minter = wallet.address;
    }
    if (!options.tokens)
        options.tokens = {};
    if (!options.amm)
        options.amm = {};
    if (!options.oracle)
        options.oracle = {};

    return new Promise(async function(resolve, reject){
        try {       
            let coreContractsResult = await deployCoreContracts(wallet, options);
            let oracleContractsResult = await deployOracleContracts(wallet, options.oracle, coreContractsResult);
            let result: IDeploymentResult = {
                ...coreContractsResult,
                ...oracleContractsResult
            };  

            if (options.hybridRouter) {
                options.hybridRouter.governance = coreContractsResult.governance;
                options.hybridRouter.weth = coreContractsResult.weth;
                let hybridRouterResult = await deployHybridRouter(wallet, options.hybridRouter);
                result = {
                    ...result,
                    ...hybridRouterResult
                } 

                if (options.range) {
                    options.range.governance = coreContractsResult.governance;
                    options.range.oracleFactory = oracleContractsResult.oracleFactory;
                    let rangeContractsResult = await deployRangeContracts(wallet, options.range, coreContractsResult.weth, hybridRouterResult.hybridRouterRegistry);
                    result = {
                        ...result,
                        ...rangeContractsResult
                    } 
                }

                if (options.restricted) {
                    options.restricted.governance = coreContractsResult.governance;
                    options.restricted.whitelistFactory = oracleContractsResult.oracleFactory;
                    let restrictedContractsResult = await deployRestrictedContracts(wallet, options.restricted, coreContractsResult.weth);
                    result = {
                        ...result,
                        ...restrictedContractsResult
                    }                 
                } 
            }
            let governance = new OAXDEX_Governance(wallet, coreContractsResult.governance);
            await governance.initVotingExecutor([
                result.votingExecutor, 
                result.votingExecutor1, 
                result.votingExecutor2,
                result.votingExecutor3,
                result.votingExecutor4,
                result.hybridRouterRegistry
            ].filter(Boolean));
            console.dir(result)
            resolve(result)
        }
        catch(err){
            reject(err)
        }
    })
}