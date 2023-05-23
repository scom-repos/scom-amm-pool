import {
  Module,
  customModule,
  customElements,
  ControlElement,
  Control,
  Styles,
  Input,
  Table,
  Icon,
  Modal,
  Label,
  Button,
  VStack,
  HStack,
  Panel
} from '@ijstech/components';
import { BigNumber } from '@ijstech/eth-wallet';
import ScomNetworkPicker from '@scom/scom-network-picker';
import { getEmbedderCommissionFee, getNetworkInfo, getSupportedNetworks } from '../store/index';
import { IExtendedNetwork, formatNumber, isWalletAddress, ICommissionInfo, IEmbedData } from '../global/index';
import { customStyle, tableStyle } from './index.css'
const Theme = Styles.Theme.ThemeVars;

export interface ISupportedNetworks {
  chainId: number;
}

interface ScomAmmPoolConfigElement extends ControlElement {
  commissions?: ICommissionInfo;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-amm-pool-config']: ScomAmmPoolConfigElement;
    }
  }
}

const CommissionFeeTooltipText = "For each transaction, you'll receive a 1% commission fee based on the total amount. This fee will be transferred to a designated commission contract within the corresponding blockchain network.";

@customModule
@customElements("i-scom-amm-pool-config")
export default class Config extends Module {
  private tableCommissions: Table;
  private modalAddCommission: Modal;
  private networkPicker: ScomNetworkPicker;
  private inputWalletAddress: Input;
  private lbCommissionShare: Label;
  private btnAddWallet: Button;
  private pnlEmptyWallet: VStack;
  private commissionInfoList: ICommissionInfo[];
  private commissionsTableColumns = [
    {
      title: 'Network',
      fieldName: 'chainId',
      key: 'chainId',
      textAlign: 'left' as any,
      onRenderCell: function (source: Control, columnData: number, rowData: any) {
        const supportedNetworks = getSupportedNetworks();
        const network = supportedNetworks.find(net => net.chainId === columnData)
        if (!network) return new Panel()
        const networkInfo = getNetworkInfo(network.chainId)
        const imgUrl = networkInfo.image || ''
        const hstack = new HStack(undefined, {
          verticalAlignment: 'center',
          gap: 5
        })
        const imgEl = new Icon(hstack, {
          image: { url: imgUrl, width: 16, height: 16 }
        })
        const lbName = new Label(hstack, {
          caption: networkInfo.chainName || '',
          font: { size: '0.875rem' }
        })
        hstack.append(imgEl, lbName);
        return hstack;
      }
    },
    {
      title: 'Wallet',
      fieldName: 'walletAddress',
      key: 'walletAddress',
      onRenderCell: function (source: Control, columnData: string, rowData: any) {
        const replaced = columnData.slice(6, columnData.length - 9)
        const caption = (columnData?.length < 15) ? columnData : columnData.replace(replaced, '...')
        return new Label(undefined, {
          caption: caption || '',
          font: { size: '0.875rem' },
          tooltip: {
            content: columnData
          }
        })
      }
    },
    {
      title: '',
      fieldName: '',
      key: '',
      textAlign: 'center' as any,
      onRenderCell: async (source: Control, data: any, rowData: any) => {
        const icon = new Icon(undefined, {
          name: "edit",
          fill: Theme.text.primary,
          height: 14,
          width: 14
        })
        icon.onClick = async (source: Control) => {
          this.networkPicker.setNetworkByChainId(rowData.chainId);
          this.inputWalletAddress.value = rowData.walletAddress;
          this.modalAddCommission.visible = true;
        }
        icon.classList.add('pointer')
        return icon;
      }
    },
    {
      title: '',
      fieldName: '',
      key: '',
      textAlign: 'center' as any,
      onRenderCell: async (source: Control, data: any, rowData: any) => {
        const icon = new Icon(undefined, {
          name: "times",
          fill: Theme.colors.primary.main,
          height: 14,
          width: 14
        })
        icon.onClick = async (source: Control) => {
          const index = this.commissionInfoList.findIndex(v => v.walletAddress == rowData.walletAddress && v.chainId == rowData.chainId);
          if (index >= 0) {
            this.commissionInfoList.splice(index, 1);
            this.tableCommissions.data = this.commissionInfoList;
            this.toggleVisible();
            if (this._onCustomCommissionsChanged) {
              await this._onCustomCommissionsChanged({
                commissions: this.commissionInfoList
              });
            }
          }
        }
        icon.classList.add('pointer')
        return icon;
      }
    }
  ]
  private btnConfirm: Button;
  private lbErrMsg: Label;
  private _onCustomCommissionsChanged: (data: any) => Promise<void>;

