import { Module, customModule, Container, VStack, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomAmmPool from '@scom/scom-amm-pool';
@customModule
export default class Module1 extends Module {
  private _providers: any[] = [];
  private el: ScomAmmPool;
  private mainStack: VStack;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    const multicalls = getMulticallInfoList();
    const networkMap = this.getNetworkMap(options.infuraId);
    application.store = {
      infuraId: options.infuraId,
      multicalls,
      networkMap
    }
    this._providers = [
      {
        caption: 'OpenSwap',
        image: 'libs/@scom/scom-swap/img/swap/openswap.png',
        key: 'OpenSwap',
        dexId: 1,
        chainId: 43113,
        fromToken: '0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C',
        toToken: '0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e',
        routerAddress: '0xc9C6f026E489e0A8895F67906ef1627f1E56860d',
        factoryAddress: '0x9560fD7C36527001D3Fea2510D405F77cB6AD739',
        tradeFee: {
          fee: '200',
          base: '100000',
        },
      }
    ]
  }

  private getNetworkMap = (infuraId?: string) => {
    const networkMap = {};
    const defaultNetworkList: INetwork[] = getNetworkList();
    const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (const chainId in defaultNetworkMap) {
      const networkInfo = defaultNetworkMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      networkMap[networkInfo.chainId] = {
        ...networkInfo,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
      }
    }
    return networkMap;
  }

  async init() {
    super.init()
    this.el = await ScomAmmPool.create({
      "providers": this._providers,
      "tokens": [
        {
          "address": "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
          "chainId": 97
        },
        {
          "address": "0xDe9334C157968320f26e449331D6544b89bbD00F",
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
      mode: 'remove'
    });
    this.mainStack.appendChild(this.el);
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          id='mainStack'
          margin={{ top: '1rem', left: '1rem' }}
          gap='2rem'
        >
          <i-scom-amm-pool
            defaultChainId={43113}
            providers={this._providers}
            networks={[
              {
                chainId: 43113,
              },
              {
                chainId: 97,
              },
            ]}
            wallets={[
              {
                name: 'metamask',
              },
            ]}
            commissions={[
              {
                chainId: 97,
                walletAddress: '0xA81961100920df22CF98703155029822f2F7f033',
                share: '0.01'
              }
            ]}
            mode='add'
          />
          <i-scom-amm-pool
            defaultChainId={43113}
            providers={this._providers}
            networks={[
              {
                chainId: 43113,
              },
              {
                chainId: 97,
              },
            ]}
            wallets={[
              {
                name: 'metamask',
              },
            ]}
            commissions={[
              {
                chainId: 97,
                walletAddress: '0xA81961100920df22CF98703155029822f2F7f033',
                share: '0.01'
              }
            ]}
            mode='both'
          />
        </i-vstack>
      </i-panel>
    )
  }
}
