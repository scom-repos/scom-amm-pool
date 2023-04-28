import { INetwork } from '@ijstech/eth-wallet';

export interface IExtendedNetwork extends INetwork {
  shortName?: string;
  isDisabled?: boolean;
  isMainChain?: boolean;
  isCrossChainSupported?: boolean;
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  isTestnet?: boolean;
  symbol?: string;
	env?: string;
};

export const enum EventId {
  ConnectWallet = 'connectWallet',
  IsWalletConnected = 'isWalletConnected',
  IsWalletDisconnected = 'IsWalletDisconnected',
  Paid = 'Paid',
  chainChanged = 'chainChanged',
  EmitButtonStatus = 'emitButtonStatus',
  EmitInput = 'emitInput',
  EmitNewToken = 'emitNewToken',
  SlippageToleranceChanged = 'SlippageToleranceChanged',
  ExpertModeChanged = 'ExpertModeChanged',
  ShowTransactionModal = 'ShowTransactionModal'
}

export enum QueueType {
  PRIORITY_QUEUE,
  RANGE_QUEUE,
  GROUP_QUEUE,
  PEGGED_QUEUE
}

export * from './utils/index';
