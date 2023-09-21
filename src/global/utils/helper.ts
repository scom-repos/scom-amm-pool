import { FormatUtils } from "@ijstech/components";
import { BigNumber } from "@ijstech/eth-wallet";

export const formatNumber = (value: number | string | BigNumber, decimalFigures?: number) => {
  if (typeof value === 'object') {
    value = value.toString();
  }
  const minValue = '0.0000001';
  return FormatUtils.formatNumber(value, {decimalFigures: decimalFigures || 4, minValue});
};

const isInvalidInput = (val: any) => {
  const value = new BigNumber(val);
  if (value.lt(0)) return true;
  return (val || '').toString().substring(0, 2) === '00' || val === '-';
};

export const limitInputNumber = (input: any, decimals?: number) => {
  const amount = input.value;
  if (isInvalidInput(amount)) {
    input.value = '0';
    return;
  }
  if (!new BigNumber(amount).isNaN()) {
    input.value = new BigNumber(amount).dp(decimals || 18, 1).toString();
  }
}
