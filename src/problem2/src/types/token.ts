import { SupportedCurrencyEnum } from './currency';

export type Token = {
  currency: SupportedCurrencyEnum;
  date: string;
  price: number;
};
