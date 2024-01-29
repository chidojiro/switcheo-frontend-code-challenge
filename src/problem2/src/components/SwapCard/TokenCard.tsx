import { Input } from '@/shadcn/components/ui/input';
import { ClassName } from '@/types/common';
import { SupportedCurrencyEnum } from '@/types/currency';
import clsx from 'clsx';
import { TokenSelect } from './TokenSelect';

export type TokenInputValue = {
  amount: string;
  currency: SupportedCurrencyEnum;
};

export type TokenCardProps = ClassName & {
  label: string;
  value: TokenInputValue;
  onChange?: (value: TokenInputValue) => void;
  activeCurrency?: SupportedCurrencyEnum;
  insufficient?: boolean;
};

export const TokenCard = ({ className, label, value, onChange, activeCurrency, insufficient }: TokenCardProps) => {
  const handleChange = <TKey extends keyof TokenInputValue, TData = TokenInputValue[TKey]>(key: TKey, data: TData) => {
    onChange?.({ ...value, [key]: data });
  };

  return (
    <div className={clsx('p-4 bg-black/4 border border-black/8 rounded-xl w-full', className)}>
      <label className='block mb-1 text-sm'>{label}</label>
      <div className='flex items-center gap-4'>
        <Input
          value={value.amount}
          onChange={e => {
            if (Number.isNaN(Number(e.target.value))) {
              e.preventDefault();
              return;
            }

            handleChange('amount', e.target.value);
          }}
          placeholder='0'
          error={insufficient}
        />
        <TokenSelect
          value={value.currency}
          onChange={value => handleChange('currency', value)}
          activeCurrency={activeCurrency}
        />
      </div>
      {insufficient && <p className='mt-1 text-sm text-red-600'>Insufficient balance</p>}
    </div>
  );
};
