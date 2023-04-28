import {ITokenObject } from '../global/index';
import { getChainId, getChainNativeToken, isWalletConnected } from './utils';
import { tokenStore, WETHByChainId, assets as tokenAssets } from '@scom/scom-token-list';

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const getWETH = (chainId: number): ITokenObject => {
  let wrappedToken = WETHByChainId[chainId];
  return wrappedToken;
};

export const getTokenDecimals = (address: string) => {
  let chainId = getChainId();
  const WETHAddress = getWETH(chainId).address;
  const ChainNativeToken = getChainNativeToken(chainId);
  const tokenObject = (!address || address.toLowerCase() === WETHAddress.toLowerCase()) ? ChainNativeToken : tokenStore.tokenMap[address.toLowerCase()];
  return tokenObject ? tokenObject.decimals : 18;
}

export const getTokenIcon = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let ChainNativeToken;
  let tokenObject;
  if (isWalletConnected()){
    ChainNativeToken = getChainNativeToken(getChainId());
    tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
  } else {
    tokenObject = tokenMap[address.toLowerCase()];
  }
  return tokenAssets.tokenPath(tokenObject, getChainId());
}

export const tokenSymbol = (address: string) => {
  const tokenMap = tokenStore.tokenMap;
  if (!address || !tokenMap) return '';
  let tokenObject = tokenMap[address.toLowerCase()];
  if (!tokenObject) tokenObject = tokenMap[address];
  return tokenObject ? tokenObject.symbol : '';
}

export const tokenName = (address: string) => {
  const tokenMap = tokenStore.tokenMap;
  if (!address || !tokenMap) return '';
  let tokenObject = tokenMap[address.toLowerCase()];
  if (!tokenObject) tokenObject = tokenMap[address];
  return tokenObject?.name || '';
}

export * from './utils';

export const getSupportedTokens = (tokens: ITokenObject[], chainId: number) => {
  return tokens.filter(token => token.chainId === chainId) || []
}
