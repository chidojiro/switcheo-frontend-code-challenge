import tokens from '@/mocks/tokens.json';
import { SupportedCurrencyEnum } from '@/types/currency';
import { Token } from '@/types/token';
import { adaptQueryProperties } from '@/utils/query';
import { UseQueryOptions, useQuery } from 'react-query';

export const useToken = (currency: SupportedCurrencyEnum, options?: UseQueryOptions) => {
  return adaptQueryProperties<Token, 'Token'>(
    'Token',
    useQuery(
      ['token', currency],
      () => tokens.filter(token => token.currency === currency).sort((a, b) => b.date.localeCompare(a.date))[0]
    ),
    options
  );
};