  async init() {
    super.init();
    const embedderFee = getEmbedderCommissionFee();
    this.lbCommissionShare.caption = `${formatNumber(new BigNumber(embedderFee).times(100).toFixed(), 4)} %`;
    const commissions = this.getAttribute('commissions', true, []);
    this.commissionInfoList = commissions;
    this.tableCommissions.data = commissions;
    this.toggleVisible();
  }

  get data(): IEmbedData {
    const config: IEmbedData = {
    };
    config.commissions = this.tableCommissions.data || [];
    return config;
  }

  set data(config: IEmbedData) {
    if (!this.tableCommissions) return;
    this.tableCommissions.data = config.commissions || [];
    this.toggleVisible();
  }

  get onCustomCommissionsChanged(): (data: any) => Promise<void> {
    return this._onCustomCommissionsChanged;
  }

  set onCustomCommissionsChanged(value: (data: any) => Promise<void>) {
    this._onCustomCommissionsChanged = value;
  }

  getSupportedChainIds() {
    return getSupportedNetworks().map(v => ({ chainId: v.chainId }))
  }

  onModalAddCommissionClosed() {
    this.networkPicker.clearNetwork();
    this.inputWalletAddress.value = '';
    this.lbErrMsg.caption = '';
  }

  onAddCommissionClicked() {
    this.modalAddCommission.visible = true;
  }

  async onConfirmCommissionClicked() {
    const embedderFee = getEmbedderCommissionFee();
    this.commissionInfoList.push({
      chainId: this.networkPicker.selectedNetwork?.chainId,
      walletAddress: this.inputWalletAddress.value,
      share: embedderFee
    })
    this.tableCommissions.data = this.commissionInfoList;
    this.toggleVisible();
    this.modalAddCommission.visible = false;

    if (this._onCustomCommissionsChanged) {
      await this._onCustomCommissionsChanged({
        commissions: this.commissionInfoList
      });
    }
  }

  validateModalFields() {
    if (!this.networkPicker.selectedNetwork) {
      this.lbErrMsg.caption = 'Please select network';
    }
    else if (this.commissionInfoList.find(v => v.chainId == this.networkPicker.selectedNetwork.chainId)) {
      this.lbErrMsg.caption = 'This network already exists';
    }
    else if (!this.inputWalletAddress.value) {
      this.lbErrMsg.caption = 'Please enter wallet address';
    }
    else if (!isWalletAddress(this.inputWalletAddress.value)) {
      this.lbErrMsg.caption = 'Please enter valid wallet address';
    }
    else {
      this.lbErrMsg.caption = '';
    }

    if (this.lbErrMsg.caption) {
      this.btnConfirm.enabled = false;
      return false;
    }
    else {
      this.btnConfirm.enabled = true;
      return true;
    }
  }

  onNetworkSelected(network: IExtendedNetwork) {
    this.validateModalFields();
  }

  onInputWalletAddressChanged() {
    this.validateModalFields();
  }

  private toggleVisible() {
    const hasData = !!this.tableCommissions?.data?.length;
    this.tableCommissions.visible = hasData;
    this.pnlEmptyWallet.visible = !hasData;
    this.btnAddWallet.visible = hasData;
  }

