import { Wallet, BigNumber, Utils, TransactionReceipt } from "@ijstech/eth-wallet";
import { } from '@ijstech/eth-contract';
import { Contracts } from "@scom/oswap-openswap-contract";
import { Contracts as ProxyContracts } from '@scom/scom-commission-proxy-contract';
import {
  ICommissionInfo
} from "./global/index";
import {
  State,
  getWETH
} from "./store/index";
import getDexList from '@scom/scom-dex-list';
import { ITokenObject } from "@scom/scom-token-list";

interface IAmmPairToken {
  pair?: Contracts.OSWAP_Pair;
  index?: number;
  tokenA: ITokenObject;
  tokenB: ITokenObject;
  balance?: string;
}

interface INewShare {
  minted: string;
  shareAdded: string;
  newShare: string;
  price0: string;
  price1: string;
}

interface IUserShare {
  tokenAShare: string;
  tokenBShare: string;
  totalPoolTokens: string;
  poolShare: string;
}

interface IAmmPair extends IUserShare, IAmmPairToken {
}

interface ITokensBack {
  amountA: string;
  amountB: string;
  [x: string]: string;
  liquidity: string;
  percent: string;
  newshare: string;
}

export const ERC20MaxAmount = new BigNumber(2).pow(256).minus(1);

export function getRouterAddress(chainId: number): string {
  const dexItem = getDexList().find(item => item.chainId === chainId)
  return dexItem?.routerAddress || '';
}

function getFactoryAddress(chainId: number): string {
  const dexItem = getDexList().find(item => item.chainId === chainId)
  return dexItem?.factoryAddress || '';
}

const MINIMUM_LIQUIDITY = 10 ** 3;
const FEE_BASE = 10 ** 5

const mintFee = async (factory: Contracts.OSWAP_Factory, pair: Contracts.OSWAP_Pair, totalSupply: BigNumber, reserve0: BigNumber, reserve1: BigNumber) => {
  let protocolFeeParams = await factory.protocolFeeParams();
  let protocolFee = new BigNumber(protocolFeeParams.protocolFee);
  let protocolFeeTo = protocolFeeParams.protocolFeeTo;
  if (protocolFeeTo != Utils.nullAddress) {
    let kLast = await pair.kLast();
    if (!kLast.eq(0)) {
      let rootK = reserve0.times(reserve1).sqrt().decimalPlaces(0, BigNumber.ROUND_FLOOR);
      let rootKLast = new BigNumber(kLast).sqrt().decimalPlaces(0, BigNumber.ROUND_FLOOR);
      if (rootK.gt(rootKLast)) {
        let numerator = new BigNumber(totalSupply).times(rootK.minus(rootKLast)).times(protocolFee);
        let denominator = new BigNumber(FEE_BASE).minus(protocolFee).times(rootK).plus(new BigNumber(rootKLast).times(protocolFee));
        let liquidity = numerator.idiv(denominator);
        totalSupply = totalSupply.plus(liquidity);
      }
    }
  }
  return totalSupply;
}

const poolTokenMinted = async (factory: Contracts.OSWAP_Factory, amountInA: BigNumber, amountInB: BigNumber, pair: Contracts.OSWAP_Pair, totalSupply: BigNumber, reserve0: BigNumber, reserve1: BigNumber) => {
  totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);
  let liquidity: BigNumber;
  if (totalSupply.eq(0)) {
    liquidity = amountInA.times(amountInB).sqrt().decimalPlaces(0, BigNumber.ROUND_FLOOR).minus(MINIMUM_LIQUIDITY);
  } else {
    liquidity = BigNumber.min(amountInA.times(totalSupply).idiv(reserve0), amountInB.times(totalSupply).idiv(reserve1));
  }
  return liquidity;
}

interface IPrices {
  pair: Contracts.OSWAP_Pair;
  reserveA?: BigNumber;
  reserveB?: BigNumber;
  price0?: string;
  price1?: string;
}

