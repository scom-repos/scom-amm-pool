import ScomNetworkPicker from "@scom/scom-network-picker";
import ScomTokenInput from "@scom/scom-token-input";

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
const networks = chainIds.map(v => { return { chainId: v } });

const theme = {
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
}

export default {
    general: {
        dataSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: "string",
                    required: true,
                    enum: [
                        "add",
                        "remove",
                        "both"
                    ]
                },
                tokens: {
                    type: "array",
                    required: true,
                    items: {
                        type: "object",
                        properties: {
                            chainId: {
                                type: "number",
                                enum: chainIds,
                                required: true
                            },
                            address: {
                                type: "string",
                                required: true
                            }
                        }
                    }
                },
                providers: {
                    type: "array",
                    required: true,
                    items: {
                        type: "object",
                        properties: {
                            caption: {
                                type: "string",
                                required: true
                            },
                            image: {
                                type: "string",
                                required: true
                            },
                            key: {
                                type: "string",
                                required: true
                            },
                            dexId: {
                                type: "number"
                            },
                            chainId: {
                                type: "number",
                                enum: chainIds,
                                required: true
                            }
                        }
                    }
                }
            }
        },
        uiSchema: {
            type: "Group",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/mode",
                    options: {
                        detail: {
                            type: "HorizontalLayout"
                        }
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/providers",
                    options: {
                        detail: {
                            type: "VerticalLayout"
                        }
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/tokens",
                    // options: {
                    //     detail: {
                    //         type: "VerticalLayout"
                    //     }
                    // }
                }
            ]
        },
        customControls(rpcWalletId: string) {
            let networkPickers: ScomNetworkPicker[] = [];
            let tokenInputs: ScomTokenInput[] = [];
            return {
                "#/properties/tokens/properties/chainId": {
                    render: () => {
                        const idx = networkPickers.length;
                        networkPickers[idx] = new ScomNetworkPicker(undefined, {
                            type: 'combobox',
                            networks,
                            onCustomNetworkSelected: () => {
                                const chainId = networkPickers[idx].selectedNetwork?.chainId;
                                tokenInputs[idx].targetChainId = chainId;
                            }
                        });
                        return networkPickers[idx];
                    },
                    getData: (control: ScomNetworkPicker) => {
                        return control.selectedNetwork?.chainId;
                    },
                    setData: (control: ScomNetworkPicker, value: number) => {
                        control.setNetworkByChainId(value);
                        const idx = networkPickers.findIndex(f => f === control);
                        if (tokenInputs[idx]) tokenInputs[idx].targetChainId = value;
                    }
                },
                "#/properties/tokens/properties/address": {
                    render: () => {
                        const idx = tokenInputs.length;
                        tokenInputs[idx] = new ScomTokenInput(undefined, {
                            type: 'combobox',
                            isBalanceShown: false,
                            isBtnMaxShown: false,
                            isInputShown: false
                        });
                        tokenInputs[idx].rpcWalletId = rpcWalletId;
                        const chainId = networkPickers[idx]?.selectedNetwork?.chainId;
                        if (chainId && tokenInputs[idx].targetChainId !== chainId) {
                            tokenInputs[idx].targetChainId = chainId;
                        }
                        return tokenInputs[idx];
                    },
                    getData: (control: ScomTokenInput) => {
                        return control.token?.address || control.token?.symbol;
                    },
                    setData: (control: ScomTokenInput, value: string) => {
                        control.address = value;
                    }
                },
                "#/properties/providers/properties/chainId": {
                    render: () => {
                        const networkPicker = new ScomNetworkPicker(undefined, {
                            type: 'combobox',
                            networks
                        });
                        return networkPicker;
                    },
                    getData: (control: ScomNetworkPicker) => {
                        return control.selectedNetwork?.chainId;
                    },
                    setData: (control: ScomNetworkPicker, value: number) => {
                        control.setNetworkByChainId(value);
                    }
                }
            }
        }
    },
    theme: {
        dataSchema: {
            type: 'object',
            properties: {
                "dark": {
                    type: 'object',
                    properties: theme
                },
                "light": {
                    type: 'object',
                    properties: theme
                }
            }
        }
    }
}