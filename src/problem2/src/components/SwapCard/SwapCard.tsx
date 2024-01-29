import { useToken } from '@/hooks/useToken';
import useWalletBalance from '@/hooks/useWalletBalance';
import { Button } from '@/shadcn/components/ui/button';
import { ClassName } from '@/types/common';
import { SupportedCurrencyEnum } from '@/types/currency';
import clsx from 'clsx';
import { ArrowDownUp, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../Modal';
import { TokenCard, TokenInputValue } from './TokenCard';

export type SwapCardProps = ClassName & {};

const getFixedAmount = (amount: number) => {
  // Display at least 2 decimal places and at most 6 decimal places
  const toFixedCount = Math.max(2, 7 - Math.floor(amount).toString().length);

  return amount.toFixed(toFixedCount);
};

export const SwapCard = ({ className }: SwapCardProps) => {
  const { balance, swap } = useWalletBalance();

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

  const updateReceiveTokenInput = (payAmount: number) => {
    if (!exchangeRate || isFetchingPayToken || isFetchingReceiveToken) return;

    const newReceiveAmount = payAmount ? payAmount * exchangeRate : 0;

    setReceiveTokenInput(prev => ({ ...prev, amount: newReceiveAmount ? getFixedAmount(newReceiveAmount) : '' }));
  };

  const updatePayTokenInput = (receiveAmount: number) => {
    if (!exchangeRate || isFetchingPayToken || isFetchingReceiveToken) return;

    const newPayAmount = receiveAmount ? receiveAmount / exchangeRate : 0;

    setPayTokenInput(prev => ({ ...prev, amount: newPayAmount ? getFixedAmount(newPayAmount) : '' }));
  };

  const handlePayTokenChange = (value: TokenInputValue) => {
    if (value.currency === receiveTokenInput.currency) {
      swapTokens();
      return;
    }

    setPayTokenInput(value);
    updateReceiveTokenInput(value.amount ? +value.amount : 0);

    refetchPayToken();
    refetchReceiveToken();
  };

  const handleReceiveTokenChange = (value: TokenInputValue) => {
    if (value.currency === payTokenInput.currency) {
      swapTokens();
      return;
    }

    setReceiveTokenInput(value);
    updatePayTokenInput(value.amount ? +value.amount : 0);

    refetchPayToken();
    refetchReceiveToken();
  };

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

  const isBalanceExceeded = Number(payTokenInput.amount) > (balance[payTokenInput.currency] ?? 0);

  return (
    <div className={clsx('rounded-xl p-4 bg-white shadow-lg text-primary', className)}>
      <h3 className='mb-4 font-medium'>Swap</h3>

      <div className='flex flex-col items-center gap-4'>
        <div className='w-full'>
          <TokenCard
            label='Amount to send'
            value={payTokenInput}
            onChange={handlePayTokenChange}
            activeCurrency={payTokenInput.currency}
            insufficient={isBalanceExceeded}
          />
          <div className='flex items-center w-full gap-2 mt-2'>
            Available: {(balance[payTokenInput.currency] ?? 0).toFixed(6)}
          </div>
        </div>
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
      <div className='flex items-center gap-2 mt-2'>{renderExchangeRate()}</div>
      <Button
        className='w-full mt-5 text-base uppercase'
        size='lg'
        disabled={isBalanceExceeded || !payTokenInput.amount}
        onClick={() => {
          swap({
            from: payTokenInput.currency,
            fromAmount: Number(payTokenInput.amount),
            to: receiveTokenInput.currency,
            toAmount: Number(receiveTokenInput.amount),
          });
          setPayTokenInput(prev => ({ ...prev, amount: '' }));
          setReceiveTokenInput(prev => ({ ...prev, amount: '' }));
          Modal.confirm({
            title: 'Swap Successful!',
            content: `You have successfully swapped ${payTokenInput.amount} ${payTokenInput.currency} to ${receiveTokenInput.amount} ${receiveTokenInput.currency}`,
          });
        }}>
        Confirm swap
      </Button>
    </div>
  );
};
