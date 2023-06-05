const InfuraId = "adc596bf88b648e2a8902bc9093930c5";

export default {
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
  "proxyAddresses": {
    "97": "0x9602cB9A782babc72b1b6C96E050273F631a6870",
    "43113": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
  },
  "embedderCommissionFee": "0.01",
  "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
  "defaultBuilderData": {
    "providers": [
      {
        "caption": "OpenSwap",
        "image": "ipfs://bafkreidoi5pywhyo4hqdltlosvrvefgqj4nuclmjl325exzmjgnyl2cc4y",
        "key": "OpenSwap",
        "dexId": 1,
        "chainId": 97
      },
      {
        "caption": "OpenSwap",
        "image": "ipfs://bafkreidoi5pywhyo4hqdltlosvrvefgqj4nuclmjl325exzmjgnyl2cc4y",
        "key": "OpenSwap",
        "dexId": 1,
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
}