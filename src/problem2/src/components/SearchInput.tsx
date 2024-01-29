import { Input, InputProps } from '@/shadcn/components/ui/input';
import clsx from 'clsx';
import { SearchIcon } from 'lucide-react';

export type SearchInputProps = InputProps & {
  //
};

export const SearchInput = ({ className, ...restProps }: SearchInputProps) => {
  return (
    <div className={clsx('relative', className)}>
      <SearchIcon size={20} className='absolute top-1/2 left-2 -translate-y-1/2' />
      <Input className='pl-9' {...restProps} />
    </div>
  );
};
