var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define("@scom/scom-amm-pool/global/utils/helper.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.limitDecimals = exports.limitInputNumber = exports.isInvalidInput = exports.formatNumberWithSeparators = exports.formatNumber = void 0;
    const formatNumber = (value, decimals) => {
        let val = value;
        const minValue = '0.0000001';
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_1.BigNumber(val).lt(minValue)) {
            return `<${minValue}`;
        }
        return (0, exports.formatNumberWithSeparators)(val, decimals || 4);
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                const unit = Math.pow(10, precision);
                const rounded = Math.floor(value * unit) / unit;
                outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substring(0, 18) + '...';
            }
            return outputStr;
        }
        return value.toLocaleString('en-US');
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    const isInvalidInput = (val) => {
        const value = new eth_wallet_1.BigNumber(val);
        if (value.lt(0))
            return true;
        return (val || '').toString().substring(0, 2) === '00' || val === '-';
    };
    exports.isInvalidInput = isInvalidInput;
    const limitInputNumber = (input, decimals) => {
        const amount = input.value;
        if ((0, exports.isInvalidInput)(amount)) {
            input.value = '0';
            return;
        }
        if (!new eth_wallet_1.BigNumber(amount).isNaN()) {
            input.value = (0, exports.limitDecimals)(amount, decimals || 18);
        }
    };
    exports.limitInputNumber = limitInputNumber;
    const limitDecimals = (value, decimals) => {
        let val = value;
        if (typeof value !== 'string') {
            val = val.toString();
        }
        let chart;
        if (val.includes('.')) {
            chart = '.';
        }
        else if (val.includes(',')) {
            chart = ',';
        }
        else {
            return value;
        }
        const parts = val.split(chart);
        let decimalsPart = parts[1];
        if (decimalsPart && decimalsPart.length > decimals) {
            parts[1] = decimalsPart.substr(0, decimals);
        }
        return parts.join(chart);
    };
    exports.limitDecimals = limitDecimals;
});
define("@scom/scom-amm-pool/global/utils/common.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = void 0;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
});
define("@scom/scom-amm-pool/global/utils/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-amm-pool/global/utils/index.ts", ["require", "exports", "@scom/scom-amm-pool/global/utils/helper.ts", "@scom/scom-amm-pool/global/utils/common.ts", "@scom/scom-amm-pool/global/utils/interface.ts"], function (require, exports, helper_1, common_1, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.isInvalidInput = exports.limitInputNumber = exports.limitDecimals = exports.formatNumberWithSeparators = exports.formatNumber = void 0;
    Object.defineProperty(exports, "formatNumber", { enumerable: true, get: function () { return helper_1.formatNumber; } });
    Object.defineProperty(exports, "formatNumberWithSeparators", { enumerable: true, get: function () { return helper_1.formatNumberWithSeparators; } });
    Object.defineProperty(exports, "limitDecimals", { enumerable: true, get: function () { return helper_1.limitDecimals; } });
    Object.defineProperty(exports, "limitInputNumber", { enumerable: true, get: function () { return helper_1.limitInputNumber; } });
    Object.defineProperty(exports, "isInvalidInput", { enumerable: true, get: function () { return helper_1.isInvalidInput; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return common_1.registerSendTxEvents; } });
    __exportStar(interface_1, exports);
});
define("@scom/scom-amm-pool/global/index.ts", ["require", "exports", "@scom/scom-amm-pool/global/utils/index.ts"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-amm-pool/global/index.ts'/> 
    __exportStar(index_1, exports);
});
define("@scom/scom-amm-pool/store/utils.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-network-list", "@ijstech/components"], function (require, exports, eth_wallet_3, scom_network_list_1, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClientWalletConnected = exports.State = void 0;
    class State {
        constructor(options) {
            this.slippageTolerance = 0.5;
            this.transactionDeadline = 30;
            this.infuraId = '';
            this.networkMap = {};
            this.dexInfoList = [];
            this.proxyAddresses = {};
            this.embedderCommissionFee = '0';
            this.rpcWalletId = '';
            this.getCommissionAmount = (commissions, amount) => {
                const _commissions = (commissions || []).filter(v => v.chainId == this.getChainId()).map(v => {
                    return {
                        to: v.walletAddress,
                        amount: amount.times(v.share)
                    };
                });
                const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_3.BigNumber(0);
                return commissionsAmount;
            };
            this.networkMap = (0, scom_network_list_1.default)();
            this.initData(options);
        }
        initData(options) {
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
            if (options.networks) {
                this.setNetworkList(options.networks, options.infuraId);
            }
            if (options.proxyAddresses) {
                this.proxyAddresses = options.proxyAddresses;
            }
            if (options.embedderCommissionFee) {
                this.embedderCommissionFee = options.embedderCommissionFee;
            }
        }
        initRpcWallet(defaultChainId) {
            var _a, _b, _c;
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_3.Wallet.getClientInstance();
            const networkList = Object.values(((_a = components_1.application.store) === null || _a === void 0 ? void 0 : _a.networkMap) || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: (_b = components_1.application.store) === null || _b === void 0 ? void 0 : _b.infuraId,
                multicalls: (_c = components_1.application.store) === null || _c === void 0 ? void 0 : _c.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_3.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            return instanceId;
        }
        getProxyAddress(chainId) {
            const _chainId = chainId || eth_wallet_3.Wallet.getInstance().chainId;
            const proxyAddresses = this.proxyAddresses;
            if (proxyAddresses) {
                return proxyAddresses[_chainId];
            }
            return null;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_3.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet === null || wallet === void 0 ? void 0 : wallet.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet === null || rpcWallet === void 0 ? void 0 : rpcWallet.chainId;
        }
        setDexInfoList(value) {
            this.dexInfoList = value;
        }
        getDexInfoList(options) {
            if (!options)
                return this.dexInfoList;
            const { key, chainId } = options;
            let dexList = this.dexInfoList;
            if (key) {
                dexList = dexList.filter(v => v.dexCode === key);
            }
            if (chainId) {
                dexList = dexList.filter(v => v.details.some(d => d.chainId === chainId));
            }
            return dexList;
        }
        getDexDetail(key, chainId) {
            for (const dex of this.dexInfoList) {
                if (dex.dexCode === key) {
                    const dexDetail = dex.details.find(v => v.chainId === chainId);
                    if (dexDetail) {
                        return dexDetail;
                    }
                }
            }
            return undefined;
        }
        setNetworkList(networkList, infuraId) {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            this.networkMap = {};
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
                if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                    }
                }
                this.networkMap[network.chainId] = Object.assign(Object.assign({}, networkInfo), network);
                wallet.setNetworkInfo(this.networkMap[network.chainId]);
            }
        }
        getCurrentCommissions(commissions) {
            return (commissions || []).filter(v => v.chainId == this.getChainId());
        }
        async setApprovalModelAction(options) {
            const approvalOptions = Object.assign(Object.assign({}, options), { spenderAddress: '' });
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_3.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
    }
    exports.State = State;
    function isClientWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        return wallet === null || wallet === void 0 ? void 0 : wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
});
define("@scom/scom-amm-pool/store/index.ts", ["require", "exports", "@scom/scom-token-list", "@scom/scom-amm-pool/store/utils.ts"], function (require, exports, scom_token_list_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSupportedTokens = exports.getWETH = void 0;
    __exportStar(utils_1, exports);
    const getWETH = (chainId) => {
        let wrappedToken = scom_token_list_1.WETHByChainId[chainId];
        return wrappedToken;
    };
    exports.getWETH = getWETH;
    const getSupportedTokens = (tokens, chainId) => {
        if (!tokens)
            return [];
        return tokens.filter(token => token.chainId === chainId).map(v => {
            var _a;
            const address = ((_a = v.address) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith('0x')) ? v.address.toLowerCase() : v.address;
            const tokenObj = scom_token_list_1.tokenStore.tokenMap[address];
            return Object.assign(Object.assign({}, v), tokenObj);
        });
    };
    exports.getSupportedTokens = getSupportedTokens;
});
define("@scom/scom-amm-pool/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poolStyle = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.poolStyle = components_2.Styles.style({
        $nest: {
            '.disabled': {
                opacity: '0.5',
                pointerEvents: 'none'
            },
            '.btn-swap': {
                background: Theme.background.gradient,
                borderRadius: '0.65rem',
                color: '#fff',
                fontSize: '1.125rem',
                opacity: 1,
                padding: '1.25rem 0.75rem',
                position: 'relative',
                width: '100%',
                margin: '0.3rem 0',
                $nest: {
                    '.loading-icon': {
                        width: '16px !important',
                        height: '16px !important',
                        marginLeft: '0.25rem',
                    },
                    '&.disabled': {
                        opacity: 0.7
                    }
                },
            },
            '.btn-max': {
                display: 'inline-block',
                padding: '0.1rem 0.5rem',
                lineHeight: '20px',
                borderRadius: '5px',
                color: '#fff',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                verticalAlign: 'center',
                marginLeft: '20px',
                background: Theme.background.gradient,
            },
            '.bg-transparent': {
                width: 'calc(100% - 150px) !important',
                $nest: {
                    'input': {
                        border: 'none',
                        fontSize: 20,
                        padding: 10
                    },
                    'input::placeholder': {
                        color: '#8D8FA3',
                    }
                }
            },
            '*': {
                boxSizing: 'border-box'
            },
            'i-icon, i-image': {
                display: 'inline-block'
            },
            'i-tabs .tabs-nav-wrap .tabs-nav': {
                width: '100%',
                flexWrap: 'wrap',
                borderBottom: 'none',
                $nest: {
                    'i-tab': {
                        justifyContent: 'center',
                        width: '50%',
                        minWidth: 150,
                        minHeight: 40,
                        color: Theme.text.primary,
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '4px solid transparent',
                        fontWeight: 'bold',
                        fontFamily: Theme.typography.fontFamily
                    },
                    'i-tab:not(.disabled).active': {
                        backgroundColor: 'transparent',
                        borderColor: '#f15e61',
                        color: '#f15e61',
                        $nest: {
                            'svg': {
                                fill: '#f15e61 !important'
                            }
                        }
                    }
                }
            },
            'i-scom-token-input': {
                $nest: {
                    '#gridTokenInput': {
                        padding: '0 !important',
                        background: 'transparent'
                    },
                    '#inputAmount': {
                        paddingInline: 12,
                        background: Theme.input.background
                    },
                    '#pnlTitle i-label': {
                        color: `${Theme.text.primary} !important`,
                        fontSize: '14px !important',
                        fontWeight: 'normal !important'
                    },
                    '#pnlBalance': {
                        marginBottom: '0 !important'
                    },
                    '#btnToken': {
                        paddingRight: '0 !important'
                    },
                    '#btnMax': {
                        background: Theme.background.gradient,
                        color: '#fff !important',
                        height: '1.5375rem !important'
                    }
                }
            },
            '#confirmSupplyModal': {
                $nest: {
                    '.modal': {
                        width: 480,
                        maxWidth: '95%',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem'
                    },
                    '.i-modal_header': {
                        marginBottom: '1.5rem',
                        paddingBottom: '0.5rem',
                        borderBottom: `2px solid ${Theme.background.default}`,
                        color: Theme.colors.primary.main,
                        fontSize: '1.25rem',
                        fontWeight: 700,
                    },
                    '.i-modal_header ~ i-icon': {
                        display: 'inline-block',
                        margin: '0.75rem 0',
                        background: Theme.colors.primary.main,
                        border: '2px solid transparent',
                        borderRadius: '50%',
                        padding: '0.25rem'
                    },
                    '.modal > * + *': {
                        marginTop: '1.5em'
                    }
                }
            },
            '@media screen and (max-width: 480px)': {
                $nest: {
                    '#pricePanel i-hstack i-label *': {
                        fontSize: '0.75rem',
                    }
                }
            }
        }
    });
});
define("@scom/scom-amm-pool/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/oswap-openswap-contract", "@scom/scom-commission-proxy-contract", "@scom/scom-amm-pool/store/index.ts"], function (require, exports, eth_wallet_4, oswap_openswap_contract_1, scom_commission_proxy_contract_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPair = exports.getProviderProxySelectors = exports.getTokensBackByAmountOut = exports.getTokensBack = exports.removeLiquidity = exports.getRemoveLiquidityInfo = exports.getPairFromTokens = exports.calculateNewPairShareInfo = exports.addLiquidity = exports.getPricesInfo = exports.getNewShareInfo = exports.getRouterAddress = exports.ERC20MaxAmount = void 0;
    exports.ERC20MaxAmount = new eth_wallet_4.BigNumber(2).pow(256).minus(1);
    function getDexDetailItem(state, chainId) {
        const dexInfoList = state.getDexInfoList();
        for (const dex of dexInfoList) {
            const dexDetail = dex.details.find(v => v.chainId === chainId);
            if (dexDetail) {
                return dexDetail;
            }
        }
        return undefined;
    }
    function getRouterAddress(state, chainId) {
        const dexItem = getDexDetailItem(state, chainId);
        return (dexItem === null || dexItem === void 0 ? void 0 : dexItem.routerAddress) || '';
    }
    exports.getRouterAddress = getRouterAddress;
    function getFactoryAddress(state, chainId) {
        const dexItem = getDexDetailItem(state, chainId);
        return (dexItem === null || dexItem === void 0 ? void 0 : dexItem.factoryAddress) || '';
    }
    const MINIMUM_LIQUIDITY = 10 ** 3;
    const FEE_BASE = 10 ** 5;
    const mintFee = async (factory, pair, totalSupply, reserve0, reserve1) => {
        let protocolFeeParams = await factory.protocolFeeParams();
        let protocolFee = new eth_wallet_4.BigNumber(protocolFeeParams.protocolFee);
        let protocolFeeTo = protocolFeeParams.protocolFeeTo;
        if (protocolFeeTo != eth_wallet_4.Utils.nullAddress) {
            let kLast = await pair.kLast();
            if (!kLast.eq(0)) {
                let rootK = reserve0.times(reserve1).sqrt().decimalPlaces(0, eth_wallet_4.BigNumber.ROUND_FLOOR);
                let rootKLast = new eth_wallet_4.BigNumber(kLast).sqrt().decimalPlaces(0, eth_wallet_4.BigNumber.ROUND_FLOOR);
                if (rootK.gt(rootKLast)) {
                    let numerator = new eth_wallet_4.BigNumber(totalSupply).times(rootK.minus(rootKLast)).times(protocolFee);
                    let denominator = new eth_wallet_4.BigNumber(FEE_BASE).minus(protocolFee).times(rootK).plus(new eth_wallet_4.BigNumber(rootKLast).times(protocolFee));
                    let liquidity = numerator.idiv(denominator);
                    totalSupply = totalSupply.plus(liquidity);
                }
            }
        }
        return totalSupply;
    };
    const poolTokenMinted = async (factory, amountInA, amountInB, pair, totalSupply, reserve0, reserve1) => {
        totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);
        let liquidity;
        if (totalSupply.eq(0)) {
            liquidity = amountInA.times(amountInB).sqrt().decimalPlaces(0, eth_wallet_4.BigNumber.ROUND_FLOOR).minus(MINIMUM_LIQUIDITY);
        }
        else {
            liquidity = eth_wallet_4.BigNumber.min(amountInA.times(totalSupply).idiv(reserve0), amountInB.times(totalSupply).idiv(reserve1));
        }
        return liquidity;
    };
    const getPrices = async (state, tokenA, tokenB) => {
        const WETH = (0, index_2.getWETH)(state.getChainId());
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        let pair = await getPairFromTokens(state, tokenA, tokenB);
        if (!pair)
            return null;
        let reserves = await getReserves(pair, tokenA, tokenB);
        if (!reserves) {
            return {
                pair
            };
        }
        let reserveA = eth_wallet_4.Utils.fromDecimals(reserves.reserveA, tokenA.decimals);
        let reserveB = eth_wallet_4.Utils.fromDecimals(reserves.reserveB, tokenB.decimals);
        if (reserveA.eq(0)) {
            return {
                pair,
                reserveA,
                reserveB
            };
        }
        let price0 = reserveB.div(reserveA).toFixed();
        let price1 = reserveA.div(reserveB).toFixed();
        let pricesObj = {
            pair,
            reserveA,
            reserveB,
            price0,
            price1
        };
        return pricesObj;
    };
    const getUserShare = async (state, pairTokenInfo) => {
        const wallet = state.getRpcWallet();
        let chainId = state.getChainId();
        let { pair, tokenA, tokenB, balance } = pairTokenInfo;
        if (!pair) {
            let pairFromTokens = await getPairFromTokens(state, tokenA, tokenB);
            if (!pairFromTokens)
                return null;
            pair = pairFromTokens;
        }
        if (!balance) {
            balance = (await pair.balanceOf(wallet.address)).toFixed();
        }
        const WETH = (0, index_2.getWETH)(chainId);
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        let totalSupply = await pair.totalSupply();
        let reserve = await pair.getReserves();
        let reserve0;
        let reserve1;
        if (new eth_wallet_4.BigNumber(tokenA.address.toLowerCase()).lt(tokenB.address.toLowerCase())) {
            reserve0 = reserve.reserve0;
            reserve1 = reserve.reserve1;
        }
        else {
            reserve0 = reserve.reserve1;
            reserve1 = reserve.reserve0;
        }
        let share = new eth_wallet_4.BigNumber(balance).div(totalSupply);
        let result = {
            tokenAShare: eth_wallet_4.Utils.fromDecimals(share.times(reserve0), tokenA.decimals).toFixed(),
            tokenBShare: eth_wallet_4.Utils.fromDecimals(share.times(reserve1), tokenB.decimals).toFixed(),
            totalPoolTokens: eth_wallet_4.Utils.fromDecimals(balance).toFixed(),
            poolShare: share.toFixed()
        };
        return result;
    };
    const getRemoveLiquidityInfo = async (state, tokenA, tokenB) => {
        let userShare = await getUserShare(state, {
            tokenA,
            tokenB
        });
        if (!userShare)
            return null;
        let pricesData = await getPrices(state, tokenA, tokenB);
        if (!pricesData)
            return null;
        let lpToken = {
            address: pricesData.pair.address,
            decimals: 18,
            symbol: 'LP',
            name: 'LP',
            chainId: 0
        };
        return Object.assign(Object.assign({}, userShare), { lpToken, price0: pricesData.price0, price1: pricesData.price1 });
    };
    exports.getRemoveLiquidityInfo = getRemoveLiquidityInfo;
    const getPairFromTokens = async (state, tokenA, tokenB) => {
        let wallet = state.getRpcWallet();
        let chainId = state.getChainId();
        const factoryAddress = getFactoryAddress(state, chainId);
        const factory = new oswap_openswap_contract_1.Contracts.OSWAP_Factory(wallet, factoryAddress);
        let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
        if (!pairAddress || pairAddress == eth_wallet_4.Utils.nullAddress) {
            return null;
        }
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
        return pair;
    };
    exports.getPairFromTokens = getPairFromTokens;
    const getReserves = async (pair, tokenA, tokenB) => {
        let reserveObj;
        let reserve = await pair.getReserves();
        if (new eth_wallet_4.BigNumber(tokenA.address.toLowerCase()).lt(tokenB.address.toLowerCase())) {
            reserveObj = {
                reserveA: reserve.reserve0,
                reserveB: reserve.reserve1
            };
        }
        else {
            reserveObj = {
                reserveA: reserve.reserve1,
                reserveB: reserve.reserve0
            };
        }
        return reserveObj;
    };
    const getPricesInfo = async (state, tokenA, tokenB) => {
        let pricesData = await getPrices(state, tokenA, tokenB);
        if (!pricesData)
            return null;
        let { pair, price0, price1 } = pricesData;
        let wallet = state.getRpcWallet();
        let balance = await pair.balanceOf(wallet.address);
        let totalSupply = await pair.totalSupply();
        return {
            pair,
            price0,
            price1,
            balance: eth_wallet_4.Utils.fromDecimals(balance).toFixed(),
            totalSupply: eth_wallet_4.Utils.fromDecimals(totalSupply).toFixed()
        };
    };
    exports.getPricesInfo = getPricesInfo;
    const calculateNewPairShareInfo = (tokenA, tokenB, amountADesired, amountBDesired) => {
        let price0 = new eth_wallet_4.BigNumber(amountBDesired).div(amountADesired).toFixed();
        let price1 = new eth_wallet_4.BigNumber(amountADesired).div(amountBDesired).toFixed();
        let amountADesiredToDecimals = eth_wallet_4.Utils.toDecimals(amountADesired, tokenA.decimals);
        let amountBDesiredToDecimals = eth_wallet_4.Utils.toDecimals(amountBDesired, tokenB.decimals);
        let minted = amountADesiredToDecimals.times(amountBDesiredToDecimals).sqrt().decimalPlaces(0, eth_wallet_4.BigNumber.ROUND_FLOOR).minus(MINIMUM_LIQUIDITY);
        return {
            price0,
            price1,
            minted: eth_wallet_4.Utils.fromDecimals(minted).toFixed()
        };
    };
    exports.calculateNewPairShareInfo = calculateNewPairShareInfo;
    const getNewShareInfo = async (state, tokenA, tokenB, amountIn, amountADesired, amountBDesired) => {
        let wallet = state.getRpcWallet();
        let chainId = state.getChainId();
        const WETH = (0, index_2.getWETH)(chainId);
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        let pair = await getPairFromTokens(state, tokenA, tokenB);
        if (!pair)
            return null;
        let reserves = await getReserves(pair, tokenA, tokenB);
        if (!reserves)
            return null;
        if (reserves.reserveA.eq(0)) {
            return null;
        }
        let balance = await pair.balanceOf(wallet.address);
        let totalSupply = await pair.totalSupply();
        let quote = eth_wallet_4.Utils.fromDecimals(reserves.reserveB, tokenB.decimals).times(amountIn).div(eth_wallet_4.Utils.fromDecimals(reserves.reserveA, tokenA.decimals)).toFixed();
        let amountADesiredToDecimals = eth_wallet_4.Utils.toDecimals(amountADesired, tokenA.decimals);
        let amountBDesiredToDecimals = eth_wallet_4.Utils.toDecimals(amountBDesired, tokenB.decimals);
        const factoryAddress = getFactoryAddress(state, chainId);
        const factory = new oswap_openswap_contract_1.Contracts.OSWAP_Factory(wallet, factoryAddress);
        let newPrice0 = eth_wallet_4.Utils.fromDecimals(reserves.reserveB.plus(amountBDesiredToDecimals), tokenB.decimals).div(eth_wallet_4.Utils.fromDecimals(reserves.reserveA.plus(amountADesiredToDecimals), tokenA.decimals)).toFixed();
        let newPrice1 = eth_wallet_4.Utils.fromDecimals(reserves.reserveA.plus(amountADesiredToDecimals), tokenA.decimals).div(eth_wallet_4.Utils.fromDecimals(reserves.reserveB.plus(amountBDesiredToDecimals), tokenB.decimals)).toFixed();
        let minted = await poolTokenMinted(factory, amountADesiredToDecimals, amountBDesiredToDecimals, pair, totalSupply, reserves.reserveA, reserves.reserveB);
        let newShare = minted.plus(balance).div(minted.plus(totalSupply)).toFixed();
        return {
            quote,
            newPrice0,
            newPrice1,
            newShare,
            minted: eth_wallet_4.Utils.fromDecimals(minted).toFixed()
        };
    };
    exports.getNewShareInfo = getNewShareInfo;
    const addLiquidity = async (state, tokenA, tokenB, amountADesired, amountBDesired, commissions) => {
        let receipt;
        try {
            const wallet = eth_wallet_4.Wallet.getClientInstance();
            let chainId = state.getChainId();
            const toAddress = wallet.address;
            const slippageTolerance = state.slippageTolerance;
            const amountAMin = new eth_wallet_4.BigNumber(amountADesired).times(1 - slippageTolerance / 100).toFixed();
            const amountBMin = new eth_wallet_4.BigNumber(amountBDesired).times(1 - slippageTolerance / 100).toFixed();
            const deadline = Math.floor(Date.now() / 1000 + state.transactionDeadline * 60);
            const routerAddress = getRouterAddress(state, chainId);
            let router = new oswap_openswap_contract_1.Contracts.OSWAP_Router(wallet, routerAddress);
            const proxyAddress = state.getProxyAddress();
            const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
            const _commissions = (commissions || []).filter(v => v.chainId == state.getChainId());
            if (!tokenA.address || !tokenB.address) {
                let erc20Token, amountTokenDesired, amountETHDesired, amountTokenMin, amountETHMin;
                if (tokenA.address) {
                    erc20Token = tokenA;
                    amountTokenDesired = amountADesired;
                    amountETHDesired = amountBDesired;
                    amountTokenMin = amountAMin;
                    amountETHMin = amountBMin;
                }
                else {
                    erc20Token = tokenB;
                    amountTokenDesired = amountBDesired;
                    amountETHDesired = amountADesired;
                    amountTokenMin = amountBMin;
                    amountETHMin = amountAMin;
                }
                const amountToken = eth_wallet_4.Utils.toDecimals(amountTokenDesired, erc20Token.decimals).dp(0);
                const amountETH = eth_wallet_4.Utils.toDecimals(amountETHDesired).dp(0);
                if (_commissions.length) {
                    const commissionsToken = _commissions.map(v => {
                        return {
                            to: v.walletAddress,
                            amount: amountToken.times(v.share).dp(0)
                        };
                    });
                    const commissionsETH = _commissions.map(v => {
                        return {
                            to: v.walletAddress,
                            amount: amountETH.times(v.share).dp(0)
                        };
                    });
                    const commissionsAmountToken = commissionsToken.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
                    const commissionsAmountETH = commissionsETH.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
                    const tokensIn = [
                        {
                            token: erc20Token.address,
                            amount: amountToken.plus(commissionsAmountToken),
                            directTransfer: false,
                            commissions: commissionsToken
                        },
                        {
                            token: eth_wallet_4.Utils.nullAddress,
                            amount: amountETH.plus(commissionsAmountETH),
                            directTransfer: false,
                            commissions: commissionsETH
                        }
                    ];
                    const txData = await router.addLiquidityETH.txData({
                        token: erc20Token.address,
                        amountTokenDesired: amountToken,
                        amountTokenMin: eth_wallet_4.Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
                        amountETHMin: eth_wallet_4.Utils.toDecimals(amountETHMin).dp(0),
                        to: toAddress,
                        deadline
                    }, amountETH);
                    receipt = await proxy.proxyCall({
                        target: routerAddress,
                        tokensIn,
                        data: txData,
                        to: wallet.address,
                        tokensOut: []
                    }, amountETH.plus(commissionsAmountETH));
                }
                else {
                    receipt = await router.addLiquidityETH({
                        token: erc20Token.address,
                        amountTokenDesired: amountToken,
                        amountTokenMin: eth_wallet_4.Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
                        amountETHMin: eth_wallet_4.Utils.toDecimals(amountETHMin).dp(0),
                        to: toAddress,
                        deadline
                    }, amountETH);
                }
            }
            else {
                const amountTokenA = eth_wallet_4.Utils.toDecimals(amountADesired, tokenA.decimals).dp(0);
                const amountTokenB = eth_wallet_4.Utils.toDecimals(amountBDesired, tokenB.decimals).dp(0);
                if (_commissions.length) {
                    const commissionsTokenA = _commissions.map(v => {
                        return {
                            to: v.walletAddress,
                            amount: amountTokenA.times(v.share).dp(0)
                        };
                    });
                    const commissionsTokenB = _commissions.map(v => {
                        return {
                            to: v.walletAddress,
                            amount: amountTokenB.times(v.share).dp(0)
                        };
                    });
                    const commissionsAmountTokenA = commissionsTokenA.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
                    const commissionsAmountTokenB = commissionsTokenB.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
                    const tokensIn = [
                        {
                            token: tokenA.address,
                            amount: amountTokenA.plus(commissionsAmountTokenA),
                            directTransfer: false,
                            commissions: commissionsTokenA
                        },
                        {
                            token: tokenB.address,
                            amount: amountTokenB.plus(commissionsAmountTokenB),
                            directTransfer: false,
                            commissions: commissionsTokenB
                        }
                    ];
                    const txData = await router.addLiquidity.txData({
                        tokenA: tokenA.address,
                        tokenB: tokenB.address,
                        amountADesired: amountTokenA,
                        amountBDesired: amountTokenB,
                        amountAMin: eth_wallet_4.Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
                        amountBMin: eth_wallet_4.Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
                        to: toAddress,
                        deadline
                    });
                    receipt = await proxy.proxyCall({
                        target: routerAddress,
                        tokensIn,
                        data: txData,
                        to: wallet.address,
                        tokensOut: []
                    });
                }
                else {
                    receipt = await router.addLiquidity({
                        tokenA: tokenA.address,
                        tokenB: tokenB.address,
                        amountADesired: amountTokenA,
                        amountBDesired: amountTokenB,
                        amountAMin: eth_wallet_4.Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
                        amountBMin: eth_wallet_4.Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
                        to: toAddress,
                        deadline
                    });
                }
            }
        }
        catch (err) {
            console.log('err', err);
        }
        return receipt;
    };
    exports.addLiquidity = addLiquidity;
    const removeLiquidity = async (state, tokenA, tokenB, liquidity, amountADesired, amountBDesired) => {
        let receipt;
        try {
            const wallet = eth_wallet_4.Wallet.getClientInstance();
            let chainId = state.getChainId();
            const toAddress = wallet.address;
            const slippageTolerance = state.slippageTolerance;
            const amountAMin = new eth_wallet_4.BigNumber(amountADesired).times(1 - slippageTolerance / 100).toFixed();
            const amountBMin = new eth_wallet_4.BigNumber(amountBDesired).times(1 - slippageTolerance / 100).toFixed();
            const deadline = Math.floor(Date.now() / 1000 + state.transactionDeadline * 60);
            const routerAddress = getRouterAddress(state, chainId);
            let router = new oswap_openswap_contract_1.Contracts.OSWAP_Router(wallet, routerAddress);
            if (!tokenA.address || !tokenB.address) {
                let erc20Token, amountTokenMin, amountETHMin;
                if (tokenA.address) {
                    erc20Token = tokenA;
                    amountTokenMin = amountAMin;
                    amountETHMin = amountBMin;
                }
                else {
                    erc20Token = tokenB;
                    amountTokenMin = amountBMin;
                    amountETHMin = amountAMin;
                }
                receipt = await router.removeLiquidityETH({
                    token: erc20Token.address,
                    liquidity: eth_wallet_4.Utils.toDecimals(liquidity).dp(0),
                    amountTokenMin: eth_wallet_4.Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
                    amountETHMin: eth_wallet_4.Utils.toDecimals(amountETHMin).dp(0),
                    to: toAddress,
                    deadline
                });
            }
            else {
                receipt = await router.removeLiquidity({
                    tokenA: tokenA.address,
                    tokenB: tokenB.address,
                    liquidity: eth_wallet_4.Utils.toDecimals(liquidity).dp(0),
                    amountAMin: eth_wallet_4.Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
                    amountBMin: eth_wallet_4.Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
                    to: toAddress,
                    deadline
                });
            }
        }
        catch (err) {
            console.log('err', err);
        }
        return receipt;
    };
    exports.removeLiquidity = removeLiquidity;
    const getPairAddressFromTokens = async (state, factory, tokenA, tokenB) => {
        let chainId = state.getChainId();
        const WETH = (0, index_2.getWETH)(chainId);
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        let pairAddress = await factory.getPair({
            param1: tokenA.address,
            param2: tokenB.address
        });
        if (!pairAddress || pairAddress == eth_wallet_4.Utils.nullAddress) {
            return null;
        }
        return pairAddress;
    };
    const getTokensBack = async (state, tokenA, tokenB, liquidity) => {
        let wallet = state.getRpcWallet();
        let chainId = state.getChainId();
        const WETH = (0, index_2.getWETH)(chainId);
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        const factoryAddress = getFactoryAddress(state, chainId);
        const factory = new oswap_openswap_contract_1.Contracts.OSWAP_Factory(wallet, factoryAddress);
        let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
        if (!pairAddress || pairAddress == eth_wallet_4.Utils.nullAddress) {
            return null;
        }
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
        let balance = await pair.balanceOf(wallet.address);
        let totalSupply = await pair.totalSupply();
        let reserve = await pair.getReserves();
        let liquidityToDecimals = eth_wallet_4.Utils.toDecimals(liquidity);
        let reserve0;
        let reserve1;
        if (new eth_wallet_4.BigNumber(tokenA.address.toLowerCase()).lt(tokenB.address.toLowerCase())) {
            reserve0 = reserve.reserve0;
            reserve1 = reserve.reserve1;
        }
        else {
            reserve0 = reserve.reserve1;
            reserve1 = reserve.reserve0;
        }
        totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);
        let erc20A = new oswap_openswap_contract_1.Contracts.ERC20(wallet, tokenA.address);
        let erc20B = new oswap_openswap_contract_1.Contracts.ERC20(wallet, tokenB.address);
        let balanceA = await erc20A.balanceOf(pair.address);
        let balanceB = await erc20B.balanceOf(pair.address);
        let amountA = eth_wallet_4.Utils.fromDecimals(liquidityToDecimals.times(balanceA).idiv(totalSupply), tokenA.decimals);
        let amountB = eth_wallet_4.Utils.fromDecimals(liquidityToDecimals.times(balanceB).idiv(totalSupply), tokenB.decimals);
        let percent = liquidityToDecimals.div(balance).times(100).toFixed();
        let newshare = new eth_wallet_4.BigNumber(balance).minus(liquidity).div(new eth_wallet_4.BigNumber(totalSupply).minus(liquidity)).toFixed();
        let result = {
            amountA: amountA.toFixed(),
            amountB: amountB.toFixed(),
            [tokenA.symbol]: amountA.toFixed(),
            [tokenB.symbol]: amountB.toFixed(),
            liquidity: liquidity,
            percent: percent,
            newshare: newshare
        };
        return result;
    };
    exports.getTokensBack = getTokensBack;
    const getTokensBackByAmountOut = async (state, tokenA, tokenB, tokenOut, amountOut) => {
        let wallet = state.getRpcWallet();
        let chainId = state.getChainId();
        const WETH = (0, index_2.getWETH)(chainId);
        if (!tokenA.address)
            tokenA = WETH;
        if (!tokenB.address)
            tokenB = WETH;
        if (!tokenOut.address)
            tokenOut = WETH;
        const factoryAddress = getFactoryAddress(state, chainId);
        const factory = new oswap_openswap_contract_1.Contracts.OSWAP_Factory(wallet, factoryAddress);
        let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
        if (!pairAddress || pairAddress == eth_wallet_4.Utils.nullAddress) {
            return null;
        }
        let pair = new oswap_openswap_contract_1.Contracts.OSWAP_Pair(wallet, pairAddress);
        let totalSupply = await pair.totalSupply();
        let reserve = await pair.getReserves();
        let reserve0;
        let reserve1;
        if (new eth_wallet_4.BigNumber(tokenA.address.toLowerCase()).lt(tokenB.address.toLowerCase())) {
            reserve0 = reserve.reserve0;
            reserve1 = reserve.reserve1;
        }
        else {
            reserve0 = reserve.reserve1;
            reserve1 = reserve.reserve0;
        }
        totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);
        let liquidityInDecimals;
        if (tokenA.address == tokenOut.address) {
            let erc20A = new oswap_openswap_contract_1.Contracts.ERC20(wallet, tokenA.address);
            let balanceA = await erc20A.balanceOf(pair.address);
            liquidityInDecimals = eth_wallet_4.Utils.toDecimals(amountOut, tokenOut.decimals).times(totalSupply).idiv(balanceA).plus(1);
        }
        else {
            let erc20B = new oswap_openswap_contract_1.Contracts.ERC20(wallet, tokenB.address);
            let balanceB = await erc20B.balanceOf(pair.address);
            liquidityInDecimals = eth_wallet_4.Utils.toDecimals(amountOut, tokenOut.decimals).times(totalSupply).idiv(balanceB).plus(1);
        }
        let liquidity = eth_wallet_4.Utils.fromDecimals(liquidityInDecimals).toFixed();
        let tokensBack = await getTokensBack(state, tokenA, tokenB, liquidity);
        return tokensBack;
    };
    exports.getTokensBackByAmountOut = getTokensBackByAmountOut;
    const getProviderProxySelectors = async (state, providers) => {
        var _a;
        const wallet = state.getRpcWallet();
        await wallet.init();
        let selectorsSet = new Set();
        const permittedProxyFunctions = [
            "addLiquidity",
            "addLiquidityETH",
            "removeLiquidity",
            "removeLiquidityETH"
        ];
        for (let provider of providers) {
            const dex = state.getDexInfoList({ key: provider.key, chainId: provider.chainId })[0];
            if (dex) {
                const routerAddress = ((_a = dex.details.find(v => v.chainId === provider.chainId)) === null || _a === void 0 ? void 0 : _a.routerAddress) || '';
                const router = new oswap_openswap_contract_1.Contracts.OSWAP_Router(wallet, routerAddress);
                const selectors = permittedProxyFunctions
                    .map(e => e + "(" + router._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")")
                    .map(e => wallet.soliditySha3(e).substring(0, 10))
                    .map(e => router.address.toLowerCase() + e.replace("0x", ""));
                selectors.forEach(v => selectorsSet.add(v));
            }
        }
        return Array.from(selectorsSet);
    };
    exports.getProviderProxySelectors = getProviderProxySelectors;
    const getPair = async (state, market, tokenA, tokenB) => {
        var _a;
        const wallet = state.getRpcWallet();
        const factoryAddress = ((_a = state.getDexDetail(market, state.getChainId())) === null || _a === void 0 ? void 0 : _a.factoryAddress) || '';
        const factory = new oswap_openswap_contract_1.Contracts.OSWAP_Factory(wallet, factoryAddress);
        let pair = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
        return pair;
    };
    exports.getPair = getPair;
});
define("@scom/scom-amm-pool/liquidity/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poolRemoveStyle = exports.poolAddStyle = void 0;
    exports.poolAddStyle = components_3.Styles.style({
        $nest: {
            'i-scom-token-input': {
                $nest: {
                    '#gridTokenInput': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4
                    },
                    '#inputAmount': {
                        width: 'calc(100% - 180px) !important',
                        minWidth: 100,
                        height: '36px !important'
                    },
                    '#pnlSelection': {
                        width: 'auto !important',
                        marginLeft: 'auto'
                    }
                }
            }
        }
    });
    exports.poolRemoveStyle = components_3.Styles.style({
        $nest: {
            'i-scom-token-input': {
                $nest: {
                    '#gridTokenInput': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4
                    },
                    '#inputAmount': {
                        width: 'calc(100% - 150px) !important',
                        minWidth: 100,
                        height: '36px !important'
                    },
                    '#pnlSelection': {
                        width: 'auto !important',
                        marginLeft: 'auto'
                    }
                }
            }
        }
    });
});
define("@scom/scom-amm-pool/liquidity/add.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-amm-pool/global/index.ts", "@ijstech/eth-wallet", "@scom/scom-amm-pool/store/index.ts", "@scom/scom-amm-pool/API.ts", "@scom/scom-token-list", "@scom/scom-amm-pool/liquidity/index.css.ts"], function (require, exports, components_4, index_3, eth_wallet_5, index_4, API_1, scom_token_list_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomAmmPoolAdd = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomAmmPoolAdd = class ScomAmmPoolAdd extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.firstBalance = '0';
            this.secondBalance = '0';
            this.firstInputAmount = '';
            this.secondInputAmount = '';
            this._data = {
                providers: [],
                tokens: [],
            };
            this.isInited = false;
            this.tag = {};
            this.onWalletConnected = async (connected) => {
                var _a, _b;
                // if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
                //   this.onChainChange();
                // } else {
                //   this.updateContractAddress();
                //   if (this.originalData?.providers?.length) await this.onSetupPage(connected);
                // }
                this.updateContractAddress();
                if ((_b = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.length)
                    await this.initializeWidgetConfig(connected);
            };
            this.onChainChange = async () => {
                var _a, _b;
                this.updateContractAddress();
                if ((_b = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.length)
                    await this.initializeWidgetConfig(true);
                this.updateButtonText();
            };
            this.updateContractAddress = () => {
                var _a;
                if (this.state.getCurrentCommissions(this.commissions).length) {
                    this.contractAddress = this.state.getProxyAddress();
                }
                else {
                    this.contractAddress = (0, API_1.getRouterAddress)(this.state, this.state.getChainId());
                }
                if (((_a = this.state) === null || _a === void 0 ? void 0 : _a.approvalModel) && this.approvalModelAction) {
                    this.state.approvalModel.spenderAddress = this.contractAddress;
                    this.updateCommissionInfo();
                }
            };
            this.updateCommissionInfo = () => {
                if (this.state.getCurrentCommissions(this.commissions).length) {
                    this.hStackCommissionInfo.visible = true;
                    const commissionFee = this.state.embedderCommissionFee;
                    this.iconCommissionFee.tooltip.content = `A commission fee of ${new eth_wallet_5.BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
                    if (this.firstToken && this.secondToken) {
                        const firstAmount = new eth_wallet_5.BigNumber(this.firstInputAmount || 0);
                        const secondAmount = new eth_wallet_5.BigNumber(this.secondInputAmount || 0);
                        const firstCommission = this.state.getCommissionAmount(this.commissions, firstAmount);
                        const secondCommission = this.state.getCommissionAmount(this.commissions, secondAmount);
                        this.lbFirstCommission.caption = `${(0, index_3.formatNumber)(firstAmount.plus(firstCommission))} ${this.firstToken.symbol || ''}`;
                        this.lbSecondCommission.caption = `${(0, index_3.formatNumber)(secondAmount.plus(secondCommission))} ${this.secondToken.symbol || ''}`;
                        this.hStackCommissionInfo.visible = true;
                    }
                    else {
                        this.hStackCommissionInfo.visible = false;
                    }
                }
                else {
                    this.hStackCommissionInfo.visible = false;
                }
            };
            this.initializeWidgetConfig = async (connected, _chainId) => {
                setTimeout(async () => {
                    const chainId = this.state.getChainId();
                    if (!this.btnSupply.isConnected)
                        await this.btnSupply.ready();
                    if (!this.firstTokenInput.isConnected)
                        await this.firstTokenInput.ready();
                    if (!this.secondTokenInput.isConnected)
                        await this.secondTokenInput.ready();
                    this.resetFirstInput();
                    this.resetSecondInput();
                    this.updateCommissionInfo();
                    this.firstTokenInput.isBtnMaxShown = true;
                    this.secondTokenInput.isBtnMaxShown = true;
                    const tokens = (0, index_4.getSupportedTokens)(this._data.tokens || [], chainId);
                    const isReadonly = tokens.length === 2;
                    this.firstTokenInput.tokenReadOnly = isReadonly;
                    this.secondTokenInput.tokenReadOnly = isReadonly;
                    this.firstTokenInput.tokenDataListProp = tokens;
                    this.secondTokenInput.tokenDataListProp = tokens;
                    this.setFixedPairData();
                    if (connected) {
                        try {
                            this.updateButtonText();
                            await this.updateBalance();
                            if (this.firstToken && this.secondToken) {
                                if (!this.lbFirstPriceTitle.isConnected)
                                    await this.lbFirstPriceTitle.ready();
                                this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
                                if (!this.lbSecondPriceTitle.isConnected)
                                    await this.lbSecondPriceTitle.ready();
                                this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
                            }
                            const isShown = parseFloat(this.firstBalance) > 0 && parseFloat(this.secondBalance) > 0;
                            this.pricePanel.visible = isShown;
                            await this.checkPairExists();
                            if (tokens.length >= 2 && new eth_wallet_5.BigNumber(this.firstTokenInput.value).isNaN() && new eth_wallet_5.BigNumber(this.firstTokenInput.value).isNaN()) {
                                this.updateCommissionInfo();
                                return;
                            }
                            await this.callAPIBundle(false);
                        }
                        catch (_a) {
                            this.btnSupply.caption = 'Supply';
                        }
                    }
                    else {
                        this.resetData();
                    }
                    this.updateCommissionInfo();
                });
            };
            this.showTxStatusModal = (status, content) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                this.txStatusModal.message = Object.assign({}, params);
                this.txStatusModal.showModal();
            };
            if (options === null || options === void 0 ? void 0 : options.state) {
                this.state = options.state;
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get firstTokenDecimals() {
            var _a;
            return ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.decimals) || 18;
        }
        get secondTokenDecimals() {
            var _a;
            return ((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.decimals) || 18;
        }
        get firstTokenSymbol() {
            var _a;
            return ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol) || '';
        }
        get secondTokenSymbol() {
            var _a;
            return ((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.symbol) || '';
        }
        get providers() {
            return this._data.providers;
        }
        set providers(value) {
            this._data.providers = value;
        }
        get commissions() {
            var _a;
            return (_a = this._data.commissions) !== null && _a !== void 0 ? _a : [];
        }
        set commissions(value) {
            this._data.commissions = value;
        }
        get originalData() {
            if (!this._data)
                return undefined;
            const { providers } = this._data;
            if (!(providers === null || providers === void 0 ? void 0 : providers.length))
                return undefined;
            let _providers = [];
            let providersByKeys = {};
            providers.forEach(v => {
                if (!providersByKeys[v.key]) {
                    providersByKeys[v.key] = [];
                }
                providersByKeys[v.key].push(v);
            });
            Object.keys(providersByKeys).forEach(k => {
                const arr = providersByKeys[k];
                const { key } = arr[0];
                let defaultProvider = {
                    key
                };
                _providers.push(defaultProvider);
            });
            return { providers: _providers };
        }
        async setData(data) {
            this._data = data;
            this.updateContractAddress();
            await this.refreshUI();
        }
        async refreshUI() {
            var _a;
            await this.initData();
            const instanceId = (_a = this.state.getRpcWallet()) === null || _a === void 0 ? void 0 : _a.instanceId;
            const inputRpcWalletId = this.firstTokenInput.rpcWalletId;
            if (instanceId && inputRpcWalletId !== instanceId) {
                this.firstTokenInput.rpcWalletId = instanceId;
                this.secondTokenInput.rpcWalletId = instanceId;
            }
            await this.initializeWidgetConfig((0, index_4.isClientWalletConnected)());
        }
        setFixedPairData() {
            var _a;
            const chainId = this.state.getChainId();
            let currentChainTokens = this._data.tokens.filter((token) => token.chainId === chainId);
            if (currentChainTokens.length < 2)
                return;
            const providers = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers;
            if (providers && providers.length) {
                const fromTokenAddress = currentChainTokens[0].address || currentChainTokens[0].symbol;
                const toTokenAddress = currentChainTokens[1].address || currentChainTokens[1].symbol;
                const fromToken = (fromTokenAddress === null || fromTokenAddress === void 0 ? void 0 : fromTokenAddress.toLowerCase().startsWith('0x')) ? fromTokenAddress.toLowerCase() : fromTokenAddress;
                const toToken = (toTokenAddress === null || toTokenAddress === void 0 ? void 0 : toTokenAddress.toLowerCase().startsWith('0x')) ? toTokenAddress.toLowerCase() : toTokenAddress;
                this.firstToken = scom_token_list_2.tokenStore.tokenMap[fromToken];
                this.secondToken = scom_token_list_2.tokenStore.tokenMap[toToken];
                this.onUpdateToken(this.firstToken, true);
                this.onUpdateToken(this.secondToken, false);
                this.firstTokenInput.token = this.firstToken;
                this.secondTokenInput.token = this.secondToken;
            }
        }
        async initTokenSelection() {
            if (this.isInited)
                return;
            await this.firstTokenInput.ready();
            await this.secondTokenInput.ready();
            this.firstTokenInput.tokenReadOnly = false;
            this.firstTokenInput.onSelectToken = (token) => this.onSelectToken(token, true);
            this.firstTokenInput.onSetMaxBalance = () => this.setMaxBalance(true);
            this.firstTokenInput.isCommonShown = false;
            this.secondTokenInput.tokenReadOnly = false;
            this.secondTokenInput.onSelectToken = (token) => this.onSelectToken(token, false);
            this.secondTokenInput.onSetMaxBalance = () => this.setMaxBalance(false);
            this.secondTokenInput.isCommonShown = false;
            this.isInited = true;
        }
        getBalance(token) {
            var _a;
            if (token && this.allTokenBalancesMap) {
                const address = token.address || '';
                let balance = address ? (_a = this.allTokenBalancesMap[address.toLowerCase()]) !== null && _a !== void 0 ? _a : 0 : this.allTokenBalancesMap[token.symbol] || 0;
                return balance;
            }
            return 0;
        }
        async updateBalance() {
            const rpcWallet = this.state.getRpcWallet();
            if (rpcWallet.address) {
                this.allTokenBalancesMap = scom_token_list_2.tokenStore.tokenBalances;
            }
            else {
                this.allTokenBalancesMap = {};
            }
            if (this.firstToken) {
                this.firstBalance = this.getBalance(this.firstToken);
            }
            else {
                this.firstTokenInput.value = '';
                this.firstToken = Object.values(scom_token_list_2.tokenStore.tokenMap).find(v => v.isNative);
                this.firstTokenInput.token = this.firstToken;
                this.firstBalance = scom_token_list_2.tokenStore.getTokenBalance(this.firstToken);
            }
            if (this.secondToken) {
                this.secondBalance = this.getBalance(this.secondToken);
            }
            else {
                this.secondToken = undefined;
                this.secondTokenInput.value = '';
                this.secondBalance = '0';
                this.secondTokenInput.token = this.secondToken;
            }
        }
        resetData() {
            this.updateButtonText();
            this.btnApproveFirstToken.visible = false;
            this.btnApproveSecondToken.visible = false;
            this.initTokenSelection();
        }
        async initData() {
            await this.initTokenSelection();
            await this.initApprovalModelAction();
        }
        updateButtonText() {
            var _a, _b, _c, _d, _e, _f;
            if (!this.btnSupply || !this.btnSupply.hasChildNodes())
                return;
            this.btnSupply.enabled = false;
            if (!(0, index_4.isClientWalletConnected)()) {
                this.btnSupply.enabled = true;
                this.btnSupply.caption = 'Connect Wallet';
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                this.btnSupply.enabled = true;
                this.btnSupply.caption = 'Switch Network';
                return;
            }
            const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, new eth_wallet_5.BigNumber(this.firstTokenInput.value || 0));
            const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, new eth_wallet_5.BigNumber(this.secondTokenInput.value || 0));
            if (this.btnSupply.rightIcon.visible) {
                this.btnSupply.caption = 'Loading';
            }
            else if (!((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol) ||
                !((_b = this.secondToken) === null || _b === void 0 ? void 0 : _b.symbol) ||
                [(_c = this.firstToken) === null || _c === void 0 ? void 0 : _c.symbol, (_d = this.secondToken) === null || _d === void 0 ? void 0 : _d.symbol].every(v => v === 'ETH' || v === 'WETH')) {
                this.btnSupply.caption = 'Invalid Pair';
            }
            else if (new eth_wallet_5.BigNumber(this.firstTokenInput.value).isZero() || new eth_wallet_5.BigNumber(this.secondTokenInput.value).isZero()) {
                this.btnSupply.caption = 'Enter Amount';
            }
            else if (new eth_wallet_5.BigNumber(this.firstTokenInput.value).plus(firstCommissionAmount).gt(this.firstBalance)) {
                this.btnSupply.caption = `Insufficient ${(_e = this.firstToken) === null || _e === void 0 ? void 0 : _e.symbol} balance`;
            }
            else if (new eth_wallet_5.BigNumber(this.secondTokenInput.value).plus(secondCommissionAmount).gt(this.secondBalance)) {
                this.btnSupply.caption = `Insufficient ${(_f = this.secondToken) === null || _f === void 0 ? void 0 : _f.symbol} balance`;
            }
            else if (new eth_wallet_5.BigNumber(this.firstTokenInput.value).gt(0) && new eth_wallet_5.BigNumber(this.secondTokenInput.value).gt(0)) {
                this.btnSupply.caption = 'Supply';
                this.btnSupply.enabled = !(this.btnApproveFirstToken.visible || this.btnApproveSecondToken.visible);
            }
            else {
                this.btnSupply.caption = 'Enter Amount';
            }
        }
        onCheckInput(value) {
            const inputValue = new eth_wallet_5.BigNumber(value);
            if (inputValue.isNaN()) {
                this.firstTokenInput.value = '';
                this.firstInputAmount = '0';
                this.secondTokenInput.value = '';
                this.secondInputAmount = '0';
                return false;
            }
            return inputValue.gt(0);
        }
        async handleInputChange(isFrom) {
            let amount;
            if (isFrom) {
                (0, index_3.limitInputNumber)(this.firstTokenInput, this.firstTokenDecimals);
                amount = this.firstTokenInput.value;
                if (this.firstInputAmount === amount)
                    return;
            }
            else {
                (0, index_3.limitInputNumber)(this.secondTokenInput, this.secondTokenDecimals);
                amount = this.secondTokenInput.value;
                if (this.secondInputAmount === amount)
                    return;
            }
            if (!this.onCheckInput(amount)) {
                this.updateButtonText();
                return;
            }
            ;
            this.updateButton(true);
            try {
                this.isFromEstimated = !isFrom;
                if (isFrom)
                    this.firstInputAmount = this.firstTokenInput.value;
                else
                    this.secondInputAmount = this.secondTokenInput.value;
                await this.checkPairExists();
                await this.callAPIBundle(true);
                this.updateButton(false);
            }
            catch (_a) {
                this.updateButton(false);
            }
        }
        async handleEnterAmount(isFrom) {
            await this.handleInputChange(isFrom);
            this.updateCommissionInfo();
        }
        resetFirstInput() {
            this.firstToken = undefined;
            this.firstBalance = '0';
            this.firstTokenInput.value = '';
            this.btnApproveFirstToken.visible = false;
            this.btnApproveSecondToken.visible = false;
        }
        resetSecondInput() {
            this.secondToken = undefined;
            this.secondBalance = '0';
            this.secondTokenInput.value = '';
            this.btnApproveFirstToken.visible = false;
            this.btnApproveSecondToken.visible = false;
        }
        async setMaxBalance(isFrom) {
            if (!(0, index_4.isClientWalletConnected)())
                return;
            this.isFromEstimated = !isFrom;
            const balance = new eth_wallet_5.BigNumber(isFrom ? this.firstBalance : this.secondBalance);
            let inputVal = balance;
            const commissionAmount = this.state.getCommissionAmount(this.commissions, balance);
            if (commissionAmount.gt(0)) {
                const totalFee = balance.plus(commissionAmount).dividedBy(balance);
                inputVal = inputVal.dividedBy(totalFee);
            }
            if (isFrom) {
                const maxVal = (0, index_3.limitDecimals)(inputVal, this.firstTokenDecimals);
                this.firstInputAmount = maxVal;
                this.firstTokenInput.value = maxVal;
            }
            else {
                const maxVal = (0, index_3.limitDecimals)(inputVal, this.secondTokenDecimals);
                this.secondInputAmount = maxVal;
                this.secondTokenInput.value = maxVal;
            }
            if (!this.onCheckInput(balance.toFixed())) {
                this.updateButtonText();
                this.updateCommissionInfo();
                return;
            }
            ;
            this.updateButton(true);
            try {
                await this.checkPairExists();
                await this.callAPIBundle(true);
            }
            catch (_a) { }
            this.updateCommissionInfo();
            this.updateButton(false);
        }
        updateButton(status) {
            this.btnSupply.rightIcon.visible = status;
            this.updateButtonText();
            this.firstTokenInput.enabled = !status;
            this.secondTokenInput.enabled = !status;
        }
        async onUpdateToken(token, isFrom) {
            var _a, _b;
            const symbol = token.symbol;
            const balance = this.getBalance(token);
            if (isFrom) {
                this.firstToken = token;
                if (((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.symbol) === symbol) {
                    this.secondTokenInput.token = undefined;
                    this.resetSecondInput();
                    if (this.firstTokenInput.isConnected)
                        this.firstTokenInput.value = '';
                    this.firstInputAmount = '';
                }
                else {
                    const limit = (0, index_3.limitDecimals)(this.firstInputAmount, token.decimals || 18);
                    if (!new eth_wallet_5.BigNumber(this.firstInputAmount).eq(limit)) {
                        if (this.firstTokenInput.isConnected)
                            this.firstTokenInput.value = limit;
                        this.firstInputAmount = limit;
                    }
                }
                this.firstBalance = balance;
            }
            else {
                this.secondToken = token;
                if (((_b = this.firstToken) === null || _b === void 0 ? void 0 : _b.symbol) === symbol) {
                    this.firstTokenInput.token = undefined;
                    this.resetFirstInput();
                    if (this.secondTokenInput.isConnected)
                        this.secondTokenInput.value = '';
                    this.secondInputAmount = '';
                }
                else {
                    const limit = (0, index_3.limitDecimals)(this.secondInputAmount || '0', token.decimals || 18);
                    if (!new eth_wallet_5.BigNumber(this.secondInputAmount).eq(limit)) {
                        if (this.secondTokenInput.isConnected)
                            this.secondTokenInput.value = limit;
                        this.secondInputAmount = limit;
                    }
                }
                this.secondBalance = balance;
            }
            this.updateCommissionInfo();
        }
        async onSelectToken(token, isFrom) {
            var _a, _b;
            if (!token)
                return;
            if (token.isNew && this.state.isRpcWalletConnected()) {
                const rpcWallet = this.state.getRpcWallet();
                await scom_token_list_2.tokenStore.updateAllTokenBalances(rpcWallet);
                this.allTokenBalancesMap = scom_token_list_2.tokenStore.tokenBalances;
            }
            const symbol = token.symbol;
            if ((isFrom && ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol) === symbol) || (!isFrom && ((_b = this.secondToken) === null || _b === void 0 ? void 0 : _b.symbol) === symbol))
                return;
            this.updateButton(true);
            try {
                this.onUpdateToken(token, isFrom);
                const isShown = parseFloat(this.firstBalance) > 0 && parseFloat(this.secondBalance) > 0;
                this.pricePanel.visible = isShown;
                if (this.firstToken && this.secondToken) {
                    this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
                    this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
                    await this.checkPairExists();
                }
                await this.callAPIBundle(false);
                this.btnSupply.rightIcon.visible = false;
                this.updateButton(false);
            }
            catch (_c) {
                this.updateButton(false);
            }
            this.updateCommissionInfo();
        }
        handleApprove(source) {
            var _a, _b;
            if (source === this.btnApproveFirstToken) {
                this.showTxStatusModal('warning', `Approving ${(_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol} allowance`);
                this.btnApproveFirstToken.rightIcon.visible = true;
                if (this.firstToken) {
                    this.approvalModelAction.doApproveAction(this.firstToken, this.firstInputAmount);
                }
                this.btnApproveFirstToken.rightIcon.visible = false;
            }
            else if (source === this.btnApproveSecondToken) {
                this.showTxStatusModal('warning', `Approving ${(_b = this.secondToken) === null || _b === void 0 ? void 0 : _b.symbol} allowance`);
                this.btnApproveSecondToken.rightIcon.visible = true;
                if (this.secondToken) {
                    this.approvalModelAction.doApproveAction(this.secondToken, this.secondInputAmount);
                }
                this.btnApproveSecondToken.rightIcon.visible = false;
            }
        }
        handleAction() {
            this.handleSupply();
        }
        async handleSupply() {
            if (!(0, index_4.isClientWalletConnected)() || !this.state.isRpcWalletConnected()) {
                this.connectWallet();
                return;
            }
            if (!this.firstToken || !this.secondToken)
                return;
            const chainId = this.state.getChainId();
            this.firstTokenImage1.url = this.firstTokenImage2.url = scom_token_list_2.assets.tokenPath(this.firstToken, chainId);
            this.secondTokenImage1.url = this.secondTokenImage2.url = scom_token_list_2.assets.tokenPath(this.secondToken, chainId);
            const firstAmount = new eth_wallet_5.BigNumber(this.firstInputAmount);
            const secondAmount = new eth_wallet_5.BigNumber(this.secondInputAmount);
            const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, firstAmount);
            const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, secondAmount);
            this.lbFirstInput.caption = (0, index_3.formatNumber)(firstAmount.plus(firstCommissionAmount), 4);
            this.lbSecondInput.caption = (0, index_3.formatNumber)(secondAmount.plus(secondCommissionAmount), 4);
            this.lbPoolTokensTitle.caption = `${this.firstToken.symbol}/${this.secondToken.symbol} Pool Tokens`;
            this.lbOutputEstimated.caption = `Output is estimated. If the price changes by more than ${this.state.slippageTolerance}% your transaction will revert.`;
            this.lbFirstDeposited.caption = `${this.firstToken.symbol} Deposited`;
            this.lbSecondDeposited.caption = `${this.secondToken.symbol} Deposited`;
            this.lbSummaryFirstPrice.caption = `1 ${this.secondToken.symbol} = ${this.lbFirstPrice.caption} ${this.firstToken.symbol}`;
            this.lbSummarySecondPrice.caption = `1 ${this.firstToken.symbol} = ${this.lbSecondPrice.caption} ${this.secondToken.symbol}`;
            this.lbShareOfPool2.caption = this.lbShareOfPool.caption;
            this.lbPoolTokenAmount.caption = (0, index_3.formatNumber)(this.poolTokenAmount, 4);
            this.confirmSupplyModal.visible = true;
        }
        handleConfirmSupply() {
            this.approvalModelAction.doPayAction();
        }
        onSubmit() {
            this.showTxStatusModal('warning', `Add Liquidity Pool ${this.firstToken.symbol}/${this.secondToken.symbol}`);
            if (this.isFromEstimated) {
                (0, API_1.addLiquidity)(this.state, this.secondToken, this.firstToken, this.secondInputAmount, this.firstInputAmount, this.commissions);
            }
            else {
                (0, API_1.addLiquidity)(this.state, this.firstToken, this.secondToken, this.firstInputAmount, this.secondInputAmount, this.commissions);
            }
        }
        async initApprovalModelAction() {
            if (!this.state.isRpcWalletConnected())
                return;
            if (this.approvalModelAction) {
                this.state.approvalModel.spenderAddress = this.contractAddress;
                return;
            }
            this.approvalModelAction = await this.state.setApprovalModelAction({
                sender: this,
                payAction: async () => {
                    if (!this.firstToken || !this.secondToken)
                        return;
                    this.onSubmit();
                },
                onToBeApproved: async (token) => {
                    if (token == this.firstToken) {
                        this.btnApproveFirstToken.caption = `Approve ${token.symbol}`;
                        this.btnApproveFirstToken.visible = true;
                        this.btnApproveFirstToken.enabled = true;
                        this.btnSupply.enabled = false;
                    }
                    else if (token == this.secondToken) {
                        this.btnApproveSecondToken.caption = `Approve ${token.symbol}`;
                        this.btnApproveSecondToken.visible = true;
                        this.btnApproveSecondToken.enabled = true;
                        this.btnSupply.enabled = false;
                    }
                },
                onToBePaid: async (token) => {
                    if (token === this.firstToken)
                        this.btnApproveFirstToken.visible = false;
                    else if (token === this.secondToken)
                        this.btnApproveSecondToken.visible = false;
                    this.updateButtonText();
                },
                onApproving: async (token, receipt) => {
                    if (token == this.firstToken) {
                        this.btnApproveFirstToken.rightIcon.visible = true;
                        this.btnApproveFirstToken.enabled = false;
                        this.btnApproveFirstToken.caption = `Approving ${token.symbol}`;
                    }
                    else if (token == this.secondToken) {
                        this.btnApproveSecondToken.rightIcon.visible = true;
                        this.btnApproveSecondToken.enabled = false;
                        this.btnApproveSecondToken.caption = `Approving ${token.symbol}`;
                    }
                    if (receipt) {
                        this.showTxStatusModal('success', receipt);
                    }
                },
                onApproved: async (token) => {
                    var _a, _b;
                    if (token == this.firstToken || token.symbol == ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol)) {
                        this.btnApproveFirstToken.rightIcon.visible = false;
                        this.btnApproveFirstToken.visible = false;
                    }
                    else if (token == this.secondToken || token.symbol == ((_b = this.secondToken) === null || _b === void 0 ? void 0 : _b.symbol)) {
                        this.btnApproveSecondToken.rightIcon.visible = false;
                        this.btnApproveSecondToken.visible = false;
                    }
                    this.updateButtonText();
                },
                onApprovingError: async (token, err) => {
                    this.showTxStatusModal('error', err);
                },
                onPaying: async (receipt) => {
                    if (receipt) {
                        this.showTxStatusModal('success', receipt);
                    }
                    this.confirmSupplyModal.visible = false;
                    this.btnSupply.rightIcon.visible = true;
                },
                onPaid: async () => {
                    await scom_token_list_2.tokenStore.updateAllTokenBalances(this.state.getRpcWallet());
                    if (this.firstToken) {
                        this.firstBalance = scom_token_list_2.tokenStore.getTokenBalance(this.firstToken);
                    }
                    if (this.secondToken) {
                        this.secondBalance = scom_token_list_2.tokenStore.getTokenBalance(this.secondToken);
                    }
                    this.btnSupply.rightIcon.visible = false;
                },
                onPayingError: async (err) => {
                    this.showTxStatusModal('error', err);
                    this.btnSupply.rightIcon.visible = false;
                }
            });
            this.state.approvalModel.spenderAddress = this.contractAddress;
        }
        async checkPairExists() {
            if (!this.firstToken || !this.secondToken)
                return;
            try {
                let pair = await (0, API_1.getPairFromTokens)(this.state, this.firstToken, this.secondToken);
                if (!pair || pair.address === eth_wallet_5.Utils.nullAddress) {
                    this.toggleCreateMessage(true);
                }
                else {
                    let totalSupply = await (pair === null || pair === void 0 ? void 0 : pair.totalSupply());
                    this.toggleCreateMessage(totalSupply === null || totalSupply === void 0 ? void 0 : totalSupply.isZero());
                }
            }
            catch (err) {
                this.toggleCreateMessage(true);
            }
        }
        async callAPIBundle(isNewShare) {
            if (!this.firstToken || !this.secondToken)
                return;
            if (!this.lbFirstPrice.isConnected)
                await this.lbFirstPrice.ready();
            if (!this.lbSecondPrice.isConnected)
                await this.lbSecondPrice.ready();
            if (!this.lbShareOfPool.isConnected)
                await this.lbShareOfPool.ready();
            if (isNewShare) {
                let newShareInfo;
                let invalidVal = false;
                if (this.isFromEstimated) {
                    invalidVal = new eth_wallet_5.BigNumber(this.firstTokenInput.value).isNaN();
                    newShareInfo = await (0, API_1.getNewShareInfo)(this.state, this.secondToken, this.firstToken, this.secondTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
                    const val = (0, index_3.limitDecimals)((newShareInfo === null || newShareInfo === void 0 ? void 0 : newShareInfo.quote) || '0', this.firstTokenDecimals);
                    this.firstInputAmount = val;
                    this.firstTokenInput.value = val;
                    if (invalidVal)
                        newShareInfo = await (0, API_1.getNewShareInfo)(this.state, this.secondToken, this.firstToken, this.secondTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
                }
                else {
                    invalidVal = new eth_wallet_5.BigNumber(this.secondTokenInput.value).isNaN();
                    newShareInfo = await (0, API_1.getNewShareInfo)(this.state, this.firstToken, this.secondToken, this.firstTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
                    const val = (0, index_3.limitDecimals)((newShareInfo === null || newShareInfo === void 0 ? void 0 : newShareInfo.quote) || '0', this.secondTokenDecimals);
                    this.secondInputAmount = val;
                    this.secondTokenInput.value = val;
                    if (invalidVal)
                        newShareInfo = await (0, API_1.getNewShareInfo)(this.state, this.firstToken, this.secondToken, this.firstTokenInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
                }
                if (!newShareInfo) {
                    this.lbFirstPrice.caption = '0';
                    this.lbSecondPrice.caption = '0';
                    this.lbShareOfPool.caption = '0%';
                    this.poolTokenAmount = '0';
                }
                else {
                    let shareOfPool = new eth_wallet_5.BigNumber(newShareInfo.newShare).times(100).toFixed();
                    this.lbFirstPrice.caption = (0, index_3.formatNumber)(newShareInfo.newPrice0, 3);
                    this.lbSecondPrice.caption = (0, index_3.formatNumber)(newShareInfo.newPrice1, 3);
                    this.lbShareOfPool.caption = `${(0, index_3.formatNumber)(shareOfPool, 2)}%`;
                    this.poolTokenAmount = newShareInfo.minted;
                }
            }
            else {
                let pricesInfo = await (0, API_1.getPricesInfo)(this.state, this.firstToken, this.secondToken);
                if (!pricesInfo) {
                    let newPairShareInfo = (0, API_1.calculateNewPairShareInfo)(this.firstToken, this.secondToken, this.firstInputAmount, this.secondInputAmount);
                    this.lbFirstPrice.caption = (0, index_3.formatNumber)(newPairShareInfo.price0, 3);
                    this.lbSecondPrice.caption = (0, index_3.formatNumber)(newPairShareInfo.price1, 3);
                    this.poolTokenAmount = newPairShareInfo.minted;
                    this.lbShareOfPool.caption = '100%';
                }
                else if (!pricesInfo.price0 || !pricesInfo.price1) {
                    this.lbFirstPrice.caption = '0';
                    this.lbSecondPrice.caption = '0';
                    this.lbShareOfPool.caption = '0%';
                }
                else {
                    const { price0, price1 } = pricesInfo;
                    let shareOfPool = pricesInfo.totalSupply == '0' ? '0' : new eth_wallet_5.BigNumber(pricesInfo.balance).div(pricesInfo.totalSupply).times(100).toFixed();
                    this.lbFirstPrice.caption = (0, index_3.formatNumber)(price0, 3);
                    this.lbSecondPrice.caption = (0, index_3.formatNumber)(price1, 3);
                    this.lbShareOfPool.caption = `${(0, index_3.formatNumber)(shareOfPool, 2)}%`;
                    if (this.isFromEstimated) {
                        if (new eth_wallet_5.BigNumber(this.secondTokenInput.value).gt(0)) {
                            const price = new eth_wallet_5.BigNumber(price1).multipliedBy(this.secondTokenInput.value).toFixed();
                            const val = (0, index_3.limitDecimals)(price, this.firstTokenDecimals);
                            this.firstTokenInput.value = val;
                            this.firstInputAmount = val;
                        }
                    }
                    else {
                        if (new eth_wallet_5.BigNumber(this.firstTokenInput.value).gt(0)) {
                            const price = new eth_wallet_5.BigNumber(price0).multipliedBy(this.firstTokenInput.value).toFixed();
                            const val = (0, index_3.limitDecimals)(price, this.secondTokenDecimals);
                            this.secondTokenInput.value = val;
                            this.secondInputAmount = val;
                        }
                    }
                }
            }
            this.btnSupply.enabled = true;
            const firstCommissionAmount = this.state.getCommissionAmount(this.commissions, new eth_wallet_5.BigNumber(this.firstInputAmount));
            const secondCommissionAmount = this.state.getCommissionAmount(this.commissions, new eth_wallet_5.BigNumber(this.secondInputAmount));
            this.approvalModelAction.checkAllowance(this.firstToken, firstCommissionAmount.plus(this.firstInputAmount).toFixed());
            this.approvalModelAction.checkAllowance(this.secondToken, secondCommissionAmount.plus(this.secondInputAmount).toFixed());
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const state = this.getAttribute('state', true);
            if (state) {
                this.state = state;
            }
            const tokens = this.getAttribute('tokens', true, []);
            const providers = this.getAttribute('providers', true, []);
            const commissions = this.getAttribute('commissions', true, []);
            await this.setData({ commissions, providers, tokens });
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        toggleCreateMessage(value) {
            this.pnlCreatePairMsg.visible = value;
        }
        render() {
            return (this.$render("i-panel", { class: index_css_1.poolAddStyle },
                this.$render("i-panel", null,
                    this.$render("i-vstack", { id: "pnlCreatePairMsg", visible: false, background: { color: Theme.background.gradient }, padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }, margin: { bottom: '1rem' }, gap: "1rem" },
                        this.$render("i-label", { caption: 'You are the first liquidity provider.', font: { color: '#fff' } }),
                        this.$render("i-label", { caption: 'The ratio of tokens you add will set the price of this pool.', font: { color: '#fff' } }),
                        this.$render("i-label", { caption: 'Once you are happy with the rate click supply to review.', font: { color: '#fff' } })),
                    this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem" },
                        this.$render("i-scom-token-input", { id: "firstTokenInput", title: "Input", width: "100%", isCommonShown: false, onInputAmountChanged: () => this.handleEnterAmount(true) })),
                    this.$render("i-hstack", { horizontalAlignment: "center" },
                        this.$render("i-icon", { width: 20, height: 20, name: "plus", fill: "#fff" })),
                    this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem" },
                        this.$render("i-scom-token-input", { id: "secondTokenInput", title: "Input", width: "100%", isCommonShown: false, onInputAmountChanged: () => this.handleEnterAmount() })),
                    this.$render("i-hstack", { id: "hStackCommissionInfo", verticalAlignment: "start", gap: 10, wrap: "wrap" },
                        this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                            this.$render("i-label", { caption: "Total" }),
                            this.$render("i-icon", { id: "iconCommissionFee", name: "question-circle", width: 16, height: 16 })),
                        this.$render("i-vstack", { gap: 10, margin: { left: 'auto' }, verticalAlignment: "center", horizontalAlignment: "end" },
                            this.$render("i-label", { id: "lbFirstCommission", font: { size: '14px' } }),
                            this.$render("i-label", { id: "lbSecondCommission", font: { size: '14px' } }))),
                    this.$render("i-vstack", { id: "pricePanel", padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem", visible: false },
                        this.$render("i-label", { margin: { bottom: 12 }, caption: "Prices and pool share" }),
                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center" },
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbFirstPrice", caption: "-" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbFirstPriceTitle", opacity: 0.7, caption: "per" }))),
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbSecondPrice", caption: "-" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbSecondPriceTitle", opacity: 0.7, caption: "per" }))),
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbShareOfPool", caption: "0%" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { opacity: 0.7, caption: "Share of pool" }))))),
                    this.$render("i-button", { id: "btnApproveFirstToken", visible: false, class: "btn-swap", height: "65", caption: "Approve", rightIcon: { spin: true, visible: false }, onClick: this.handleApprove }),
                    this.$render("i-button", { id: "btnApproveSecondToken", visible: false, class: "btn-swap", height: "65", caption: "Approve", onClick: this.handleApprove, rightIcon: { spin: true, visible: false } }),
                    this.$render("i-button", { id: "btnSupply", class: "btn-swap", enabled: false, height: "65", caption: '', rightIcon: { spin: true, visible: false }, onClick: this.handleAction })),
                this.$render("i-modal", { id: "confirmSupplyModal", title: "Add Liquidity To Pool", closeIcon: { name: 'times' } },
                    this.$render("i-label", { font: { color: Theme.colors.warning.main, size: '1.125rem' }, caption: 'You will receive' }),
                    this.$render("i-hstack", { horizontalAlignment: "space-between", margin: { bottom: 24 } },
                        this.$render("i-label", { id: "lbPoolTokenAmount", font: { color: Theme.colors.warning.main, size: '1.5rem' }, caption: '-' }),
                        this.$render("i-panel", null,
                            this.$render("i-image", { id: "firstTokenImage1", margin: { right: '-0.5rem' }, zIndex: 1, width: 24, height: 24 }),
                            this.$render("i-image", { id: "secondTokenImage1", width: 24, height: 24 }))),
                    this.$render("i-label", { id: "lbPoolTokensTitle", font: { color: Theme.colors.warning.main } }),
                    this.$render("i-label", { id: "lbOutputEstimated", font: { color: Theme.colors.warning.main, size: '0.75rem' } }),
                    this.$render("i-hstack", { horizontalAlignment: "space-between" },
                        this.$render("i-label", { id: "lbFirstDeposited", font: { color: Theme.colors.warning.main } }),
                        this.$render("i-hstack", { verticalAlignment: "center" },
                            this.$render("i-image", { id: "firstTokenImage2", margin: { right: 4 }, width: 24, height: 24 }),
                            this.$render("i-label", { id: "lbFirstInput", font: { color: Theme.colors.warning.main } }))),
                    this.$render("i-hstack", { horizontalAlignment: "space-between" },
                        this.$render("i-label", { id: "lbSecondDeposited", font: { color: Theme.colors.warning.main } }),
                        this.$render("i-hstack", { verticalAlignment: "center" },
                            this.$render("i-image", { id: "secondTokenImage2", margin: { right: 4 }, width: 24, height: 24 }),
                            this.$render("i-label", { id: "lbSecondInput", font: { color: Theme.colors.warning.main } }))),
                    this.$render("i-hstack", { horizontalAlignment: "space-between" },
                        this.$render("i-label", { font: { color: Theme.colors.warning.main }, caption: "Rates" }),
                        this.$render("i-panel", null,
                            this.$render("i-panel", { class: "text-right" },
                                this.$render("i-label", { id: "lbSummaryFirstPrice", font: { color: Theme.colors.warning.main } })),
                            this.$render("i-panel", { class: "text-right" },
                                this.$render("i-label", { id: "lbSummarySecondPrice", font: { color: Theme.colors.warning.main } })))),
                    this.$render("i-hstack", { horizontalAlignment: "space-between" },
                        this.$render("i-label", { font: { color: Theme.colors.warning.main }, caption: "Share of Pool" }),
                        this.$render("i-panel", null,
                            this.$render("i-label", { id: "lbShareOfPool2", font: { color: Theme.colors.warning.main } }))),
                    this.$render("i-button", { class: "btn-swap", height: "auto", caption: "Confirm Supply", onClick: this.handleConfirmSupply })),
                this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })));
        }
    };
    ScomAmmPoolAdd = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-amm-pool-add')
    ], ScomAmmPoolAdd);
    exports.ScomAmmPoolAdd = ScomAmmPoolAdd;
});
define("@scom/scom-amm-pool/liquidity/remove.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-amm-pool/global/index.ts", "@ijstech/eth-wallet", "@scom/scom-amm-pool/store/index.ts", "@scom/scom-amm-pool/API.ts", "@scom/scom-token-list", "@scom/scom-amm-pool/liquidity/index.css.ts"], function (require, exports, components_5, index_5, eth_wallet_6, index_6, API_2, scom_token_list_3, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomAmmPoolRemove = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomAmmPoolRemove = class ScomAmmPoolRemove extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this.firstInputAmount = '';
            this.secondInputAmount = '';
            this._data = {
                providers: [],
                tokens: []
            };
            this.maxLiquidityBalance = '0';
            this.isInited = false;
            this.removeInfo = {
                maxBalance: '',
                totalPoolTokens: '',
                poolShare: '',
                tokenAShare: '',
                tokenBShare: ''
            };
            this.tag = {};
            this.onWalletConnected = async (connected) => {
                var _a, _b;
                // if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
                //   this.onChainChange();
                // } else {
                //   this.updateContractAddress();
                //   if (this.originalData?.providers?.length) await this.onSetupPage(connected);
                // }
                this.updateContractAddress();
                if ((_b = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.length)
                    await this.onSetupPage(connected);
            };
            this.onChainChange = async () => {
                var _a, _b;
                this.updateContractAddress();
                if ((_b = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.length)
                    await this.onSetupPage(true);
                this.updateButtonText();
            };
            this.updateContractAddress = () => {
                var _a;
                this.contractAddress = (0, API_2.getRouterAddress)(this.state, this.state.getChainId());
                if (((_a = this.state) === null || _a === void 0 ? void 0 : _a.approvalModel) && this.approvalModelAction) {
                    this.state.approvalModel.spenderAddress = this.contractAddress;
                }
            };
            this.onSetupPage = async (connected) => {
                const chainId = this.state.getChainId();
                if (!this.btnRemove.isConnected)
                    await this.btnRemove.ready();
                if (!this.firstTokenInput.isConnected)
                    await this.firstTokenInput.ready();
                if (!this.secondTokenInput.isConnected)
                    await this.secondTokenInput.ready();
                if (!this.liquidityInput.isConnected)
                    await this.liquidityInput.ready();
                this.resetFirstInput();
                this.resetSecondInput();
                this.liquidityInput.value = '';
                if (connected) {
                    if (!this.approvalModelAction)
                        await this.initApprovalModelAction();
                }
                this.firstTokenInput.isBtnMaxShown = false;
                this.secondTokenInput.isBtnMaxShown = false;
                const tokens = (0, index_6.getSupportedTokens)(this._data.tokens || [], chainId);
                const isReadonly = tokens.length === 2;
                this.firstTokenInput.tokenReadOnly = isReadonly;
                this.secondTokenInput.tokenReadOnly = isReadonly;
                this.firstTokenInput.tokenDataListProp = tokens;
                this.secondTokenInput.tokenDataListProp = tokens;
                this.setFixedPairData();
                if (connected) {
                    try {
                        this.updateButtonText();
                        if (!this.firstToken || !this.secondToken) {
                            this.resetUI();
                            return;
                        }
                        if (!this.lbFirstPriceTitle.isConnected)
                            await this.lbFirstPriceTitle.ready();
                        this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
                        if (!this.lbSecondPriceTitle.isConnected)
                            await this.lbSecondPriceTitle.ready();
                        this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
                        this.pricePanel.visible = true;
                        await this.checkPairExists();
                        await this.callAPIBundle();
                        this.renderLiquidity();
                        if (new eth_wallet_6.BigNumber(this.liquidityInput.value).gt(0))
                            this.approvalModelAction.checkAllowance(this.lpToken, this.liquidityInput.value);
                    }
                    catch (_a) {
                        this.btnRemove.caption = 'Remove';
                    }
                }
                else {
                    this.resetData();
                }
            };
            this.updateBtnRemove = () => {
                if (!(0, index_6.isClientWalletConnected)()) {
                    this.btnRemove.caption = 'Connect Wallet';
                    this.btnRemove.enabled = true;
                    return;
                }
                if (!this.state.isRpcWalletConnected()) {
                    this.btnRemove.caption = 'Switch Network';
                    this.btnRemove.enabled = true;
                    return;
                }
                if (!this.firstToken || !this.secondToken) {
                    this.btnRemove.caption = 'Invalid Pair';
                    this.btnRemove.enabled = false;
                    return;
                }
                const lqAmount = new eth_wallet_6.BigNumber(this.liquidityInput.value || 0);
                const canRemove = lqAmount.gt(0) && lqAmount.lte(this.maxLiquidityBalance);
                this.btnRemove.caption = canRemove || lqAmount.isZero() ? 'Remove' : 'Insufficient balance';
                this.btnRemove.enabled = canRemove;
            };
            this.showTxStatusModal = (status, content) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                this.txStatusModal.message = Object.assign({}, params);
                this.txStatusModal.showModal();
            };
            if (options === null || options === void 0 ? void 0 : options.state) {
                this.state = options.state;
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get firstTokenDecimals() {
            var _a;
            return ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.decimals) || 18;
        }
        get secondTokenDecimals() {
            var _a;
            return ((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.decimals) || 18;
        }
        get firstTokenSymbol() {
            var _a;
            return ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol) || '';
        }
        get secondTokenSymbol() {
            var _a;
            return ((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.symbol) || '';
        }
        get providers() {
            return this._data.providers;
        }
        set providers(value) {
            this._data.providers = value;
        }
        get originalData() {
            if (!this._data)
                return undefined;
            const { providers } = this._data;
            if (!(providers === null || providers === void 0 ? void 0 : providers.length))
                return undefined;
            let _providers = [];
            const { key } = providers[0];
            let defaultProvider = {
                key
            };
            _providers.push(defaultProvider);
            return { providers: _providers };
        }
        async setData(data) {
            this._data = data;
            this.updateContractAddress();
            await this.refreshUI();
        }
        async refreshUI() {
            await this.initData();
            await this.onSetupPage((0, index_6.isClientWalletConnected)());
        }
        renderLiquidity() {
            const chainId = this.state.getChainId();
            let firstTokenImagePath = scom_token_list_3.assets.tokenPath(this.firstToken, chainId);
            let secondTokenImagePath = scom_token_list_3.assets.tokenPath(this.secondToken, chainId);
            this.pnlLiquidityImage.clearInnerHTML();
            this.pnlLiquidityImage.append(this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", gap: "4px" },
                this.$render("i-button", { caption: "Max", font: { color: '#fff' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, background: { color: Theme.background.gradient }, onClick: () => this.setMaxLiquidityBalance() }),
                this.$render("i-image", { width: 20, height: 20, url: firstTokenImagePath }),
                this.$render("i-image", { width: 20, height: 20, url: secondTokenImagePath }),
                this.$render("i-label", { font: { color: Theme.colors.warning.main }, caption: this.firstTokenSymbol || '-' }),
                this.$render("i-label", { font: { color: Theme.colors.warning.main }, caption: "-" }),
                this.$render("i-label", { font: { color: Theme.colors.warning.main }, caption: this.secondTokenSymbol || '-' })));
            this.pnlInfo.clearInnerHTML();
            this.pnlInfo.append(this.$render("i-vstack", { padding: { left: '1rem', right: '1rem' }, gap: "0.5rem", margin: { top: '1.75rem' } },
                this.$render("i-label", { font: { color: '#E53780' }, caption: "Your position" }),
                this.$render("i-hstack", { horizontalAlignment: "space-between" },
                    this.$render("i-hstack", { verticalAlignment: "center", gap: 4 },
                        this.$render("i-image", { url: firstTokenImagePath, width: 20, height: 20 }),
                        this.$render("i-image", { url: secondTokenImagePath, width: 20, height: 20 }),
                        this.$render("i-label", { caption: `${this.firstTokenSymbol} / ${this.secondTokenSymbol}` })),
                    this.$render("i-label", { caption: this.removeInfo.totalPoolTokens })),
                this.$render("i-hstack", { horizontalAlignment: "space-between" },
                    this.$render("i-label", { font: { color: '#E53780' }, caption: "Your Pool Share" }),
                    this.$render("i-label", { caption: this.removeInfo.poolShare })),
                this.$render("i-hstack", { horizontalAlignment: "space-between" },
                    this.$render("i-label", { caption: this.firstTokenSymbol }),
                    this.$render("i-label", { caption: this.removeInfo.tokenAShare })),
                this.$render("i-hstack", { horizontalAlignment: "space-between" },
                    this.$render("i-label", { caption: this.secondTokenSymbol }),
                    this.$render("i-label", { caption: this.removeInfo.tokenBShare }))));
        }
        setFixedPairData() {
            var _a;
            const chainId = this.state.getChainId();
            let currentChainTokens = this._data.tokens.filter((token) => token.chainId === chainId);
            if (!currentChainTokens.length && (0, index_6.isClientWalletConnected)()) {
                this.firstToken = Object.values(scom_token_list_3.tokenStore.tokenMap).find(v => v.isNative);
                this.firstTokenInput.token = this.firstToken;
                return;
            }
            if (currentChainTokens.length < 2)
                return;
            const providers = (_a = this.originalData) === null || _a === void 0 ? void 0 : _a.providers;
            if (providers && providers.length) {
                const fromTokenAddress = currentChainTokens[0].address || currentChainTokens[0].symbol;
                const toTokenAddress = currentChainTokens[1].address || currentChainTokens[1].symbol;
                const fromToken = (fromTokenAddress === null || fromTokenAddress === void 0 ? void 0 : fromTokenAddress.toLowerCase().startsWith('0x')) ? fromTokenAddress.toLowerCase() : fromTokenAddress;
                const toToken = (toTokenAddress === null || toTokenAddress === void 0 ? void 0 : toTokenAddress.toLowerCase().startsWith('0x')) ? toTokenAddress.toLowerCase() : toTokenAddress;
                this.firstToken = scom_token_list_3.tokenStore.tokenMap[fromToken];
                this.secondToken = scom_token_list_3.tokenStore.tokenMap[toToken];
                this.onUpdateToken(this.firstToken, true);
                this.onUpdateToken(this.secondToken, false);
                this.firstTokenInput.token = this.firstToken;
                this.secondTokenInput.token = this.secondToken;
            }
        }
        async initTokenSelection() {
            if (this.isInited)
                return;
            await this.firstTokenInput.ready();
            await this.secondTokenInput.ready();
            this.firstTokenInput.tokenReadOnly = false;
            this.firstTokenInput.onSelectToken = (token) => this.onSelectToken(token, true);
            this.firstTokenInput.isCommonShown = false;
            this.secondTokenInput.tokenReadOnly = false;
            this.secondTokenInput.onSelectToken = (token) => this.onSelectToken(token, false);
            this.secondTokenInput.isCommonShown = false;
            this.isInited = true;
        }
        resetData() {
            this.updateButtonText();
            this.btnApprove.visible = false;
            this.initTokenSelection();
        }
        async initData() {
            await this.initTokenSelection();
            await this.initApprovalModelAction();
        }
        updateButtonText() {
            if (!this.btnRemove || !this.btnRemove.hasChildNodes())
                return;
            this.btnRemove.enabled = false;
            if (!(0, index_6.isClientWalletConnected)()) {
                this.btnRemove.caption = 'Connect Wallet';
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                this.btnRemove.enabled = true;
                this.btnRemove.caption = 'Switch Network';
                return;
            }
            if (this.btnRemove.rightIcon.visible) {
                this.btnRemove.caption = 'Loading';
            }
            else {
                this.updateBtnRemove();
            }
        }
        async handleOutputChange(isFrom) {
            var _a;
            if (!this.firstToken || !this.secondToken)
                return;
            if (isFrom) {
                (0, index_5.limitInputNumber)(this.firstTokenInput, this.firstToken.decimals);
                const value = new eth_wallet_6.BigNumber(this.firstTokenInput.value);
                let tokensBack = await (0, API_2.getTokensBackByAmountOut)(this.state, this.firstToken, this.secondToken, this.firstToken, value.toFixed());
                if (tokensBack && value.eq(this.firstTokenInput.value)) {
                    this.liquidityInput.value = tokensBack.liquidity;
                    this.secondTokenInput.value = tokensBack.amountB;
                }
            }
            else {
                (0, index_5.limitInputNumber)(this.secondTokenInput, this.secondToken.decimals);
                const value = new eth_wallet_6.BigNumber(this.secondTokenInput.value);
                let tokensBack = await (0, API_2.getTokensBackByAmountOut)(this.state, this.firstToken, this.secondToken, this.secondToken, value.toFixed());
                if (tokensBack && value.eq(this.secondTokenInput.value)) {
                    this.liquidityInput.value = tokensBack.liquidity;
                    this.firstTokenInput.value = tokensBack.amountA;
                }
            }
            (_a = this.approvalModelAction) === null || _a === void 0 ? void 0 : _a.checkAllowance(this.lpToken, this.liquidityInput.value);
        }
        async handleEnterAmount(isFrom) {
            await this.handleOutputChange(isFrom);
        }
        resetFirstInput() {
            this.firstToken = undefined;
            this.firstTokenInput.value = '';
            this.btnApprove.visible = false;
        }
        resetSecondInput() {
            this.secondToken = undefined;
            this.secondTokenInput.value = '';
            this.btnApprove.visible = false;
        }
        setMaxLiquidityBalance() {
            if (!this.firstToken || !this.secondToken)
                return;
            this.liquidityInput.value = this.maxLiquidityBalance;
            this.onLiquidityChange();
        }
        async onLiquidityChange() {
            var _a;
            if (!this.firstToken || !this.secondToken)
                return;
            (0, index_5.limitInputNumber)(this.liquidityInput, 18);
            const value = new eth_wallet_6.BigNumber(this.liquidityInput.value);
            let tokensBack = await (0, API_2.getTokensBack)(this.state, this.firstToken, this.secondToken, value.toFixed());
            if (tokensBack && value.eq(this.liquidityInput.value)) {
                this.firstTokenInput.value = isNaN(Number(tokensBack.amountA)) ? '0' : tokensBack.amountA;
                this.secondTokenInput.value = isNaN(Number(tokensBack.amountB)) ? '0' : tokensBack.amountB;
            }
            (_a = this.approvalModelAction) === null || _a === void 0 ? void 0 : _a.checkAllowance(this.lpToken, this.liquidityInput.value);
        }
        updateButton(status) {
            this.btnRemove.rightIcon.visible = status;
            this.updateButtonText();
            this.firstTokenInput.enabled = !status;
            this.secondTokenInput.enabled = !status;
        }
        async onUpdateToken(token, isFrom) {
            var _a, _b;
            const symbol = token.symbol;
            if (isFrom) {
                this.firstToken = token;
                if (((_a = this.secondToken) === null || _a === void 0 ? void 0 : _a.symbol) === symbol) {
                    this.secondTokenInput.token = undefined;
                    this.resetSecondInput();
                    if (this.firstTokenInput.isConnected)
                        this.firstTokenInput.value = '';
                    this.firstInputAmount = '';
                }
                else {
                    const limit = (0, index_5.limitDecimals)(this.firstInputAmount, token.decimals || 18);
                    if (!new eth_wallet_6.BigNumber(this.firstInputAmount).eq(limit)) {
                        if (this.firstTokenInput.isConnected)
                            this.firstTokenInput.value = limit;
                        this.firstInputAmount = limit;
                    }
                }
            }
            else {
                this.secondToken = token;
                if (((_b = this.firstToken) === null || _b === void 0 ? void 0 : _b.symbol) === symbol) {
                    this.firstTokenInput.token = undefined;
                    this.resetFirstInput();
                    if (this.secondTokenInput.isConnected)
                        this.secondTokenInput.value = '';
                    this.secondInputAmount = '';
                }
                else {
                    const limit = (0, index_5.limitDecimals)(this.secondInputAmount, token.decimals || 18);
                    if (!new eth_wallet_6.BigNumber(this.secondInputAmount).eq(limit)) {
                        if (this.secondTokenInput.isConnected)
                            this.secondTokenInput.value = limit;
                        this.secondInputAmount = limit;
                    }
                }
            }
        }
        async onSelectToken(token, isFrom) {
            var _a, _b;
            if (!token)
                return;
            const symbol = token.symbol;
            if ((isFrom && ((_a = this.firstToken) === null || _a === void 0 ? void 0 : _a.symbol) === symbol) || (!isFrom && ((_b = this.secondToken) === null || _b === void 0 ? void 0 : _b.symbol) === symbol))
                return;
            this.updateButton(true);
            try {
                this.onUpdateToken(token, isFrom);
                if (!this.firstToken || !this.secondToken) {
                    this.resetUI();
                    return;
                }
                this.pricePanel.visible = true;
                this.lbFirstPriceTitle.caption = `${this.secondToken.symbol} per ${this.firstToken.symbol}`;
                this.lbSecondPriceTitle.caption = `${this.firstToken.symbol} per ${this.secondToken.symbol}`;
                await this.checkPairExists();
                await this.callAPIBundle();
                this.renderLiquidity();
                this.btnRemove.rightIcon.visible = false;
                this.updateButton(false);
            }
            catch (_c) {
                this.updateButton(false);
            }
        }
        resetUI() {
            this.lbLiquidityBalance.caption = `Balance: 0`;
            this.maxLiquidityBalance = '';
            this.liquidityInput.value = this.maxLiquidityBalance;
            this.lpToken = undefined;
            this.pricePanel.visible = false;
            this.pnlLiquidityImage.clearInnerHTML();
            this.pnlInfo.clearInnerHTML();
            this.updateButton(false);
        }
        handleApprove() {
            this.approvalModelAction.doApproveAction(this.lpToken, this.liquidityInput.value);
        }
        handleAction() {
            this.approvalModelAction.doPayAction();
        }
        onSubmit() {
            if (!(0, index_6.isClientWalletConnected)() || !this.state.isRpcWalletConnected()) {
                this.connectWallet();
                return;
            }
            this.showTxStatusModal('warning', `Removing ${this.firstToken.symbol}/${this.secondToken.symbol}`);
            (0, API_2.removeLiquidity)(this.state, this.firstToken, this.secondToken, this.liquidityInput.value, this.firstTokenInput.value, this.secondTokenInput.value);
        }
        async initApprovalModelAction() {
            if (!this.state.isRpcWalletConnected())
                return;
            if (this.approvalModelAction) {
                this.state.approvalModel.spenderAddress = this.contractAddress;
                return;
            }
            this.approvalModelAction = await this.state.setApprovalModelAction({
                sender: this,
                payAction: async () => {
                    if (!this.firstToken || !this.secondToken)
                        return;
                    this.onSubmit();
                },
                onToBeApproved: async (token) => {
                    this.btnApprove.caption = `Approve`;
                    this.btnApprove.visible = true;
                    this.btnApprove.enabled = true;
                    this.btnRemove.enabled = false;
                },
                onToBePaid: async (token) => {
                    this.btnApprove.visible = false;
                    this.updateBtnRemove();
                },
                onApproving: async (token, receipt) => {
                    this.btnApprove.rightIcon.visible = true;
                    this.btnApprove.enabled = false;
                    this.btnApprove.caption = `Approving`;
                    if (receipt) {
                        this.showTxStatusModal('success', receipt);
                    }
                },
                onApproved: async (token) => {
                    this.btnApprove.rightIcon.visible = false;
                    this.btnApprove.visible = false;
                    this.btnApprove.caption = 'Approved';
                    this.updateBtnRemove();
                },
                onApprovingError: async (token, err) => {
                    this.showTxStatusModal('error', err);
                    this.btnApprove.rightIcon.visible = false;
                    this.btnApprove.enabled = true;
                    this.btnApprove.caption = 'Approve';
                },
                onPaying: async (receipt) => {
                    if (receipt) {
                        this.showTxStatusModal('success', receipt);
                    }
                    this.btnRemove.rightIcon.visible = true;
                },
                onPaid: async () => {
                    await scom_token_list_3.tokenStore.updateAllTokenBalances(this.state.getRpcWallet());
                    this.btnRemove.rightIcon.visible = false;
                },
                onPayingError: async (err) => {
                    this.showTxStatusModal('error', err);
                    this.btnRemove.rightIcon.visible = false;
                }
            });
            this.state.approvalModel.spenderAddress = this.contractAddress;
        }
        async checkPairExists() {
            if (!this.firstToken || !this.secondToken)
                return;
            try {
                let pair = await (0, API_2.getPairFromTokens)(this.state, this.firstToken, this.secondToken);
                if (!pair || pair.address === eth_wallet_6.Utils.nullAddress) {
                    this.toggleCreateMessage(true);
                }
                else {
                    let totalSupply = await (pair === null || pair === void 0 ? void 0 : pair.totalSupply());
                    this.toggleCreateMessage(totalSupply === null || totalSupply === void 0 ? void 0 : totalSupply.isZero());
                }
            }
            catch (err) {
                this.toggleCreateMessage(true);
            }
        }
        async callAPIBundle() {
            if (!this.firstToken || !this.secondToken)
                return;
            if (!this.lbFirstPrice.isConnected)
                await this.lbFirstPrice.ready();
            if (!this.lbSecondPrice.isConnected)
                await this.lbSecondPrice.ready();
            if (!this.lbShareOfPool.isConnected)
                await this.lbShareOfPool.ready();
            const info = await (0, API_2.getRemoveLiquidityInfo)(this.state, this.firstToken, this.secondToken);
            this.removeInfo = {
                maxBalance: (info === null || info === void 0 ? void 0 : info.totalPoolTokens) || '',
                totalPoolTokens: info.totalPoolTokens ? (0, index_5.formatNumber)(info.totalPoolTokens, 4) : '',
                poolShare: info.poolShare ? `${(0, index_5.formatNumber)(new eth_wallet_6.BigNumber(info.poolShare).times(100), 2)}%` : '',
                tokenAShare: info.tokenAShare ? (0, index_5.formatNumber)(info.tokenAShare, 4) : '',
                tokenBShare: info.tokenBShare ? (0, index_5.formatNumber)(info.tokenBShare, 4) : ''
            };
            this.lbFirstPrice.caption = `1 ${this.firstTokenSymbol} = ${(0, index_5.formatNumber)(info.price0, 4)} ${this.secondTokenSymbol}`;
            this.lbSecondPrice.caption = `1 ${this.secondTokenSymbol} = ${(0, index_5.formatNumber)(info.price1, 4)} ${this.firstTokenSymbol}`;
            this.lbShareOfPool.caption = this.removeInfo.poolShare;
            this.firstTokenInput.value = this.removeInfo.tokenAShare;
            this.secondTokenInput.value = this.removeInfo.tokenBShare;
            this.lbLiquidityBalance.caption = `Balance: ${this.removeInfo.totalPoolTokens}`;
            this.maxLiquidityBalance = info.totalPoolTokens;
            this.liquidityInput.value = this.maxLiquidityBalance;
            this.lpToken = info.lpToken;
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const state = this.getAttribute('state', true);
            if (state) {
                this.state = state;
            }
            const tokens = this.getAttribute('tokens', true, []);
            const providers = this.getAttribute('providers', true, []);
            await this.setData({ providers, tokens });
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        toggleCreateMessage(value) {
            this.pnlCreatePairMsg.visible = value;
        }
        render() {
            return (this.$render("i-panel", { class: index_css_2.poolRemoveStyle },
                this.$render("i-panel", null,
                    this.$render("i-vstack", { id: "pnlCreatePairMsg", visible: false, background: { color: Theme.background.gradient }, padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }, margin: { bottom: '1rem' }, gap: "1rem" },
                        this.$render("i-label", { caption: 'You are the first liquidity provider.', font: { color: '#fff' } }),
                        this.$render("i-label", { caption: 'The ratio of tokens you add will set the price of this pool.', font: { color: '#fff' } }),
                        this.$render("i-label", { caption: 'Once you are happy with the rate click supply to review.', font: { color: '#fff' } })),
                    this.$render("i-vstack", null,
                        this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem" },
                            this.$render("i-hstack", { horizontalAlignment: "space-between", margin: { bottom: 4 } },
                                this.$render("i-label", { caption: "Input" }),
                                this.$render("i-label", { id: "lbLiquidityBalance", caption: "-", font: { color: Theme.colors.warning.main } })),
                            this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", gap: 10 },
                                this.$render("i-input", { id: "liquidityInput", class: "bg-transparent", height: 30, value: "0", onChanged: this.onLiquidityChange }),
                                this.$render("i-panel", { id: "pnlLiquidityImage", class: "text-right" }))),
                        this.$render("i-hstack", { horizontalAlignment: "center" },
                            this.$render("i-icon", { width: 20, height: 20, name: "arrow-down", fill: "#fff" }))),
                    this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem" },
                        this.$render("i-scom-token-input", { id: "firstTokenInput", title: "Output", width: "100%", isBtnMaxShown: false, isBalanceShown: false, isCommonShown: false, onInputAmountChanged: () => this.handleEnterAmount(true) })),
                    this.$render("i-hstack", { horizontalAlignment: "center" },
                        this.$render("i-icon", { width: 20, height: 20, name: "plus", fill: "#fff" })),
                    this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem" },
                        this.$render("i-scom-token-input", { id: "secondTokenInput", title: "Output", width: "100%", isBtnMaxShown: false, isBalanceShown: false, isCommonShown: false, onInputAmountChanged: () => this.handleEnterAmount() })),
                    this.$render("i-vstack", { id: "pricePanel", padding: { top: '1rem', bottom: '1rem', right: '1rem', left: '1rem' }, border: { color: '#E53780', width: '1px', style: 'solid', radius: 12 }, margin: { top: 10, bottom: 10 }, gap: "0.5rem", visible: false },
                        this.$render("i-label", { margin: { bottom: 12 }, caption: "Prices and pool share" }),
                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center" },
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbFirstPrice", caption: "-" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbFirstPriceTitle", opacity: 0.7, caption: "per" }))),
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbSecondPrice", caption: "-" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbSecondPriceTitle", opacity: 0.7, caption: "per" }))),
                            this.$render("i-panel", null,
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { id: "lbShareOfPool", caption: "0%" })),
                                this.$render("i-panel", { class: "text-center" },
                                    this.$render("i-label", { opacity: 0.7, caption: "Share of pool" }))))),
                    this.$render("i-button", { id: "btnApprove", visible: false, class: "btn-swap", height: "65", caption: "Approve", rightIcon: { spin: true, visible: false }, onClick: this.handleApprove }),
                    this.$render("i-button", { id: "btnRemove", class: "btn-swap", enabled: false, height: "65", caption: '', rightIcon: { spin: true, visible: false }, onClick: this.handleAction }),
                    this.$render("i-vstack", { id: "pnlInfo" })),
                this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })));
        }
    };
    __decorate([
        (0, components_5.observable)()
    ], ScomAmmPoolRemove.prototype, "removeInfo", void 0);
    ScomAmmPoolRemove = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-amm-pool-remove')
    ], ScomAmmPoolRemove);
    exports.ScomAmmPoolRemove = ScomAmmPoolRemove;
});
define("@scom/scom-amm-pool/liquidity/index.tsx", ["require", "exports", "@scom/scom-amm-pool/liquidity/add.tsx", "@scom/scom-amm-pool/liquidity/remove.tsx"], function (require, exports, add_1, remove_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomAmmPoolRemove = exports.ScomAmmPoolAdd = void 0;
    Object.defineProperty(exports, "ScomAmmPoolAdd", { enumerable: true, get: function () { return add_1.ScomAmmPoolAdd; } });
    Object.defineProperty(exports, "ScomAmmPoolRemove", { enumerable: true, get: function () { return remove_1.ScomAmmPoolRemove; } });
});
define("@scom/scom-amm-pool/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-amm-pool/data.json.ts'/> 
    const InfuraId = "adc596bf88b648e2a8902bc9093930c5";
    exports.default = {
        "infuraId": InfuraId,
        "networks": [
            {
                "chainId": 97,
                "explorerTxUrl": "https://testnet.bscscan.com/tx/",
                "explorerAddressUrl": "https://testnet.bscscan.com/address/"
            },
            {
                "chainId": 43113,
                "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
                "explorerAddressUrl": "https://testnet.snowtrace.io/address/"
            }
        ],
        "proxyAddresses": {
            "97": "0x9602cB9A782babc72b1b6C96E050273F631a6870",
            "43113": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
        },
        "embedderCommissionFee": "0.01",
        "defaultBuilderData": {
            "providers": [
                {
                    "key": "OpenSwap",
                    "chainId": 97
                },
                {
                    "key": "OpenSwap",
                    "chainId": 43113
                }
            ],
            "mode": "add",
            "tokens": [
                {
                    "address": "0x29386B60e0A9A1a30e1488ADA47256577ca2C385",
                    "chainId": 97
                },
                {
                    "address": "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
                    "chainId": 97
                },
                {
                    "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
                    "chainId": 43113
                },
                {
                    "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                    "chainId": 43113
                }
            ],
            "defaultChainId": 43113,
            "networks": [
                {
                    "chainId": 43113
                },
                {
                    "chainId": 97
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ],
            "showHeader": true,
            "showFooter": true
        }
    };
});
define("@scom/scom-amm-pool/formSchema.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/scom-token-input"], function (require, exports, scom_network_picker_1, scom_token_input_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema = void 0;
    const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
    const networks = chainIds.map(v => { return { chainId: v }; });
    const theme = {
        type: 'object',
        properties: {
            backgroundColor: {
                type: 'string',
                format: 'color'
            },
            fontColor: {
                type: 'string',
                format: 'color'
            },
            inputBackgroundColor: {
                type: 'string',
                format: 'color'
            },
            inputFontColor: {
                type: 'string',
                format: 'color'
            }
        }
    };
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    required: true,
                    enum: [
                        'add',
                        'remove',
                        'both'
                    ]
                },
                tokens: {
                    type: 'array',
                    required: true,
                    items: {
                        type: 'object',
                        properties: {
                            chainId: {
                                type: 'number',
                                enum: chainIds,
                                required: true
                            },
                            address: {
                                type: 'string',
                                required: true
                            }
                        }
                    }
                },
                providers: {
                    type: 'array',
                    required: true,
                    items: {
                        type: 'object',
                        properties: {
                            key: {
                                type: 'string',
                                required: true
                            },
                            chainId: {
                                type: 'number',
                                enum: chainIds,
                                required: true
                            }
                        }
                    }
                },
                dark: theme,
                light: theme
            }
        },
        uiSchema: {
            type: 'Categorization',
            elements: [
                {
                    type: 'Category',
                    label: 'General',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/mode',
                                    options: {
                                        detail: {
                                            type: 'HorizontalLayout'
                                        }
                                    }
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/providers',
                                    options: {
                                        detail: {
                                            type: 'VerticalLayout'
                                        }
                                    }
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/tokens'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'Category',
                    label: 'Theme',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    label: 'Dark',
                                    scope: '#/properties/dark'
                                },
                                {
                                    type: 'Control',
                                    label: 'Light',
                                    scope: '#/properties/light'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        customControls(rpcWalletId) {
            let networkPickers = [];
            let tokenInputs = [];
            return {
                '#/properties/tokens/properties/chainId': {
                    render: () => {
                        const idx = networkPickers.length;
                        networkPickers[idx] = new scom_network_picker_1.default(undefined, {
                            type: 'combobox',
                            networks,
                            onCustomNetworkSelected: () => {
                                var _a;
                                const chainId = (_a = networkPickers[idx].selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId;
                                tokenInputs[idx].targetChainId = chainId;
                            }
                        });
                        return networkPickers[idx];
                    },
                    getData: (control) => {
                        var _a;
                        return (_a = control.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId;
                    },
                    setData: (control, value) => {
                        control.setNetworkByChainId(value);
                        const idx = networkPickers.findIndex(f => f === control);
                        if (tokenInputs[idx])
                            tokenInputs[idx].targetChainId = value;
                    }
                },
                '#/properties/tokens/properties/address': {
                    render: () => {
                        var _a, _b;
                        const idx = tokenInputs.length;
                        tokenInputs[idx] = new scom_token_input_1.default(undefined, {
                            type: 'combobox',
                            isBalanceShown: false,
                            isBtnMaxShown: false,
                            isInputShown: false
                        });
                        tokenInputs[idx].rpcWalletId = rpcWalletId;
                        const chainId = (_b = (_a = networkPickers[idx]) === null || _a === void 0 ? void 0 : _a.selectedNetwork) === null || _b === void 0 ? void 0 : _b.chainId;
                        if (chainId && tokenInputs[idx].targetChainId !== chainId) {
                            tokenInputs[idx].targetChainId = chainId;
                        }
                        return tokenInputs[idx];
                    },
                    getData: (control) => {
                        var _a, _b;
                        return ((_a = control.token) === null || _a === void 0 ? void 0 : _a.address) || ((_b = control.token) === null || _b === void 0 ? void 0 : _b.symbol);
                    },
                    setData: (control, value) => {
                        control.address = value;
                    }
                },
                '#/properties/providers/properties/chainId': {
                    render: () => {
                        const networkPicker = new scom_network_picker_1.default(undefined, {
                            type: 'combobox',
                            networks
                        });
                        return networkPicker;
                    },
                    getData: (control) => {
                        var _a;
                        return (_a = control.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId;
                    },
                    setData: (control, value) => {
                        control.setNetworkByChainId(value);
                    }
                }
            };
        }
    };
    function getProjectOwnerSchema() {
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    mode: {
                        type: 'string',
                        required: true,
                        enum: [
                            'add',
                            'remove',
                            'both'
                        ]
                    },
                    dark: theme,
                    light: theme
                }
            },
            uiSchema: {
                type: 'Categorization',
                elements: [
                    {
                        type: 'Category',
                        label: 'General',
                        elements: [
                            {
                                type: 'VerticalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/mode',
                                        options: {
                                            detail: {
                                                type: 'HorizontalLayout'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'Category',
                        label: 'Theme',
                        elements: [
                            {
                                type: 'VerticalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        label: 'Dark',
                                        scope: '#/properties/dark'
                                    },
                                    {
                                        type: 'Control',
                                        label: 'Light',
                                        scope: '#/properties/light'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
    }
    exports.getProjectOwnerSchema = getProjectOwnerSchema;
});
define("@scom/scom-amm-pool", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-amm-pool/store/index.ts", "@scom/scom-amm-pool/index.css.ts", "@scom/scom-token-list", "@scom/scom-dex-list", "@scom/scom-amm-pool/liquidity/index.tsx", "@scom/scom-commission-fee-setup", "@scom/scom-amm-pool/data.json.ts", "@scom/scom-amm-pool/formSchema.ts", "@scom/scom-amm-pool/API.ts"], function (require, exports, components_6, eth_wallet_7, index_7, index_css_3, scom_token_list_4, scom_dex_list_1, index_8, scom_commission_fee_setup_1, data_json_1, formSchema_1, API_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomAmmPool = class ScomAmmPool extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                providers: [],
                tokens: [],
                defaultChainId: 0,
                wallets: [],
                networks: [],
                mode: 'add'
            };
            this.tag = {};
            this.rpcWalletEvents = [];
            this.initWallet = async () => {
                try {
                    await eth_wallet_7.Wallet.getClientInstance().init();
                    await this.rpcWallet.init();
                }
                catch (_a) { }
            };
            this.connectWallet = async () => {
                if (!(0, index_7.isClientWalletConnected)()) {
                    await components_6.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.networks;
                    this.mdWallet.wallets = this.wallets;
                    this.mdWallet.showModal();
                    return;
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_7.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.chainId);
                }
            };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get chainId() {
            return this.state.getChainId();
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        get providers() {
            return this._data.providers;
        }
        set providers(value) {
            this._data.providers = value;
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
        }
        get wallets() {
            var _a;
            return (_a = this._data.wallets) !== null && _a !== void 0 ? _a : [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            var _a;
            return (_a = this._data.networks) !== null && _a !== void 0 ? _a : [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            var _a;
            return (_a = this._data.showHeader) !== null && _a !== void 0 ? _a : true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        get commissions() {
            var _a;
            return (_a = this._data.commissions) !== null && _a !== void 0 ? _a : [];
        }
        set commissions(value) {
            this._data.commissions = value;
        }
        get mode() {
            var _a;
            return (_a = this._data.mode) !== null && _a !== void 0 ? _a : 'add';
        }
        set mode(value) {
            this._data.mode = value;
        }
        get tokens() {
            var _a;
            return (_a = this._data.tokens) !== null && _a !== void 0 ? _a : [];
        }
        set tokens(value) {
            this._data.tokens = value;
        }
        get isRemoveLiquidity() {
            var _a;
            return ((_a = this._data) === null || _a === void 0 ? void 0 : _a.mode) === 'remove';
        }
        get isAddLiquidity() {
            var _a;
            return ((_a = this._data) === null || _a === void 0 ? void 0 : _a.mode) === 'add';
        }
        _getActions(category) {
            var _a;
            const self = this;
            const actions = [
                {
                    name: 'Commissions',
                    icon: 'dollar-sign',
                    command: (builder, userInputData) => {
                        let _oldData = {
                            providers: [],
                            tokens: [],
                            defaultChainId: 0,
                            wallets: [],
                            networks: [],
                            mode: 'add'
                        };
                        return {
                            execute: async () => {
                                _oldData = Object.assign({}, this._data);
                                if (userInputData.commissions)
                                    this._data.commissions = userInputData.commissions;
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = Object.assign({}, _oldData);
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_6.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions || [],
                                fee: this.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_6.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_6.Button(hstack, {
                                caption: 'Confirm',
                                width: '100%',
                                height: 40,
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            vstack.append(config);
                            vstack.append(hstack);
                            button.onClick = async () => {
                                const commissions = config.commissions;
                                if (onConfirm)
                                    onConfirm(true, { commissions });
                            };
                            return vstack;
                        }
                    }
                }
            ];
            if (category && category !== 'offers') {
                actions.push({
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {
                            providers: [],
                            tokens: [],
                            defaultChainId: 0,
                            wallets: [],
                            networks: [],
                            mode: 'add'
                        };
                        let oldTag = {};
                        return {
                            execute: async () => {
                                var _a, _b;
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { mode, providers, tokens } = userInputData, themeSettings = __rest(userInputData, ["mode", "providers", "tokens"]);
                                const generalSettings = {
                                    mode,
                                    providers,
                                    tokens
                                };
                                this._data.mode = generalSettings.mode;
                                this._data.providers = generalSettings.providers;
                                this._data.tokens = [];
                                if (generalSettings.tokens) {
                                    for (let inputToken of generalSettings.tokens) {
                                        const tokenAddress = (_a = inputToken.address) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                                        const nativeToken = scom_token_list_4.ChainNativeTokenByChainId[inputToken.chainId];
                                        if (!tokenAddress || tokenAddress === ((_b = nativeToken === null || nativeToken === void 0 ? void 0 : nativeToken.symbol) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                                            if (nativeToken)
                                                this._data.tokens.push(Object.assign(Object.assign({}, nativeToken), { chainId: inputToken.chainId }));
                                        }
                                        else {
                                            const tokens = scom_token_list_4.DefaultERC20Tokens[inputToken.chainId];
                                            const token = tokens.find(v => v.address === inputToken.address);
                                            if (token)
                                                this._data.tokens.push(Object.assign(Object.assign({}, token), { chainId: inputToken.chainId }));
                                        }
                                    }
                                }
                                await this.resetRpcWallet();
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(themeSettings);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.refreshUI();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(userInputData);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema,
                    customControls: formSchema_1.default.customControls((_a = this.rpcWallet) === null || _a === void 0 ? void 0 : _a.instanceId)
                });
            }
            return actions;
        }
        getData() {
            return this._data;
        }
        async resetRpcWallet() {
            var _a;
            this.removeRpcWalletEvents();
            const rpcWalletId = await this.state.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.rpcWallet;
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                await this.initializeWidgetConfig();
                if (this.poolAdd)
                    this.poolAdd.onChainChange();
                if (this.poolRemove)
                    this.poolRemove.onChainChange();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.Connected, async (connected) => {
                if (this.poolAdd)
                    this.poolAdd.onWalletConnected(connected);
                if (this.poolRemove)
                    this.poolRemove.onWalletConnected(connected);
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            const data = {
                defaultChainId: this.defaultChainId,
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.setData)
                this.dappContainer.setData(data);
        }
        async setData(config) {
            this._data = config;
            await this.resetRpcWallet();
            await this.refreshUI();
        }
        async refreshUI() {
            await this.initializeWidgetConfig();
        }
        async getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            var _a;
            this.tag[type] = (_a = this.tag[type]) !== null && _a !== void 0 ? _a : {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.dappContainer)
                this.dappContainer.setTag(this.tag);
            this.updateTheme();
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c, _d, _e;
            const themeVar = ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.theme) || 'light';
            this.updateStyle('--text-primary', (_b = this.tag[themeVar]) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag[themeVar]) === null || _c === void 0 ? void 0 : _c.backgroundColor);
            this.updateStyle('--input-font_color', (_d = this.tag[themeVar]) === null || _d === void 0 ? void 0 : _d.inputFontColor);
            this.updateStyle('--input-background', (_e = this.tag[themeVar]) === null || _e === void 0 ? void 0 : _e.inputBackgroundColor);
        }
        getProjectOwnerActions() {
            const formSchema = (0, formSchema_1.getProjectOwnerSchema)();
            const actions = [
                {
                    name: 'Settings',
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema
                }
            ];
            return actions;
        }
        getConfigurators() {
            const self = this;
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getProxySelectors: async () => {
                        const selectors = await (0, API_3.getProviderProxySelectors)(this.state, this._data.providers);
                        return selectors;
                    },
                    getDexProviderOptions: (chainId) => {
                        const providers = this.state.getDexInfoList({ chainId });
                        return providers;
                    },
                    getPair: async (market, tokenA, tokenB) => {
                        const pair = await (0, API_3.getPair)(this.state, market, tokenA, tokenB);
                        return pair;
                    },
                    getActions: () => {
                        return this.getProjectOwnerActions();
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData(data);
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this._getActions(category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    elementName: 'i-scom-amm-pool-config',
                    getLinkParams: () => {
                        const commissions = this._data.commissions || [];
                        return {
                            data: window.btoa(JSON.stringify(commissions))
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const decodedString = window.atob(params.data);
                            const commissions = JSON.parse(decodedString);
                            let resultingData = Object.assign(Object.assign({}, self._data), { commissions });
                            await this.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = Object.assign(Object.assign({}, self._data), data);
                            await this.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = this.state.embedderCommissionFee;
                        return Object.assign(Object.assign({}, this._data), { fee });
                    },
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        async updateBalance() {
            const rpcWallet = this.state.getRpcWallet();
            if (rpcWallet.address) {
                await scom_token_list_4.tokenStore.updateAllTokenBalances(rpcWallet);
            }
        }
        async initializeWidgetConfig() {
            const chainId = this.state.getChainId();
            scom_token_list_4.tokenStore.updateTokenMapData(chainId);
            await this.initWallet();
            await this.updateBalance();
            this.vStackAmmPool.clearInnerHTML();
            if (this.isAddLiquidity) {
                this.poolAdd = new index_8.ScomAmmPoolAdd(undefined, {
                    state: this.state,
                    providers: this.providers,
                    commissions: this.commissions,
                    tokens: this.tokens
                });
                this.vStackAmmPool.appendChild(this.poolAdd);
            }
            else if (this.isRemoveLiquidity) {
                this.poolRemove = new index_8.ScomAmmPoolRemove(undefined, {
                    state: this.state,
                    providers: this.providers,
                    tokens: this.tokens
                });
                this.vStackAmmPool.appendChild(this.poolRemove);
            }
            else {
                const tabs = new components_6.Tabs();
                this.vStackAmmPool.appendChild(tabs);
                this.poolAdd = new index_8.ScomAmmPoolAdd(undefined, {
                    state: this.state,
                    providers: this.providers,
                    commissions: this.commissions,
                    tokens: this.tokens
                });
                this.poolRemove = new index_8.ScomAmmPoolRemove(undefined, {
                    state: this.state,
                    providers: this.providers,
                    tokens: this.tokens
                });
                tabs.add({ caption: 'Add Liquidity', icon: { name: 'plus-circle', fill: Theme.text.primary }, children: this.poolAdd });
                tabs.add({ caption: 'Remove Liquidity', icon: { name: 'minus-circle', fill: Theme.text.primary }, children: this.poolRemove });
                tabs.activeTabIndex = 0;
            }
            if (this.poolAdd) {
                this.poolAdd.connectWallet = () => this.connectWallet();
            }
            if (this.poolRemove) {
                this.poolRemove.connectWallet = () => this.connectWallet();
            }
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            this.state = new index_7.State(data_json_1.default);
            const dexList = (0, scom_dex_list_1.default)();
            this.state.setDexInfoList(dexList);
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const mode = this.getAttribute('mode', true);
                const tokens = this.getAttribute('tokens', true, []);
                const defaultChainId = this.getAttribute('defaultChainId', true);
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const providers = this.getAttribute('providers', true, []);
                const commissions = this.getAttribute('commissions', true, []);
                await this.setData({ commissions, mode, providers, tokens, defaultChainId, networks, wallets });
            }
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        onHide() {
            this.dappContainer.onHide();
            this.removeRpcWalletEvents();
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-panel", { class: index_css_3.poolStyle, background: { color: Theme.background.main } },
                    this.$render("i-panel", { width: "100%", padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' } },
                        this.$render("i-vstack", { id: "vStackAmmPool", margin: { top: '0.5rem', left: 'auto', right: 'auto', bottom: '0.75rem' }, padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }, border: { radius: '1rem' }, width: "100%", maxWidth: 520 })),
                    this.$render("i-scom-commission-fee-setup", { visible: false }),
                    this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }))));
        }
    };
    ScomAmmPool = __decorate([
        components_6.customModule,
        (0, components_6.customElements)('i-scom-amm-pool')
    ], ScomAmmPool);
    exports.default = ScomAmmPool;
});