const getPrices = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => {
  const WETH = getWETH(state.getChainId());
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;
  let pair = await getPairFromTokens(state, tokenA, tokenB);
  if (!pair) return null;
  let reserves = await getReserves(pair, tokenA, tokenB);
  if (!reserves) {
    return {
      pair
    };
  }
  let reserveA = Utils.fromDecimals(reserves.reserveA, tokenA.decimals);
  let reserveB = Utils.fromDecimals(reserves.reserveB, tokenB.decimals);
  if (reserveA.eq(0)) {
    return {
      pair,
      reserveA,
      reserveB
    };
  }
  let price0 = reserveB.div(reserveA).toFixed();
  let price1 = reserveA.div(reserveB).toFixed();

  let pricesObj: IPrices = {
    pair,
    reserveA,
    reserveB,
    price0,
    price1
  }
  return pricesObj;
}

const getUserShare = async (state: State, pairTokenInfo: IAmmPairToken) => {
  const wallet = state.getRpcWallet();
  let chainId = state.getChainId();
  let { pair, tokenA, tokenB, balance } = pairTokenInfo;
  if (!pair) {
    let pairFromTokens = await getPairFromTokens(state, tokenA, tokenB);
    if (!pairFromTokens) return null;
    pair = pairFromTokens;
  }
  if (!balance) {
    balance = (await pair.balanceOf(wallet.address)).toFixed();
  }
  const WETH = getWETH(chainId);
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;

  let totalSupply = await pair.totalSupply();
  let reserve = await pair.getReserves();

  let reserve0: BigNumber;
  let reserve1: BigNumber;
  if (new BigNumber(tokenA.address!.toLowerCase()).lt(tokenB.address!.toLowerCase())) {
    reserve0 = reserve.reserve0;
    reserve1 = reserve.reserve1;
  }
  else {
    reserve0 = reserve.reserve1;
    reserve1 = reserve.reserve0;
  }
  let share = new BigNumber(balance).div(totalSupply);

  let result: IUserShare = {
    tokenAShare: Utils.fromDecimals(share.times(reserve0), tokenA.decimals).toFixed(),
    tokenBShare: Utils.fromDecimals(share.times(reserve1), tokenB.decimals).toFixed(),
    totalPoolTokens: Utils.fromDecimals(balance).toFixed(),
    poolShare: share.toFixed()
  }
  return result;
}

const getRemoveLiquidityInfo = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => {
  let userShare = await getUserShare(state, {
    tokenA,
    tokenB
  });
  if (!userShare) return null;
  let pricesData = await getPrices(state, tokenA, tokenB);
  if (!pricesData) return null;
  let lpToken: ITokenObject = {
    address: pricesData.pair.address,
    decimals: 18,
    symbol: 'LP',
    name: 'LP',
    chainId: 0
  }
  return {
    ...userShare,
    lpToken,
    price0: pricesData.price0,
    price1: pricesData.price1,
  }
}

const getPairFromTokens = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => {
  let wallet = state.getRpcWallet();
  let chainId = state.getChainId();
  const factoryAddress = getFactoryAddress(chainId);
  const factory = new Contracts.OSWAP_Factory(wallet, factoryAddress);
  let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
  if (!pairAddress || pairAddress == Utils.nullAddress) {
    return null;
  }
  let pair = new Contracts.OSWAP_Pair(wallet, pairAddress);
  return pair;
}

interface IPairReserve {
  reserveA: BigNumber,
  reserveB: BigNumber
}

const getReserves = async (pair: Contracts.OSWAP_Pair, tokenA: ITokenObject, tokenB: ITokenObject) => {
  let reserveObj: IPairReserve;
  let reserve = await pair.getReserves();
  if (new BigNumber(tokenA.address!.toLowerCase()).lt(tokenB.address!.toLowerCase())) {
    reserveObj = {
      reserveA: reserve.reserve0,
      reserveB: reserve.reserve1
    };
  } else {
    reserveObj = {
      reserveA: reserve.reserve1,
      reserveB: reserve.reserve0
    };
  }
  return reserveObj;
}

