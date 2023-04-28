const InfuraId = "adc596bf88b648e2a8902bc9093930c5";

export default {
  "name": "@scom/scom-amm-pool/main",
  "version": "0.1.0",
  "moduleDir": "src",
  "main": "@scom/scom-amm-pool/main",
  "modules": {},
  "dependencies": {
    "@ijstech/eth-contract": "*",
    "@scom/oswap-openswap-contract": "*"
  },
  "infuraId": InfuraId,
  "networks": [  
    {
      "chainId": 97,
      "isMainChain": true,
      "isCrossChainSupported": true,
      "explorerName": "BSCScan",
      "explorerTxUrl": "https://testnet.bscscan.com/tx/",
      "explorerAddressUrl": "https://testnet.bscscan.com/address/",
      "isTestnet": true
    },    
    {
      "chainId": 43113,
      "shortName": "AVAX Testnet",
      "isCrossChainSupported": true,
      "explorerName": "SnowTrace",
      "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
      "explorerAddressUrl": "https://testnet.snowtrace.io/address/",
      "isTestnet": true
    }    
  ],
  "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/"
}