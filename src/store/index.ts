import { ICustomTokenObject } from '../global/index';
import { tokenStore, WETHByChainId, ITokenObject } from '@scom/scom-token-list';

export * from './utils';

export const getWETH = (chainId: number): ITokenObject => {
  let wrappedToken = WETHByChainId[chainId];
  return wrappedToken;
}

export const getSupportedTokens = (tokens: ICustomTokenObject[], chainId: number) => {
  if (!tokens) return [];
  return tokens.filter(token => token.chainId === chainId).map(v => {
    const address = v.address?.toLowerCase().startsWith('0x') ? v.address.toLowerCase() : v.address;
    const tokenObj = tokenStore.tokenMap[address];
    return {
      ...v,
      ...tokenObj
    }
  })
}
