import ScomNetworkPicker from '@scom/scom-network-picker';
import ScomTokenInput from '@scom/scom-token-input';

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
const networks = chainIds.map(v => { return { chainId: v } });

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
}

export default {
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
    customControls(rpcWalletId: string) {
        let networkPickers: ScomNetworkPicker[] = [];
        let tokenInputs: ScomTokenInput[] = [];
        return {
            '#/properties/tokens/properties/chainId': {
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
            '#/properties/tokens/properties/address': {
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
            '#/properties/providers/properties/chainId': {
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
}

export function getProjectOwnerSchema() {
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
    }
}