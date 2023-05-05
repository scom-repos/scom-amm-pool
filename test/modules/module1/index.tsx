import { Module, customModule, Container, VStack } from '@ijstech/components'
import ScomAmmPool from '@scom/scom-amm-pool'
@customModule
export default class Module1 extends Module {
  private _providers: any[] = [];
  private el: ScomAmmPool;
  private mainStack: VStack;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
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

  async init() {
    super.init()
    this.el = await ScomAmmPool.create({
      "providers": this._providers,
      "tokens": [
        {
          "name": "OpenSwap",
          "address": "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
          "symbol": "OSWAP",
          "decimals": 18,
          "chainId": 97
        },
        {
          "name": "BUSD",
          "address": "0xDe9334C157968320f26e449331D6544b89bbD00F",
          "symbol": "BUSD",
          "decimals": 6,
          "chainId": 97
        },
        {
          "name": "OpenSwap",
          "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
          "symbol": "OSWAP",
          "decimals": 18,
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
      mode: 'remove-liquidity'
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
          ></i-scom-amm-pool>
        </i-vstack>
      </i-panel>
    )
  }
}
