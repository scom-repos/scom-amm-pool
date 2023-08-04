/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <reference path="@scom/scom-dex-list/@ijstech/eth-contract/index.d.ts" />
/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dex-list/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@scom/scom-token-modal/@ijstech/eth-wallet/index.d.ts" />
/// <amd-module name="@scom/scom-amm-pool/global/utils/helper.ts" />
declare module "@scom/scom-amm-pool/global/utils/helper.ts" {
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const isInvalidInput: (val: any) => boolean;
    export const limitInputNumber: (input: any, decimals?: number) => void;
    export const limitDecimals: (value: any, decimals: number) => any;
}
/// <amd-module name="@scom/scom-amm-pool/global/utils/common.ts" />
declare module "@scom/scom-amm-pool/global/utils/common.ts" {
    import { BigNumber, ISendTxEventsOptions } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
    export const approveERC20Max: (token: ITokenObject, spenderAddress: string, callback?: any, confirmationCallback?: any) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    export const getERC20Allowance: (token: ITokenObject, spenderAddress: string) => Promise<BigNumber>;
}
/// <amd-module name="@scom/scom-amm-pool/global/utils/approvalModel.ts" />
declare module "@scom/scom-amm-pool/global/utils/approvalModel.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export enum ApprovalStatus {
        TO_BE_APPROVED = 0,
        APPROVING = 1,
        NONE = 2
    }
    export interface IERC20ApprovalEventOptions {
        sender: any;
        payAction: () => Promise<void>;
        onToBeApproved: (token: ITokenObject) => Promise<void>;
        onToBePaid: (token: ITokenObject) => Promise<void>;
        onApproving: (token: ITokenObject, receipt?: string, data?: any) => Promise<void>;
        onApproved: (token: ITokenObject, data?: any) => Promise<void>;
        onPaying: (receipt?: string, data?: any) => Promise<void>;
        onPaid: (data?: any) => Promise<void>;
        onApprovingError: (token: ITokenObject, err: Error) => Promise<void>;
        onPayingError: (err: Error) => Promise<void>;
    }
    export interface IERC20ApprovalOptions extends IERC20ApprovalEventOptions {
        spenderAddress: string;
    }
    export interface IERC20ApprovalAction {
        setSpenderAddress: (value: string) => void;
        doApproveAction: (token: ITokenObject, inputAmount: string, data?: any) => Promise<void>;
        doPayAction: (data?: any) => Promise<void>;
        checkAllowance: (token: ITokenObject, inputAmount: string | BigNumber) => Promise<void>;
    }
    export class ERC20ApprovalModel {
        private options;
        constructor(options: IERC20ApprovalOptions);
        private setSpenderAddress;
        private checkAllowance;
        private doApproveAction;
        private doPayAction;
        getAction: () => IERC20ApprovalAction;
    }
}
/// <amd-module name="@scom/scom-amm-pool/global/utils/interface.ts" />
declare module "@scom/scom-amm-pool/global/utils/interface.ts" {
    import { IWalletPlugin } from "@scom/scom-wallet-modal";
    export interface IContractInfo {
        factoryAddress: string;
        routerAddress: string;
        tradeFee: {
            fee: string;
            base: string;
        };
        fromToken?: string;
        toToken?: string;
    }
    export interface IProvider {
        caption: string;
        image: string;
        key: string;
        dexId?: number;
    }
    export interface IProviderUI {
        caption: string;
        image: string;
        key: string;
        dexId?: number;
        chainId: string | number;
        factoryAddress: string;
        routerAddress: string;
        fromToken?: string;
        toToken?: string;
        tradeFee: {
            fee: string;
            base: string;
        };
    }
    export interface ICommissionInfo {
        chainId: number;
        walletAddress: string;
        share: string;
    }
    export interface IEmbedData {
        commissions?: ICommissionInfo[];
    }
    export interface INetworkConfig {
        chainName?: string;
        chainId: number;
    }
    export type ModeType = 'add' | 'remove' | 'both';
    export interface ICustomTokenObject {
        address: string;
        chainId: number;
    }
    export interface IPoolConfig {
        commissions?: ICommissionInfo[];
        providers: IProviderUI[];
        tokens?: ICustomTokenObject[];
        defaultChainId: number;
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
        mode: ModeType;
    }
    export interface IPoolDetailConfig {
        commissions?: ICommissionInfo[];
        providers: IProviderUI[];
        tokens?: ICustomTokenObject[];
    }
}
/// <amd-module name="@scom/scom-amm-pool/global/utils/index.ts" />
declare module "@scom/scom-amm-pool/global/utils/index.ts" {
    export { formatNumber, formatNumberWithSeparators, limitDecimals, limitInputNumber, isInvalidInput } from "@scom/scom-amm-pool/global/utils/helper.ts";
    export { registerSendTxEvents, approveERC20Max, getERC20Allowance } from "@scom/scom-amm-pool/global/utils/common.ts";
    export { ApprovalStatus, IERC20ApprovalEventOptions, IERC20ApprovalOptions, IERC20ApprovalAction, ERC20ApprovalModel } from "@scom/scom-amm-pool/global/utils/approvalModel.ts";
    export * from "@scom/scom-amm-pool/global/utils/interface.ts";
}
/// <amd-module name="@scom/scom-amm-pool/global/index.ts" />
declare module "@scom/scom-amm-pool/global/index.ts" {
    export const enum EventId {
        IsWalletConnected = "isWalletConnected",
        IsWalletDisconnected = "IsWalletDisconnected",
        Paid = "Paid",
        chainChanged = "chainChanged",
        EmitNewToken = "emitNewToken"
    }
    export * from "@scom/scom-amm-pool/global/utils/index.ts";
}
/// <amd-module name="@scom/scom-amm-pool/store/utils.ts" />
declare module "@scom/scom-amm-pool/store/utils.ts" {
    import { INetwork } from '@ijstech/eth-wallet';
    import { IDexInfo } from '@scom/scom-dex-list';
    export type ProxyAddresses = {
        [key: number]: string;
    };
    export const state: {
        slippageTolerance: number;
        transactionDeadline: number;
        infuraId: string;
        networkMap: {
            [key: number]: INetwork;
        };
        dexInfoList: IDexInfo[];
        proxyAddresses: ProxyAddresses;
        embedderCommissionFee: string;
        rpcWalletId: string;
    };
    export const setDataFromConfig: (options: any) => void;
    export const setProxyAddresses: (data: ProxyAddresses) => void;
    export const getProxyAddress: (chainId?: number) => string;
    export const getEmbedderCommissionFee: () => string;
    export const getSlippageTolerance: () => any;
    export const setSlippageTolerance: (value: any) => void;
    export const getTransactionDeadline: () => any;
    export const setTransactionDeadline: (value: any) => void;
    export const getInfuraId: () => string;
    export const setDexInfoList: (value: IDexInfo[]) => void;
    export const getDexInfoList: () => IDexInfo[];
}
/// <amd-module name="@scom/scom-amm-pool/store/index.ts" />
declare module "@scom/scom-amm-pool/store/index.ts" {
    import { ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    export const nullAddress = "0x0000000000000000000000000000000000000000";
    export const state: {
        rpcWalletId: string;
    };
    export const getWETH: (chainId: number) => ITokenObject;
    export * from "@scom/scom-amm-pool/store/utils.ts";
    export const getSupportedTokens: (tokens: ICustomTokenObject[], chainId: number) => {
        chainId: number;
        address: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean;
        logoURI?: string;
        isCommon?: boolean;
        balance?: string | number;
        isNative?: boolean;
        isWETH?: boolean;
        isNew?: boolean;
    }[];
    export function getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
    export function getClientWallet(): import("@ijstech/eth-wallet").IClientWallet;
    export function isRpcWalletConnected(): boolean;
    export function initRpcWallet(defaultChainId: number): string;
    export function getChainId(): number;
    export function isClientWalletConnected(): boolean;
}
/// <amd-module name="@scom/scom-amm-pool/index.css.ts" />
declare module "@scom/scom-amm-pool/index.css.ts" {
    export const poolStyle: string;
}
/// <amd-module name="@scom/scom-amm-pool/API.ts" />
declare module "@scom/scom-amm-pool/API.ts" {
    import { BigNumber, TransactionReceipt } from "@ijstech/eth-wallet";
    import { Contracts } from "@scom/oswap-openswap-contract";
    import { IERC20ApprovalEventOptions, ICommissionInfo } from "@scom/scom-amm-pool/global/index.ts";
    import { ITokenObject } from "@scom/scom-token-list";
    interface IAmmPairToken {
        pair?: Contracts.OSWAP_Pair;
        index?: number;
        tokenA: ITokenObject;
        tokenB: ITokenObject;
        balance?: string;
    }
    interface INewShare {
        minted: string;
        shareAdded: string;
        newShare: string;
        price0: string;
        price1: string;
    }
    interface IUserShare {
        tokenAShare: string;
        tokenBShare: string;
        totalPoolTokens: string;
        poolShare: string;
    }
    interface IAmmPair extends IUserShare, IAmmPairToken {
    }
    interface ITokensBack {
        amountA: string;
        amountB: string;
        [x: string]: string;
        liquidity: string;
        percent: string;
        newshare: string;
    }
    export const ERC20MaxAmount: BigNumber;
    export const getCurrentCommissions: (commissions: ICommissionInfo[]) => ICommissionInfo[];
    export const getCommissionAmount: (commissions: ICommissionInfo[], amount: BigNumber) => BigNumber;
    export function getRouterAddress(chainId: number): string;
    const getRemoveLiquidityInfo: (tokenA: ITokenObject, tokenB: ITokenObject) => Promise<{
        lpToken: ITokenObject;
        price0: string;
        price1: string;
        tokenAShare: string;
        tokenBShare: string;
        totalPoolTokens: string;
        poolShare: string;
    }>;
    const getPairFromTokens: (tokenA: ITokenObject, tokenB: ITokenObject) => Promise<Contracts.OSWAP_Pair>;
    const getPricesInfo: (tokenA: ITokenObject, tokenB: ITokenObject) => Promise<{
        pair: Contracts.OSWAP_Pair;
        price0: string;
        price1: string;
        balance: string;
        totalSupply: string;
    }>;
    const calculateNewPairShareInfo: (tokenA: ITokenObject, tokenB: ITokenObject, amountADesired: string, amountBDesired: string) => {
        price0: string;
        price1: string;
        minted: string;
    };
    const getNewShareInfo: (tokenA: ITokenObject, tokenB: ITokenObject, amountIn: string, amountADesired: string, amountBDesired: string) => Promise<{
        quote: string;
        newPrice0: string;
        newPrice1: string;
        newShare: string;
        minted: string;
    }>;
    const addLiquidity: (tokenA: ITokenObject, tokenB: ITokenObject, amountADesired: string, amountBDesired: string, commissions: ICommissionInfo[]) => Promise<TransactionReceipt>;
    const removeLiquidity: (tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string, amountADesired: string, amountBDesired: string) => Promise<TransactionReceipt>;
    const getApprovalModelAction: (options: IERC20ApprovalEventOptions, spenderAddress?: string) => Promise<import("@scom/scom-amm-pool/global/index.ts").IERC20ApprovalAction>;
    const getTokensBack: (tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string) => Promise<ITokensBack>;
    const getTokensBackByAmountOut: (tokenA: ITokenObject, tokenB: ITokenObject, tokenOut: ITokenObject, amountOut: string) => Promise<ITokensBack>;
    export { IAmmPair, IUserShare, INewShare, ITokensBack, getNewShareInfo, getPricesInfo, addLiquidity, getApprovalModelAction, calculateNewPairShareInfo, getPairFromTokens, getRemoveLiquidityInfo, removeLiquidity, getTokensBack, getTokensBackByAmountOut };
}
/// <amd-module name="@scom/scom-amm-pool/liquidity/index.css.ts" />
declare module "@scom/scom-amm-pool/liquidity/index.css.ts" {
    export const poolAddStyle: string;
    export const poolRemoveStyle: string;
}
/// <amd-module name="@scom/scom-amm-pool/liquidity/add.tsx" />
declare module "@scom/scom-amm-pool/liquidity/add.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IProviderUI, ICommissionInfo, ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    interface ScomAmmPoolAddElement extends ControlElement {
        providers: IProviderUI[];
        tokens?: ICustomTokenObject[];
        commissions?: ICommissionInfo[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-amm-pool-add"]: ScomAmmPoolAddElement;
            }
        }
    }
    export class ScomAmmPoolAdd extends Module {
        private btnApproveFirstToken;
        private btnApproveSecondToken;
        private btnSupply;
        private confirmSupplyModal;
        private txStatusModal;
        private firstTokenInput;
        private secondTokenInput;
        private firstToken?;
        private secondToken?;
        private firstBalance;
        private secondBalance;
        private lbFirstPrice;
        private lbFirstPriceTitle;
        private lbSecondPrice;
        private lbSecondPriceTitle;
        private lbShareOfPool;
        private isFromEstimated;
        private approvalModelAction;
        private firstInputAmount;
        private secondInputAmount;
        private firstTokenImage1;
        private secondTokenImage1;
        private firstTokenImage2;
        private secondTokenImage2;
        private lbFirstInput;
        private lbSecondInput;
        private lbPoolTokensTitle;
        private lbOutputEstimated;
        private lbFirstDeposited;
        private lbSecondDeposited;
        private lbSummaryFirstPrice;
        private lbSummarySecondPrice;
        private lbShareOfPool2;
        private poolTokenAmount;
        private lbPoolTokenAmount;
        private pnlCreatePairMsg;
        private pricePanel;
        private hStackCommissionInfo;
        private iconCommissionFee;
        private lbFirstCommission;
        private lbSecondCommission;
        private _data;
        private allTokenBalancesMap;
        private isInited;
        tag: any;
        private contractAddress;
        connectWallet: () => void;
        constructor(parent?: Container, options?: ScomAmmPoolAddElement);
        static create(options?: ScomAmmPoolAddElement, parent?: Container): Promise<ScomAmmPoolAdd>;
        get firstTokenDecimals(): number;
        get secondTokenDecimals(): number;
        get firstTokenSymbol(): string;
        get secondTokenSymbol(): string;
        get providers(): IProviderUI[];
        set providers(value: IProviderUI[]);
        get commissions(): ICommissionInfo[];
        set commissions(value: ICommissionInfo[]);
        private get originalData();
        onWalletConnected: (connected: boolean) => Promise<void>;
        onChainChange: () => Promise<void>;
        private setData;
        private refreshUI;
        private updateContractAddress;
        private updateCommissionInfo;
        private initializeWidgetConfig;
        private setFixedPairData;
        private initTokenSelection;
        private getBalance;
        private updateBalance;
        private resetData;
        private initData;
        private updateButtonText;
        private onCheckInput;
        private handleInputChange;
        private handleEnterAmount;
        private resetFirstInput;
        private resetSecondInput;
        private setMaxBalance;
        private updateButton;
        private onUpdateToken;
        private onSelectToken;
        private handleApprove;
        private handleAction;
        private handleSupply;
        private handleConfirmSupply;
        private onSubmit;
        private initApprovalModelAction;
        private checkPairExists;
        private callAPIBundle;
        init(): Promise<void>;
        private toggleCreateMessage;
        private showTxStatusModal;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-amm-pool/liquidity/remove.tsx" />
declare module "@scom/scom-amm-pool/liquidity/remove.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IProviderUI, ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    interface ScomAmmPoolRemoveElement extends ControlElement {
        providers: IProviderUI[];
        tokens?: ICustomTokenObject[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-amm-pool-remove"]: ScomAmmPoolRemoveElement;
            }
        }
    }
    export class ScomAmmPoolRemove extends Module {
        private btnApprove;
        private btnRemove;
        private txStatusModal;
        private firstTokenInput;
        private secondTokenInput;
        private firstToken?;
        private secondToken?;
        private lbFirstPrice;
        private lbFirstPriceTitle;
        private lbSecondPrice;
        private lbSecondPriceTitle;
        private lbShareOfPool;
        private approvalModelAction;
        private firstInputAmount;
        private secondInputAmount;
        private pnlCreatePairMsg;
        private pricePanel;
        private pnlLiquidityImage;
        private lbLiquidityBalance;
        private liquidityInput;
        private pnlInfo;
        private _data;
        private maxLiquidityBalance;
        private lpToken;
        private isInited;
        private removeInfo;
        tag: any;
        private contractAddress;
        connectWallet: () => void;
        constructor(parent?: Container, options?: ScomAmmPoolRemoveElement);
        static create(options?: ScomAmmPoolRemoveElement, parent?: Container): Promise<ScomAmmPoolRemove>;
        get firstTokenDecimals(): number;
        get secondTokenDecimals(): number;
        get firstTokenSymbol(): string;
        get secondTokenSymbol(): string;
        get providers(): IProviderUI[];
        set providers(value: IProviderUI[]);
        private get originalData();
        onWalletConnected: (connected: boolean) => Promise<void>;
        onChainChange: () => Promise<void>;
        private setData;
        private refreshUI;
        private updateContractAddress;
        private onSetupPage;
        private renderLiquidity;
        private setFixedPairData;
        private initTokenSelection;
        private resetData;
        private initData;
        private updateButtonText;
        private handleOutputChange;
        private handleEnterAmount;
        private resetFirstInput;
        private resetSecondInput;
        private setMaxLiquidityBalance;
        private onLiquidityChange;
        private updateButton;
        private onUpdateToken;
        private onSelectToken;
        private resetUI;
        private handleApprove;
        private updateBtnRemove;
        private handleAction;
        private onSubmit;
        private initApprovalModelAction;
        private checkPairExists;
        private callAPIBundle;
        init(): Promise<void>;
        private toggleCreateMessage;
        private showTxStatusModal;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-amm-pool/liquidity/index.tsx" />
declare module "@scom/scom-amm-pool/liquidity/index.tsx" {
    export { ScomAmmPoolAdd } from "@scom/scom-amm-pool/liquidity/add.tsx";
    export { ScomAmmPoolRemove } from "@scom/scom-amm-pool/liquidity/remove.tsx";
}
/// <amd-module name="@scom/scom-amm-pool/data.json.ts" />
declare module "@scom/scom-amm-pool/data.json.ts" {
    const _default: {
        infuraId: string;
        networks: {
            chainId: number;
            explorerTxUrl: string;
            explorerAddressUrl: string;
        }[];
        proxyAddresses: {
            "97": string;
            "43113": string;
        };
        embedderCommissionFee: string;
        defaultBuilderData: {
            providers: {
                caption: string;
                image: string;
                key: string;
                dexId: number;
                chainId: number;
            }[];
            mode: string;
            tokens: {
                address: string;
                chainId: number;
            }[];
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
            showHeader: boolean;
            showFooter: boolean;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-amm-pool/formSchema.json.ts" />
declare module "@scom/scom-amm-pool/formSchema.json.ts" {
    const _default_1: {
        general: {
            dataSchema: {
                type: string;
                properties: {
                    mode: {
                        type: string;
                        required: boolean;
                        enum: string[];
                    };
                    tokens: {
                        type: string;
                        required: boolean;
                        items: {
                            type: string;
                            properties: {
                                chainId: {
                                    type: string;
                                    enum: number[];
                                    required: boolean;
                                };
                                address: {
                                    type: string;
                                    required: boolean;
                                };
                            };
                        };
                    };
                    providers: {
                        type: string;
                        required: boolean;
                        items: {
                            type: string;
                            properties: {
                                caption: {
                                    type: string;
                                    required: boolean;
                                };
                                image: {
                                    type: string;
                                    required: boolean;
                                };
                                key: {
                                    type: string;
                                    required: boolean;
                                };
                                dexId: {
                                    type: string;
                                };
                                chainId: {
                                    type: string;
                                    enum: number[];
                                    required: boolean;
                                };
                            };
                        };
                    };
                };
            };
            uiSchema: {
                type: string;
                elements: {
                    type: string;
                    scope: string;
                    options: {
                        detail: {
                            type: string;
                        };
                    };
                }[];
            };
        };
        theme: {
            dataSchema: {
                type: string;
                properties: {
                    dark: {
                        type: string;
                        properties: {
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                                inputBackgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                inputFontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                    light: {
                        type: string;
                        properties: {
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                                inputBackgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                inputFontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-amm-pool" />
declare module "@scom/scom-amm-pool" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { INetworkConfig, IPoolConfig, IProviderUI, ModeType, ICommissionInfo, ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    interface ScomAmmPoolElement extends ControlElement {
        lazyLoad?: boolean;
        providers: IProviderUI[];
        tokens?: ICustomTokenObject[];
        defaultChainId: number;
        networks: INetworkConfig[];
        wallets: IWalletPlugin[];
        mode: ModeType;
        commissions?: ICommissionInfo[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-amm-pool"]: ScomAmmPoolElement;
            }
        }
    }
    export default class ScomAmmPool extends Module {
        private dappContainer;
        private vStackAmmPool;
        private poolAdd;
        private poolRemove;
        private mdWallet;
        private _data;
        tag: any;
        private rpcWalletEvents;
        constructor(parent?: Container, options?: ScomAmmPoolElement);
        static create(options?: ScomAmmPoolElement, parent?: Container): Promise<ScomAmmPool>;
        get providers(): IProviderUI[];
        set providers(value: IProviderUI[]);
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        get commissions(): ICommissionInfo[];
        set commissions(value: ICommissionInfo[]);
        get mode(): ModeType;
        set mode(value: ModeType);
        get tokens(): ICustomTokenObject[];
        set tokens(value: ICustomTokenObject[]);
        private get isRemoveLiquidity();
        private get isAddLiquidity();
        private _getActions;
        private getData;
        private setData;
        private refreshUI;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: (category?: string) => any;
            getData: any;
            setData: (data: IPoolConfig) => Promise<void>;
            getTag: any;
            setTag: any;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        } | {
            name: string;
            target: string;
            elementName: string;
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => void;
            getData: () => {
                fee: string;
                commissions?: ICommissionInfo[];
                providers: IProviderUI[];
                tokens?: ICustomTokenObject[];
                defaultChainId: number;
                wallets: IWalletPlugin[];
                networks: INetworkConfig[];
                showHeader?: boolean;
                mode: ModeType;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private initWallet;
        private initializeWidgetConfig;
        init(): Promise<void>;
        private resetEvents;
        private connectWallet;
        onHide(): void;
        render(): any;
    }
}
