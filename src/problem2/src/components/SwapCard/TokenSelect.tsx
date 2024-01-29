import { ICON_BY_CURRENCY } from '@/constants/currency';
import { Button } from '@/shadcn/components/ui/button';
import { ClassName } from '@/types/common';
import { SupportedCurrencyEnum } from '@/types/currency';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { TokenSelectModal } from './TokenSelectModal';
import { useState } from 'react';

export type TokenSelectProps = ClassName & {
  value?: SupportedCurrencyEnum;
  onChange: (value: string) => void;
  activeCurrency?: SupportedCurrencyEnum;
};

export const TokenSelect = ({ value, onChange, className, activeCurrency }: TokenSelectProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const renderDialog = () => (
    <TokenSelectModal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      value={value}
      onChange={onChange}
      activeCurrency={activeCurrency}
    />
  );

  if (!value)
    return (
      <>
        {renderDialog()}
        <Button
          key='select-token'
          size='sm'
          variant='destructive'
          className={clsx('rounded-full gap-2', className)}
          onClick={() => setIsDialogOpen(true)}>
          <span>Select token</span>
          <ChevronDown size={16} />
        </Button>
      </>
    );

  const Icon = ICON_BY_CURRENCY[value];

  if (!Icon) {
    alert('Invalid currency');

    return null;
  }

  return (
    <>
      {renderDialog()}
      <Button
        size='sm'
        variant='outline'
        className={clsx('gap-2 text-lg uppercase', className)}
        onClick={() => setIsDialogOpen(true)}>
        <div className='flex items-center gap-1'>
          <Icon size={24} />
          {value}
        </div>
        <ChevronDown size={16} />
      </Button>
    </>
  );
};