const getPricesInfo = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject) => {
  let pricesData = await getPrices(state, tokenA, tokenB);
  if (!pricesData) return null;

  let { pair, price0, price1 } = pricesData;
  let wallet = state.getRpcWallet();
  let balance = await pair.balanceOf(wallet.address);
  let totalSupply = await pair.totalSupply();

  return {
    pair,
    price0,
    price1,
    balance: Utils.fromDecimals(balance).toFixed(),
    totalSupply: Utils.fromDecimals(totalSupply).toFixed()
  };
}

const calculateNewPairShareInfo = (tokenA: ITokenObject, tokenB: ITokenObject, amountADesired: string, amountBDesired: string) => {
  let price0 = new BigNumber(amountBDesired).div(amountADesired).toFixed();
  let price1 = new BigNumber(amountADesired).div(amountBDesired).toFixed();
  let amountADesiredToDecimals = Utils.toDecimals(amountADesired, tokenA.decimals);
  let amountBDesiredToDecimals = Utils.toDecimals(amountBDesired, tokenB.decimals);
  let minted = amountADesiredToDecimals.times(amountBDesiredToDecimals).sqrt().decimalPlaces(0, BigNumber.ROUND_FLOOR).minus(MINIMUM_LIQUIDITY);

  return {
    price0,
    price1,
    minted: Utils.fromDecimals(minted).toFixed()
  }
}

const getNewShareInfo = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject, amountIn: string, amountADesired: string, amountBDesired: string) => {
  let wallet = state.getRpcWallet();
  let chainId = state.getChainId();
  const WETH = getWETH(chainId);
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;
  let pair = await getPairFromTokens(state, tokenA, tokenB);
  if (!pair) return null;
  let reserves = await getReserves(pair, tokenA, tokenB);
  if (!reserves) return null;
  if (reserves.reserveA.eq(0)) {
    return null;
  }
  let balance = await pair.balanceOf(wallet.address);
  let totalSupply = await pair.totalSupply();

  let quote = Utils.fromDecimals(reserves.reserveB, tokenB.decimals).times(amountIn).div(Utils.fromDecimals(reserves.reserveA, tokenA.decimals)).toFixed();
  let amountADesiredToDecimals = Utils.toDecimals(amountADesired, tokenA.decimals);
  let amountBDesiredToDecimals = Utils.toDecimals(amountBDesired, tokenB.decimals);
  const factoryAddress = getFactoryAddress(chainId);
  const factory = new Contracts.OSWAP_Factory(wallet, factoryAddress);
  let newPrice0 = Utils.fromDecimals(reserves.reserveB.plus(amountBDesiredToDecimals), tokenB.decimals).div(Utils.fromDecimals(reserves.reserveA.plus(amountADesiredToDecimals), tokenA.decimals)).toFixed();
  let newPrice1 = Utils.fromDecimals(reserves.reserveA.plus(amountADesiredToDecimals), tokenA.decimals).div(Utils.fromDecimals(reserves.reserveB.plus(amountBDesiredToDecimals), tokenB.decimals)).toFixed();
  let minted = await poolTokenMinted(factory, amountADesiredToDecimals, amountBDesiredToDecimals, pair, totalSupply, reserves.reserveA, reserves.reserveB);
  let newShare = minted.plus(balance).div(minted.plus(totalSupply)).toFixed();
  return {
    quote,
    newPrice0,
    newPrice1,
    newShare,
    minted: Utils.fromDecimals(minted).toFixed()
  };
}

