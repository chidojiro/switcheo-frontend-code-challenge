import { ClassName } from '@/types/common';

export type MainLayoutProps = React.PropsWithChildren<ClassName & {}>;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className='min-h-screen bg-black/8'>
      <div className='max-w-2xl px-4 py-20 mx-auto sm:px-10'>{children}</div>
    </main>
  );
};
