/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dex-list/index.d.ts" />
/// <amd-module name="@scom/scom-amm-pool/global/utils/helper.ts" />
declare module "@scom/scom-amm-pool/global/utils/helper.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export const formatNumber: (value: number | string | BigNumber, decimalFigures?: number) => string;
    export const limitInputNumber: (input: any, decimals?: number) => void;
}
/// <amd-module name="@scom/scom-amm-pool/global/utils/common.ts" />
declare module "@scom/scom-amm-pool/global/utils/common.ts" {
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet";
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
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
        key: string;
    }
    export interface IProviderUI {
        key: string;
        chainId: number;
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
        symbol?: string;
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
    export { formatNumber, limitInputNumber } from "@scom/scom-amm-pool/global/utils/helper.ts";
    export { registerSendTxEvents } from "@scom/scom-amm-pool/global/utils/common.ts";
    export * from "@scom/scom-amm-pool/global/utils/interface.ts";
}
/// <amd-module name="@scom/scom-amm-pool/global/index.ts" />
declare module "@scom/scom-amm-pool/global/index.ts" {
    export * from "@scom/scom-amm-pool/global/utils/index.ts";
}
/// <amd-module name="@scom/scom-amm-pool/store/utils.ts" />
declare module "@scom/scom-amm-pool/store/utils.ts" {
    import { BigNumber, ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork } from '@ijstech/eth-wallet';
    import { IDexDetail, IDexInfo } from '@scom/scom-dex-list';
    import { ICommissionInfo } from "@scom/scom-amm-pool/global/index.ts";
    export type ProxyAddresses = {
        [key: number]: string;
    };
    export class State {
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
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        private initData;
        initRpcWallet(defaultChainId: number): string;
        getProxyAddress(chainId?: number): string;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getChainId(): number;
        setDexInfoList(value: IDexInfo[]): void;
        getDexInfoList(options?: {
            key?: string;
            chainId?: number;
        }): IDexInfo[];
        getDexDetail(key: string, chainId: number): IDexDetail;
        private setNetworkList;
        getCurrentCommissions(commissions: ICommissionInfo[]): ICommissionInfo[];
        getCommissionAmount: (commissions: ICommissionInfo[], amount: BigNumber) => BigNumber;
        setApprovalModelAction(options: IERC20ApprovalEventOptions): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    export function isClientWalletConnected(): boolean;
}
/// <amd-module name="@scom/scom-amm-pool/store/index.ts" />
declare module "@scom/scom-amm-pool/store/index.ts" {
    import { ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    export * from "@scom/scom-amm-pool/store/utils.ts";
    export const getWETH: (chainId: number) => ITokenObject;
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
}
/// <amd-module name="@scom/scom-amm-pool/index.css.ts" />
declare module "@scom/scom-amm-pool/index.css.ts" {
    export const poolStyle: string;
}
/// <amd-module name="@scom/scom-amm-pool/API.ts" />
declare module "@scom/scom-amm-pool/API.ts" {
    import { BigNumber, TransactionReceipt } from "@ijstech/eth-wallet";
    import { Contracts } from "@scom/oswap-openswap-contract";
    import { ICommissionInfo, IProviderUI } from "@scom/scom-amm-pool/global/index.ts";
    import { State } from "@scom/scom-amm-pool/store/index.ts";
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
    export function getRouterAddress(state: State, chainId: number): string;
    const getRemoveLiquidityInfo: (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<{
        lpToken: ITokenObject;
        price0: string;
        price1: string;
        tokenAShare: string;
        tokenBShare: string;
        totalPoolTokens: string;
        poolShare: string;
    }>;
    const getPairFromTokens: (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<Contracts.OSWAP_Pair>;
    const getPricesInfo: (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<{
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
    const getNewShareInfo: (state: State, tokenA: ITokenObject, tokenB: ITokenObject, amountIn: string, amountADesired: string, amountBDesired: string) => Promise<{
        quote: string;
        newPrice0: string;
        newPrice1: string;
        newShare: string;
        minted: string;
    }>;
    const addLiquidity: (state: State, tokenA: ITokenObject, tokenB: ITokenObject, amountADesired: string, amountBDesired: string, commissions: ICommissionInfo[]) => Promise<TransactionReceipt>;
    const removeLiquidity: (state: State, tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string, amountADesired: string, amountBDesired: string) => Promise<TransactionReceipt>;
    const getTokensBack: (state: State, tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string) => Promise<ITokensBack>;
    const getTokensBackByAmountOut: (state: State, tokenA: ITokenObject, tokenB: ITokenObject, tokenOut: ITokenObject, amountOut: string) => Promise<ITokensBack>;
    const getProviderProxySelectors: (state: State, providers: IProviderUI[]) => Promise<string[]>;
    const getPair: (state: State, market: string, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<string>;
    export { IAmmPair, IUserShare, INewShare, ITokensBack, getNewShareInfo, getPricesInfo, addLiquidity, calculateNewPairShareInfo, getPairFromTokens, getRemoveLiquidityInfo, removeLiquidity, getTokensBack, getTokensBackByAmountOut, getProviderProxySelectors, getPair };
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
    import { State } from "@scom/scom-amm-pool/store/index.ts";
    interface ScomAmmPoolAddElement extends ControlElement {
        state: State;
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
        private _state;
        private _data;
        private allTokenBalancesMap;
        private isInited;
        tag: any;
        private contractAddress;
        connectWallet: () => void;
        constructor(parent?: Container, options?: ScomAmmPoolAddElement);
        static create(options?: ScomAmmPoolAddElement, parent?: Container): Promise<ScomAmmPoolAdd>;
        get state(): State;
        set state(value: State);
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
    import { State } from "@scom/scom-amm-pool/store/index.ts";
    interface ScomAmmPoolRemoveElement extends ControlElement {
        state: State;
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
        private _state;
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
        get state(): State;
        set state(value: State);
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
                key: string;
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
/// <amd-module name="@scom/scom-amm-pool/formSchema.ts" />
declare module "@scom/scom-amm-pool/formSchema.ts" {
    import ScomNetworkPicker from '@scom/scom-network-picker';
    import ScomTokenInput from '@scom/scom-token-input';
    const _default_1: {
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
                            key: {
                                type: string;
                                required: boolean;
                            };
                            chainId: {
                                type: string;
                                enum: number[];
                                required: boolean;
                            };
                        };
                    };
                };
                dark: {
                    type: string;
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
                light: {
                    type: string;
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
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
                    } | {
                        type: string;
                        scope: string;
                        options?: undefined;
                    })[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
        customControls(rpcWalletId: string): {
            '#/properties/tokens/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => void;
            };
            '#/properties/tokens/properties/address': {
                render: () => ScomTokenInput;
                getData: (control: ScomTokenInput) => string;
                setData: (control: ScomTokenInput, value: string) => void;
            };
            '#/properties/providers/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => void;
            };
        };
    };
    export default _default_1;
    export function getProjectOwnerSchema(): {
        dataSchema: {
            type: string;
            properties: {
                mode: {
                    type: string;
                    required: boolean;
                    enum: string[];
                };
                dark: {
                    type: string;
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
                light: {
                    type: string;
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
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
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
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
    };
}
/// <amd-module name="@scom/scom-amm-pool" />
declare module "@scom/scom-amm-pool" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { INetworkConfig, IPoolConfig, IProviderUI, ModeType, ICommissionInfo, ICustomTokenObject } from "@scom/scom-amm-pool/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
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
        private state;
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
        private get chainId();
        private get rpcWallet();
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
        private resetRpcWallet;
        private setData;
        private refreshUI;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private getProjectOwnerActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getProxySelectors: () => Promise<string[]>;
            getDexProviderOptions: (chainId: number) => import("@scom/scom-dex-list").IDexInfo[];
            getPair: (market: string, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<string>;
            getActions: () => any[];
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
            getActions: (category?: string) => any;
            getData: any;
            setData: (data: IPoolConfig) => Promise<void>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getDexProviderOptions?: undefined;
            getPair?: undefined;
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
            getProxySelectors?: undefined;
            getDexProviderOptions?: undefined;
            getPair?: undefined;
            getActions?: undefined;
        })[];
        private initWallet;
        private updateBalance;
        private initializeWidgetConfig;
        init(): Promise<void>;
        removeRpcWalletEvents(): void;
        private connectWallet;
        onHide(): void;
        render(): any;
    }
}