const addLiquidity = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject, amountADesired: string, amountBDesired: string, commissions: ICommissionInfo[]) => {
  let receipt: TransactionReceipt;
  try {
    const wallet = Wallet.getClientInstance();
    let chainId = state.getChainId();
    const toAddress = wallet.address;
    const slippageTolerance = state.slippageTolerance;
    const amountAMin = new BigNumber(amountADesired).times(1 - slippageTolerance / 100).toFixed();
    const amountBMin = new BigNumber(amountBDesired).times(1 - slippageTolerance / 100).toFixed();
    const deadline = Math.floor(Date.now() / 1000 + state.transactionDeadline * 60);
    const routerAddress = getRouterAddress(chainId);
    let router = new Contracts.OSWAP_Router(wallet, routerAddress);

    const proxyAddress = state.getProxyAddress();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const _commissions = (commissions || []).filter(v => v.chainId == state.getChainId());

    if (!tokenA.address || !tokenB.address) {
      let erc20Token: ITokenObject, amountTokenDesired: string, amountETHDesired: string, amountTokenMin: string, amountETHMin: string;
      if (tokenA.address) {
        erc20Token = tokenA;
        amountTokenDesired = amountADesired;
        amountETHDesired = amountBDesired;
        amountTokenMin = amountAMin;
        amountETHMin = amountBMin;
      } else {
        erc20Token = tokenB;
        amountTokenDesired = amountBDesired;
        amountETHDesired = amountADesired;
        amountTokenMin = amountBMin;
        amountETHMin = amountAMin;
      }
      const amountToken = Utils.toDecimals(amountTokenDesired, erc20Token.decimals).dp(0);
      const amountETH = Utils.toDecimals(amountETHDesired).dp(0);
      if (_commissions.length) {
        const commissionsToken = _commissions.map(v => {
          return {
            to: v.walletAddress,
            amount: amountToken.times(v.share).dp(0)
          }
        });
        const commissionsETH = _commissions.map(v => {
          return {
            to: v.walletAddress,
            amount: amountETH.times(v.share).dp(0)
          }
        });
        const commissionsAmountToken = commissionsToken.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
        const commissionsAmountETH = commissionsETH.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
        const tokensIn = [
          {
            token: erc20Token.address,
            amount: amountToken.plus(commissionsAmountToken),
            directTransfer: false,
            commissions: commissionsToken
          },
          {
            token: Utils.nullAddress,
            amount: amountETH.plus(commissionsAmountETH),
            directTransfer: false,
            commissions: commissionsETH
          }
        ];
        const txData = await router.addLiquidityETH.txData({
          token: erc20Token.address!,
          amountTokenDesired: amountToken,
          amountTokenMin: Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
          amountETHMin: Utils.toDecimals(amountETHMin).dp(0),
          to: toAddress,
          deadline
        }, amountETH);
        receipt = await proxy.proxyCall({
          target: routerAddress,
          tokensIn,
          data: txData,
          to: wallet.address,
          tokensOut: []
        }, amountETH.plus(commissionsAmountETH));
      } else {
        receipt = await router.addLiquidityETH({
          token: erc20Token.address!,
          amountTokenDesired: amountToken,
          amountTokenMin: Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
          amountETHMin: Utils.toDecimals(amountETHMin).dp(0),
          to: toAddress,
          deadline
        }, amountETH);
      }
    }
    else {
      const amountTokenA = Utils.toDecimals(amountADesired, tokenA.decimals).dp(0);
      const amountTokenB = Utils.toDecimals(amountBDesired, tokenB.decimals).dp(0);
      if (_commissions.length) {
        const commissionsTokenA = _commissions.map(v => {
          return {
            to: v.walletAddress,
            amount: amountTokenA.times(v.share).dp(0)
          }
        });
        const commissionsTokenB = _commissions.map(v => {
          return {
            to: v.walletAddress,
            amount: amountTokenB.times(v.share).dp(0)
          }
        });
        const commissionsAmountTokenA = commissionsTokenA.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
        const commissionsAmountTokenB = commissionsTokenB.map(v => v.amount).reduce((a, b) => a.plus(b)).dp(0);
        const tokensIn = [
          {
            token: tokenA.address,
            amount: amountTokenA.plus(commissionsAmountTokenA),
            directTransfer: false,
            commissions: commissionsTokenA
          },
          {
            token: tokenB.address,
            amount: amountTokenB.plus(commissionsAmountTokenB),
            directTransfer: false,
            commissions: commissionsTokenB
          }
        ];
        const txData = await router.addLiquidity.txData({
          tokenA: tokenA.address,
          tokenB: tokenB.address,
          amountADesired: amountTokenA,
          amountBDesired: amountTokenB,
          amountAMin: Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
          amountBMin: Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
          to: toAddress,
          deadline
        });
        receipt = await proxy.proxyCall({
          target: routerAddress,
          tokensIn,
          data: txData,
          to: wallet.address,
          tokensOut: []
        })
      } else {
        receipt = await router.addLiquidity({
          tokenA: tokenA.address,
          tokenB: tokenB.address,
          amountADesired: amountTokenA,
          amountBDesired: amountTokenB,
          amountAMin: Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
          amountBMin: Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
          to: toAddress,
          deadline
        });
      }
    }
  }
  catch (err) {
    console.log('err', err)
  }
  return receipt;
}

