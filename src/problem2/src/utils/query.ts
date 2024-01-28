import { UseQueryOptions, UseQueryResult } from 'react-query';

export const adaptQueryProperties = <TData, TKey extends string = string>(
  key: TKey,
  rtkQueryResult: UseQueryResult<{ data: TData; totalCount?: number }, unknown>,
  options?: UseQueryOptions & { nullFallback?: TData }
): Record<Uncapitalize<TKey>, TData extends any[] ? TData : TData> &
  Record<`isLoading${TKey}`, boolean> &
  Record<`isFetching${TKey}`, boolean> &
  Record<`refetch${TKey}`, any> &
  Record<Uncapitalize<`${TKey}Error`>, any> &
  Record<`isLoad${TKey}Success`, boolean> => {
  const { data, isLoading, isFetching, refetch, error, isSuccess } = rtkQueryResult;

  const keyInCamelCase = key.charAt(0).toLowerCase() + key.slice(1);

  return {
    [keyInCamelCase]: data ?? options?.nullFallback,
    [`isLoading${key}`]: isLoading,
    [`isFetching${key}`]: isFetching,
    [`refetch${key}`]: refetch,
    [`${keyInCamelCase}Error`]: error,
    [`isLoad${key}Success`]: isSuccess,
  } as any;
};
