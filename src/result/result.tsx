import { customElements, Module, ControlElement, Modal, Panel, Label, Image, Button, Container, VStack } from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';
import { parseContractError } from '../global/index';
import { getNetworkExplorerName, viewOnExplorerByTxHash } from '../store/index';
import styleClass from './result.css';
import Assets from '../assets';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['i-scom-amm-pool-result']: ControlElement;
		}
	}
};

export interface IMessage {
  status: 'warning' | 'success' | 'error',
  content?: any,
  txtHash?: string,
  obj?: any,
  customRedirect?: any,
}

@customElements('i-scom-amm-pool-result')
export class Result extends Module {
  private confirmModal: Modal;
  private mainContent: Panel;
  private _message: any;
  public onCustomClose: any;

  get message(): IMessage {
    return this._message;
  }

  set message(value: IMessage) {
    this._message = value;
    this.renderUI();
  }

	constructor(parent?: Container, options?: any) {
		super(parent, options);
	};

	async init(){
		this.classList.add(styleClass);
		super.init();
    this.confirmModal.onClose = () => {
      if (this.onCustomClose) {
        this.onCustomClose();
      }
      this.onCloseRedirect();
    }
  }

  closeModal() {
    this.confirmModal.visible = false;
  }

  showModal() {
    this.confirmModal.visible = true;
  }

  onCloseRedirect() {
    const customRedirect = this.message?.customRedirect;
    if (customRedirect && customRedirect.name) {
      this._message.customRedirect = null;
      if (customRedirect.params) {
        const queries = new URLSearchParams(customRedirect.params).toString();
        window.location.assign(`/#/${customRedirect.name}?${queries}`);
      } else {
        window.location.assign(`/#/${customRedirect.name}`);
      }
    }
  }

  async buildLink() {
    if (this.message.txtHash) {
      const chainId: number = await Wallet.getClientInstance().getChainId();
      viewOnExplorerByTxHash(chainId, this.message.txtHash);
    }
  }

  async renderUI() {
    this.mainContent.innerHTML = '';
    const mainSection = await VStack.create({
      horizontalAlignment: 'center'
    });
    if (this.message.status === 'warning') {
      mainSection.id = "warningSection";
      const loading = (
        <i-panel height={100}>
          <i-vstack id="loadingElm" class="i-loading-overlay" height="100%" background={{color:"transparent"}}>
            <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
              <i-icon 
                class="i-loading-spinner_icon"
                image={{ url: Assets.fullPath('img/loading.svg'), width: 24, height: 24 }}
              ></i-icon>
              <i-label caption="Loading..." font={{ color: '#FD4A4C' }} class="i-loading-spinner_text"></i-label>
            </i-vstack>
          </i-vstack>
        </i-panel>
      )
      mainSection.appendChild(loading);
      const section = new VStack();
      section.margin={ bottom: 20 };
      const captionList = ['Waiting For Confirmation', this.message.content || '', 'Confirm this transaction in your wallet'];
      const classList = ['waiting-txt mb-1', 'mb-1', 'confirm-txt'];
      for (let i = 0; i < captionList.length; i++) {
        const caption = captionList[i];
        const label = await Label.create();
        label.caption = caption;
        if (classList[i]) {
          const classes = classList[i].split(' ');
          classes.forEach(className => label.classList.add(className));
        }
        section.appendChild(label);
      };
      mainSection.appendChild(section);
    } else if (this.message.status === 'success') {
      const chainId: number = await Wallet.getClientInstance().getChainId();
      const explorerName = getNetworkExplorerName(chainId);
      
      const image = await Image.create({
        width: '50px',
        url: Assets.fullPath('img/success-icon.svg'),
        margin: {bottom: '1rem'},
        display: 'inline-block'
      });
      mainSection.appendChild(image);
      
      const label = await Label.create();
      label.caption = 'Transaction Submitted';
      label.classList.add("waiting-txt");
      mainSection.appendChild(label);

      const contentSection = await Panel.create();
      contentSection.id = "contentSection";
      mainSection.appendChild(contentSection);

      const contentLabel = await Label.create();
      contentLabel.caption = this.message.content || '';
      contentSection.appendChild(contentLabel);

      if (this.message.txtHash) {
        const section = new VStack();

        const label1 = await Label.create({
          caption: this.message.txtHash.substr(0, 33),
          margin: { bottom: 4 }
        });
        section.appendChild(label1);

        const label2 = await Label.create({
          caption: this.message.txtHash.substr(33, this.message.txtHash.length),
          margin: {bottom: '1rem'}
        });
        section.appendChild(label2);

        const link = await Label.create({
          caption: `View on ${explorerName}`,
        });

        link.onClick = this.buildLink.bind(this);
        link.classList.add("red-link", "block", "pointer");
        section.appendChild(link);
        contentSection.appendChild(section);
      }

      const button = new Button(mainSection, {
        width: '100%',
        caption: 'Close',
        margin: {top: '1rem'}
      });
      button.classList.add('btn-os');
      button.onClick = () => this.closeModal();
      mainSection.appendChild(button);
    } else {
      const image = await Image.create({
        width: '50px',
        url: Assets.fullPath('img/oswap_error.png'),
        margin: {bottom: '1rem'},
        display: 'inline-block'
      });
      mainSection.appendChild(image);

      const label = await Label.create({
        caption: 'Transaction Rejected.',
        margin: {bottom: '1rem'}
      });
      label.classList.add("waiting-txt");
      mainSection.appendChild(label);

      const section = await VStack.create();
      section.id = "contentSection";
      const contentLabel =  await Label.create({
        caption: await this.onErrMsgChanged(),
        margin: {bottom: '1rem'}
      });
      section.appendChild(contentLabel);
      mainSection.appendChild(section);

      const button = new Button(mainSection, {
        width: '100%',
        caption: 'Cancel',
        margin: {top: '1rem'}
      });
      button.classList.add('btn-os');
      button.onClick = () => this.closeModal();
      mainSection.appendChild(button);
    }
    this.mainContent.clearInnerHTML();
    this.mainContent.appendChild(mainSection);
  }

  async onErrMsgChanged() {
    if (this.message.status !== 'error') return this.message.content;

    if (this.message.content.message && this.message.content.message.includes('Internal JSON-RPC error.')) {
      this.message.content.message = JSON.parse(this.message.content.message.replace('Internal JSON-RPC error.\n', '')).message;
    }
    
    return await parseContractError(this.message.content.message, this.message.obj);
  }

	render() {
		return (
      <i-modal
        id="confirmModal"
        closeIcon={{ name: 'times' }}
        class="confirm-modal"
        minHeight="280px"
      >
        <i-panel id="mainContent" class="i-modal_content" />
      </i-modal>
		)
	}
};
