export async function parseContractError(oMessage:string, tokens: string[]):Promise<string> {
    const staticMessageMap: { [key: string]: string } = {
        'execution reverted: OAXDEX: K': 'x * y = k Violated',
        'execution reverted: OAXDEX: FORBIDDEN': 'Forbidden',
        'execution reverted: OAXDEX: INSUFFICIENT_INPUT_AMOUNT': 'Insufficient input amount',
        'execution reverted: OAXDEX: INVALID_TO': 'Invalid to',
        'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
        'execution reverted: OAXDEX: INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
        'execution reverted: OAXDEX: PAIR PAUSED': 'Pair paused',
        'execution reverted: OAXDEX: GLOBALLY PAUSED': 'Globally paused',
        'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY_BURNED': 'Insufficient liquidity burned',
        'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY_MINTED': 'Insufficient liquidity minted',
        'execution reverted: OAXDEX: OVERFLOW': 'Overflow',
        'execution reverted: OAXDEX_Pair: INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
        'execution reverted: OAXDEX_Pair: INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
        'execution reverted: OAXDEX_Pair: INSUFFICIENT_INPUT_AMOUNT': 'Insufficient input amount',
        'execution reverted: OAXDEX: LOCKED': 'Locked',
        'execution reverted: OAXDEX: INVALID_SIGNATURE': 'Invalid signature',
        'execution reverted: OAXDEX: EXPIRED': 'Expired',
        'MetaMask Tx Signature: User denied transaction signature.': 'User denied transaction signature',
        'execution reverted: OracleAdaptor: Price outside allowed range' : 'Circuit Breaker: Exceeds Price Protection Range',
        'execution reverted: PAIR_NOT_MATCH': 'Pair Not Match',
        'execution reverted: Cap exceeded' : 'Trolls have been sold out',
        'execution reverted: No oracle found' : 'No Oracle found',
        'execution reverted: Amount exceeds available fund' : 'Insufficient liquidity',
    }

    return staticMessageMap[oMessage] ?? `Unknown Error: ${oMessage}`;
}
