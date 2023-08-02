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
                                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
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
                                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
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
                    options: {
                        detail: {
                            type: "VerticalLayout"
                        }
                    }
                }
            ]
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