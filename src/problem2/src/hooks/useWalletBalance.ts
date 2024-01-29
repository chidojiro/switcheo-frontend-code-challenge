import { SupportedCurrencyEnum } from '@/types/currency';
import { useCallback, useState } from 'react';

const MOCK_BALANCE: Partial<Record<SupportedCurrencyEnum, number>> = {
  [SupportedCurrencyEnum.LUNA]: 100,
  [SupportedCurrencyEnum.BUSD]: 200,
  [SupportedCurrencyEnum.USDC]: 300,
  [SupportedCurrencyEnum.USD]: 400,
  [SupportedCurrencyEnum.ATOM]: 500,
  [SupportedCurrencyEnum.IRIS]: 600,
};

const useWalletBalance = () => {
  const [balance, setBalance] = useState(MOCK_BALANCE);

  const swap = useCallback(
    ({
      from,
      fromAmount,
      to,
      toAmount,
    }: {
      from: SupportedCurrencyEnum;
      fromAmount: number;
      to: SupportedCurrencyEnum;
      toAmount: number;
    }) => {
      setBalance(prev => {
        if (!prev[from] || prev[from]! < fromAmount) {
          alert(`Balance of ${from} insufficient`);

          return prev;
        }

        return {
          ...prev,
          [from]: (prev[from] ?? 0) - fromAmount,
          [to]: (prev[to] ?? 0) + toAmount,
        };
      });
    },
    []
  );

  return { balance, swap };
};

export default useWalletBalance;