const removeLiquidity = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string, amountADesired: string, amountBDesired: string) => {
  let receipt: TransactionReceipt;
  try {
    const wallet = Wallet.getClientInstance();
    let chainId = state.getChainId();
    const toAddress = wallet.address;
    const slippageTolerance = state.slippageTolerance;
    const amountAMin = new BigNumber(amountADesired).times(1 - slippageTolerance / 100).toFixed();
    const amountBMin = new BigNumber(amountBDesired).times(1 - slippageTolerance / 100).toFixed();
    const deadline = Math.floor(Date.now() / 1000 + state.transactionDeadline * 60);
    const routerAddress = getRouterAddress(chainId);
    let router = new Contracts.OSWAP_Router(wallet, routerAddress);
    if (!tokenA.address || !tokenB.address) {
      let erc20Token: ITokenObject, amountTokenMin: string, amountETHMin: string;
      if (tokenA.address) {
        erc20Token = tokenA;
        amountTokenMin = amountAMin;
        amountETHMin = amountBMin;
      }
      else {
        erc20Token = tokenB;
        amountTokenMin = amountBMin;
        amountETHMin = amountAMin;
      }
      receipt = await router.removeLiquidityETH({
        token: erc20Token.address!,
        liquidity: Utils.toDecimals(liquidity).dp(0),
        amountTokenMin: Utils.toDecimals(amountTokenMin, erc20Token.decimals).dp(0),
        amountETHMin: Utils.toDecimals(amountETHMin).dp(0),
        to: toAddress,
        deadline
      })
    }
    else {
      receipt = await router.removeLiquidity({
        tokenA: tokenA.address,
        tokenB: tokenB.address,
        liquidity: Utils.toDecimals(liquidity).dp(0),
        amountAMin: Utils.toDecimals(amountAMin, tokenA.decimals).dp(0),
        amountBMin: Utils.toDecimals(amountBMin, tokenB.decimals).dp(0),
        to: toAddress,
        deadline
      })
    }
  }
  catch (err) {
    console.log('err', err)
  }
  return receipt;
}

const getPairAddressFromTokens = async (state: State, factory: Contracts.OSWAP_Factory, tokenA: ITokenObject, tokenB: ITokenObject) => {
  let chainId = state.getChainId();
  const WETH = getWETH(chainId);
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;

  let pairAddress = await factory.getPair({
    param1: tokenA.address!,
    param2: tokenB.address!
  })

  if (!pairAddress || pairAddress == Utils.nullAddress) {
    return null;
  }

  return pairAddress;
}

