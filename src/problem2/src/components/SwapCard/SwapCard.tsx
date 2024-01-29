import { Button } from '@/shadcn/components/ui/button';
import { ClassName } from '@/types/common';
import { SupportedCurrencyEnum } from '@/types/currency';
import clsx from 'clsx';
import { ArrowDownUp, Loader2Icon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { TokenCard, TokenInputValue } from './TokenCard';
import { useToken } from '@/hooks/useToken';

export type SwapCardProps = ClassName & {};

const getFixedAmount = (amount: number) => {
  // Display at least 2 decimal places and at most 6 decimal places
  const toFixedCount = Math.max(2, 7 - Math.floor(amount).toString().length);

  return amount.toFixed(toFixedCount);
};

export const SwapCard = ({ className }: SwapCardProps) => {
  const [payTokenInput, setPayTokenInput] = useState<TokenInputValue>({
    amount: '',
    currency: SupportedCurrencyEnum.LUNA,
  });
  const [receiveTokenInput, setReceiveTokenInput] = useState<TokenInputValue>({
    amount: '',
    currency: SupportedCurrencyEnum.USDC,
  });

  const isFetchingTokenEnabled = !!payTokenInput.currency && !!receiveTokenInput.currency;

  const {
    token: payToken,
    isFetchingToken: isFetchingPayToken,
    refetchToken: refetchPayToken,
  } = useToken(payTokenInput.currency!, {
    enabled: isFetchingTokenEnabled,
    keepPreviousData: true,
  });
  const {
    token: receiveToken,
    isFetchingToken: isFetchingReceiveToken,
    refetchToken: refetchReceiveToken,
  } = useToken(receiveTokenInput.currency!, {
    enabled: isFetchingTokenEnabled,
    keepPreviousData: true,
  });

  const exchangeRate = payToken && receiveToken ? payToken.price / receiveToken.price : 0;

  const swapTokens = () => {
    const temp = payTokenInput;

    setPayTokenInput(receiveTokenInput);
    setReceiveTokenInput(temp);
  };

  const handlePayTokenChange = (value: TokenInputValue) => {
    if (value.currency === receiveTokenInput.currency) {
      swapTokens();
      return;
    }

    setPayTokenInput(value);

    refetchPayToken();
    refetchReceiveToken();
  };

  const handleReceiveTokenChange = (value: TokenInputValue) => {
    if (value.currency === payTokenInput.currency) {
      swapTokens();
      return;
    }

    setReceiveTokenInput(value);

    refetchPayToken();
    refetchReceiveToken();
  };

  const updateReceiveTokenInput = useCallback(() => {
    if (!exchangeRate || isFetchingPayToken || isFetchingReceiveToken) return;

    const payAmount = payTokenInput.amount ? Number(payTokenInput.amount) : 0;

    const newReceiveAmount = payAmount ? payAmount * exchangeRate : 0;

    setReceiveTokenInput(prev => ({ ...prev, amount: newReceiveAmount ? getFixedAmount(newReceiveAmount) : '' }));
  }, [exchangeRate, isFetchingPayToken, isFetchingReceiveToken, payTokenInput]);

  useEffect(updateReceiveTokenInput, [updateReceiveTokenInput]);

  const renderExchangeRate = () => {
    if (isFetchingTokenEnabled && (isFetchingPayToken || isFetchingReceiveToken))
      return <Loader2Icon className='animate-spin' />;

    if (!exchangeRate) return <>&nbsp;</>;

    return (
      <p>
        <span className='uppercase'>
          1 {payTokenInput.currency} = {getFixedAmount(exchangeRate)} {receiveTokenInput.currency}
        </span>
        <span className='text-sm'> (${getFixedAmount(Number(payTokenInput.amount) * payToken.price)})</span>
      </p>
    );
  };

  return (
    <div className={clsx('rounded-xl p-4 bg-white shadow-lg text-primary', className)}>
      <h3 className='mb-4 font-medium'>Swap</h3>

      <div className='flex flex-col items-center gap-4'>
        <TokenCard
          label='Amount to send'
          value={payTokenInput}
          onChange={handlePayTokenChange}
          activeCurrency={payTokenInput.currency}
        />
        <Button size='icon' variant='outline' onClick={swapTokens} className='mx-auto'>
          <ArrowDownUp />
        </Button>
        <TokenCard
          label='Amount to receive'
          value={receiveTokenInput}
          onChange={handleReceiveTokenChange}
          activeCurrency={receiveTokenInput.currency}
        />
      </div>
      <div className='flex items-center gap-2 px-4 mt-2'>{renderExchangeRate()}</div>
      <Button className='w-full mt-5 text-base uppercase' size='lg'>
        Confirm swap
      </Button>
    </div>
  );
};