  render() {
    return (
      <i-vstack gap='0.5rem' padding={{ top: '1rem', bottom: '1rem' }} class={customStyle}>
        <i-vstack gap="5px">
          <i-hstack
            horizontalAlignment="space-between"
            verticalAlignment="center"
            gap="4px"
          >
            <i-hstack gap="4px">
              <i-label caption="Commission Fee: " opacity={0.6} font={{ size: '1rem' }}></i-label>
              <i-label id="lbCommissionShare" font={{ size: '1rem' }}></i-label>
              <i-icon name="question-circle" fill={Theme.background.modal} width={20} height={20} tooltip={{content: CommissionFeeTooltipText}}></i-icon>
            </i-hstack>
            <i-button
              id="btnAddWallet"
              caption="Add Wallet"
              border={{ radius: '58px' }}
              padding={{ top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }}
              background={{ color: Theme.colors.primary.main }}
              font={{ color: Theme.colors.primary.contrastText, size: '0.75rem', weight: 400 }}
              visible={false}
              onClick={this.onAddCommissionClicked.bind(this)}
            ></i-button>
          </i-hstack>
          <i-vstack
            id="pnlEmptyWallet"
            border={{ radius: '8px' }}
            background={{ color: Theme.background.modal }}
            padding={{ top: '1.875rem', bottom: '1.875rem', left: '1.563rem', right: '1.563rem' }}
            gap="1.25rem" width="100%"
            class="text-center"
          >
            <i-label caption="To receive commission fee please add your wallet address" font={{ size: '1rem' }}></i-label>
            <i-panel>
              <i-button
                caption="Add Wallet"
                border={{ radius: '58px' }}
                padding={{ top: '0.75rem', bottom: '0.75rem', left: '2.5rem', right: '2.5rem' }}
                background={{ color: Theme.colors.primary.main }}
                font={{ color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 400 }}
                onClick={this.onAddCommissionClicked.bind(this)}
              ></i-button>
            </i-panel>
          </i-vstack>
        </i-vstack>
        <i-table
          id='tableCommissions'
          visible={false}
          data={this.commissionInfoList}
          columns={this.commissionsTableColumns}
          class={tableStyle}
        ></i-table>
        <i-modal
          id='modalAddCommission' maxWidth='600px' closeIcon={{ name: 'times-circle' }} onClose={this.onModalAddCommissionClosed}>
          <i-grid-layout
            width='100%'
            verticalAlignment='center' gap={{ row: '1rem' }}
            padding={{ top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' }}
            templateColumns={['1fr', '3fr']}
            templateRows={['auto', 'auto', 'auto', 'auto']}
            templateAreas={
              [
                ['title', 'title'],
                ['lbNetwork', 'network'],
                ["lbWalletAddress", "walletAddress"],
                ["lbErrMsg", "errMsg"],
                ['btnConfirm', 'btnConfirm']
              ]
            }>

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'title' }} margin={{ bottom: '1.5rem' }}>
              <i-label caption="Add Wallet" font={{ size: '1.5rem' }}></i-label>
            </i-hstack>

            <i-label caption="Network" grid={{ area: 'lbNetwork' }} font={{ size: '1rem' }} />
            <i-scom-network-picker
              id='networkPicker'
              grid={{ area: 'network' }}
              display="block"
              type='combobox'
              networks={this.getSupportedChainIds()}
              background={{ color: Theme.combobox.background }}
              border={{ radius: 8, width: '1px', style: 'solid', color: Theme.input.background }}
              onCustomNetworkSelected={this.onNetworkSelected}
              class="pool-network-select"
            />

            <i-label caption="Wallet Address" grid={{ area: 'lbWalletAddress' }} font={{ size: '1rem' }} />
            <i-input
              id='inputWalletAddress'
              grid={{ area: 'walletAddress' }}
              width='100%' height={45}
              border={{ radius: 8, width: '1px', style: 'solid', color: Theme.divider }}
              onChanged={this.onInputWalletAddressChanged}
            />

            <i-label id='lbErrMsg' font={{ color: '#ed5748' }} grid={{ area: 'errMsg' }}></i-label>

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'btnConfirm' }} margin={{ top: '1.25rem' }}>
              <i-button
                id="btnConfirm"
                enabled={false}
                caption="Add Wallet"
                border={{ radius: '58px' }}
                padding={{ top: '0.75rem', bottom: '0.75rem', left: '2.5rem', right: '2.5rem' }}
                background={{ color: Theme.colors.primary.main }}
                font={{ color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 400 }}
                onClick={this.onConfirmCommissionClicked.bind(this)}
              ></i-button>
            </i-hstack>

          </i-grid-layout>
        </i-modal>
      </i-vstack>
    )
  }
}