const getTokensBack = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject, liquidity: string) => {
  let wallet = state.getRpcWallet();
  let chainId = state.getChainId();
  const WETH = getWETH(chainId);
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;
  const factoryAddress = getFactoryAddress(chainId);
  const factory = new Contracts.OSWAP_Factory(wallet, factoryAddress);
  let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
  if (!pairAddress || pairAddress == Utils.nullAddress) {
    return null;
  }
  let pair = new Contracts.OSWAP_Pair(wallet, pairAddress);
  let balance = await pair.balanceOf(wallet.address);
  let totalSupply = await pair.totalSupply();
  let reserve = await pair.getReserves();

  let liquidityToDecimals = Utils.toDecimals(liquidity);

  let reserve0: BigNumber;
  let reserve1: BigNumber;
  if (new BigNumber(tokenA.address!.toLowerCase()).lt(tokenB.address!.toLowerCase())) {
    reserve0 = reserve.reserve0;
    reserve1 = reserve.reserve1;
  }
  else {
    reserve0 = reserve.reserve1;
    reserve1 = reserve.reserve0;
  }

  totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);
  let erc20A = new Contracts.ERC20(wallet, tokenA.address);
  let erc20B = new Contracts.ERC20(wallet, tokenB.address);
  let balanceA = await erc20A.balanceOf(pair.address);
  let balanceB = await erc20B.balanceOf(pair.address);
  let amountA = Utils.fromDecimals(liquidityToDecimals.times(balanceA).idiv(totalSupply), tokenA.decimals);
  let amountB = Utils.fromDecimals(liquidityToDecimals.times(balanceB).idiv(totalSupply), tokenB.decimals);

  let percent = liquidityToDecimals.div(balance).times(100).toFixed();
  let newshare = new BigNumber(balance).minus(liquidity).div(new BigNumber(totalSupply).minus(liquidity)).toFixed();
  let result: ITokensBack = {
    amountA: amountA.toFixed(),
    amountB: amountB.toFixed(),
    [tokenA.symbol]: amountA.toFixed(),
    [tokenB.symbol]: amountB.toFixed(),
    liquidity: liquidity,
    percent: percent,
    newshare: newshare
  }
  return result;
}

const getTokensBackByAmountOut = async (state: State, tokenA: ITokenObject, tokenB: ITokenObject, tokenOut: ITokenObject, amountOut: string) => {
  let wallet = state.getRpcWallet();
  let chainId = state.getChainId();
  const WETH = getWETH(chainId);
  if (!tokenA.address) tokenA = WETH;
  if (!tokenB.address) tokenB = WETH;
  if (!tokenOut.address) tokenOut = WETH;

  const factoryAddress = getFactoryAddress(chainId);
  const factory = new Contracts.OSWAP_Factory(wallet, factoryAddress);
  let pairAddress = await getPairAddressFromTokens(state, factory, tokenA, tokenB);
  if (!pairAddress || pairAddress == Utils.nullAddress) {
    return null;
  }
  let pair = new Contracts.OSWAP_Pair(wallet, pairAddress);
  let totalSupply = await pair.totalSupply();
  let reserve = await pair.getReserves();

  let reserve0: BigNumber;
  let reserve1: BigNumber;
  if (new BigNumber(tokenA.address!.toLowerCase()).lt(tokenB.address!.toLowerCase())) {
    reserve0 = reserve.reserve0;
    reserve1 = reserve.reserve1;
  }
  else {
    reserve0 = reserve.reserve1;
    reserve1 = reserve.reserve0;
  }
  totalSupply = await mintFee(factory, pair, totalSupply, reserve0, reserve1);

  let liquidityInDecimals: BigNumber;
  if (tokenA.address == tokenOut.address) {
    let erc20A = new Contracts.ERC20(wallet, tokenA.address);
    let balanceA = await erc20A.balanceOf(pair.address);
    liquidityInDecimals = Utils.toDecimals(amountOut, tokenOut.decimals).times(totalSupply).idiv(balanceA).plus(1);
  } else {
    let erc20B = new Contracts.ERC20(wallet, tokenB.address);
    let balanceB = await erc20B.balanceOf(pair.address);
    liquidityInDecimals = Utils.toDecimals(amountOut, tokenOut.decimals).times(totalSupply).idiv(balanceB).plus(1);
  }
  let liquidity = Utils.fromDecimals(liquidityInDecimals).toFixed();
  let tokensBack = await getTokensBack(state, tokenA, tokenB, liquidity);
  return tokensBack;
}

export {
  IAmmPair,
  IUserShare,
  INewShare,
  ITokensBack,
  getNewShareInfo,
  getPricesInfo,
  addLiquidity,
  calculateNewPairShareInfo,
  getPairFromTokens,
  getRemoveLiquidityInfo,
  removeLiquidity,
  getTokensBack,
  getTokensBackByAmountOut
}
