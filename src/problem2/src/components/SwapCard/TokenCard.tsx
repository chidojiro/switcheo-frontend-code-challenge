import { Input } from '@/shadcn/components/ui/input';
import { ClassName } from '@/types/common';
import clsx from 'clsx';
import { TokenSelect } from './TokenSelect';
import { SupportedCurrencyEnum } from '@/types/currency';
import { useEffect, useState } from 'react';

export type TokenInputValue = {
  amount: string;
  currency?: SupportedCurrencyEnum;
};

export type TokenCardProps = ClassName & {
  label: string;
  value: TokenInputValue;
  onChange?: (value: TokenInputValue) => void;
  activeCurrency?: SupportedCurrencyEnum;
};

export const TokenCard = ({ className, label, value, onChange, activeCurrency }: TokenCardProps) => {
  const [amount, setAmount] = useState(value.amount);

  useEffect(() => {
    setAmount(value.amount);
  }, [value.amount]);

  const handleChange = <TKey extends keyof TokenInputValue, TData = TokenInputValue[TKey]>(key: TKey, data: TData) => {
    onChange?.({ ...value, [key]: data });
  };

  return (
    <div className={clsx('p-4 bg-black/4 border border-black/8 rounded-xl w-full', className)}>
      <label className='block mb-1 text-sm'>{label}</label>
      <div className='flex items-center gap-4'>
        <Input
          value={amount}
          onChange={e => {
            if (Number.isNaN(Number(e.target.value))) {
              e.preventDefault();
              return;
            }

            setAmount(e.target.value);
          }}
          onBlur={() => handleChange('amount', amount)}
          placeholder='0'
        />
        <TokenSelect
          value={value.currency}
          onChange={value => handleChange('currency', value)}
          activeCurrency={activeCurrency}
        />
      </div>
    </div>
  );
};
