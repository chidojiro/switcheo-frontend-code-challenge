import { ICON_BY_CURRENCY } from '@/constants/currency';
import { Button } from '@/shadcn/components/ui/button';
import { SupportedCurrencyEnum } from '@/types/currency';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Modal, ModalProps } from '../Modal';
import { SearchInput } from '../SearchInput';

export type TokenSelectModalProps = ModalProps & {
  value?: SupportedCurrencyEnum;
  onChange: (value: string) => void;
  activeCurrency?: SupportedCurrencyEnum;
  peerCurrency?: SupportedCurrencyEnum;
};

const COMMON_CURRENCIES: SupportedCurrencyEnum[] = [
  SupportedCurrencyEnum.LUNA,
  SupportedCurrencyEnum.BUSD,
  SupportedCurrencyEnum.USDC,
  SupportedCurrencyEnum.USD,
  SupportedCurrencyEnum.ATOM,
  SupportedCurrencyEnum.IRIS,
];

export const TokenSelectModal = ({
  value,
  onChange,
  open,
  onOpenChange,
  activeCurrency,
  peerCurrency,
  ...restProps
}: TokenSelectModalProps) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      setSearch('');
    }
  }, [open]);

  const handleChange = (value: string) => {
    onChange(value);
    onOpenChange?.(false);
  };

  const allCurrencies = Object.values(SupportedCurrencyEnum).sort();

  const filteredCurrencies = search
    ? allCurrencies.filter(currency => currency.toLowerCase().includes(search.toLowerCase()))
    : allCurrencies;

  return (
    <Modal open={open} onOpenChange={onOpenChange} {...restProps}>
      <Modal.Header>Select a token</Modal.Header>
      <Modal.Body className='flex flex-col'>
        <div className='flex-grow flex flex-col overflow-hidden p-0.5'>
          <SearchInput
            className='w-full'
            placeholder='Search'
            autoFocus
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
          />
          <div className='flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-white/5'>
            {COMMON_CURRENCIES.map(currency => {
              const Icon = ICON_BY_CURRENCY[currency];

              const isActive = activeCurrency === currency;

              return (
                <Button
                  key={currency}
                  size='sm'
                  variant='outline'
                  className={clsx(
                    clsx('relative rounded-full gap-1', isActive && 'pointer-events-none border-green-600')
                  )}
                  onClick={isActive ? undefined : () => handleChange(currency)}>
                  <Icon size={24} />
                  {currency}
                </Button>
              );
            })}
          </div>
          <div className='my-4 border-b border-white/10'></div>
          <div className='flex-grow overflow-auto'>
            {filteredCurrencies.length ? (
              filteredCurrencies.map(currency => {
                const Icon = ICON_BY_CURRENCY[currency];

                const isActive = activeCurrency === currency;

                const isPeer = peerCurrency === currency;

                return (
                  <button
                    key={currency}
                    className={clsx(
                      'py-2 px-4 w-full text-left hover:bg-white/5 flex items-center gap-4 justify-between rounded uppercase',
                      { 'pointer-events-none': isActive, 'opacity-40': isPeer }
                    )}
                    disabled={isActive}
                    onClick={isActive ? undefined : () => handleChange(currency)}>
                    <div className='flex items-center gap-4'>
                      <Icon size={32} />
                      {currency}
                    </div>
                    {!!isActive && <CheckIcon className='text-green-600' />}
                  </button>
                );
              })
            ) : (
              <p className='text-center'>No results found.</p>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
