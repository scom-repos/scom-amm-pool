import { Wallet, BigNumber, ISendTxEventsOptions, Utils } from "@ijstech/eth-wallet";
import { Contracts } from "@scom/oswap-openswap-contract";
import { ITokenObject } from "@scom/scom-token-list";

export const registerSendTxEvents = (sendTxEventHandlers: ISendTxEventsOptions) => {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error: Error, receipt?: string) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt: any) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    },
  })
}

export const approveERC20Max = async (token: ITokenObject, spenderAddress: string, callback?: any, confirmationCallback?: any) => {
  let wallet = Wallet.getClientInstance() as any;
  let amount = new BigNumber(2).pow(256).minus(1);
  let erc20 = new Contracts.ERC20(wallet, token.address);
  registerSendTxEvents({
    transactionHash: callback,
    confirmation: confirmationCallback
  })
  let receipt = await erc20.approve({
    spender: spenderAddress,
    amount
  });
  return receipt;
}

export const getERC20Allowance = async (token: ITokenObject, spenderAddress: string) => {
  if (!token?.address) return null;
  let wallet = Wallet.getClientInstance();
  let erc20 = new Contracts.ERC20(wallet, token.address);
  let allowance = await erc20.allowance({
    owner: wallet.account.address,
    spender: spenderAddress
  });
  return Utils.fromDecimals(allowance, token.decimals || 18);
}
