import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';

export type OverlayProps = React.PropsWithChildren<{
  open: boolean;
  onClose?: () => void;
  className?: string;
  align?: 'center' | 'top' | 'none';
}>;

export default function Overlay({ open, onClose, children, className, align = 'top' }: OverlayProps) {
  const size = useWindowSize();
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [size]);
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <motion.div
              className='fixed z-50 w-screen h-[calc(var(--vh,1vh)*100)] top-0 left-0'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <Dialog.Overlay>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      className={clsx('absolute w-screen h-[calc(var(--vh,1vh)*100)] bg-black/24', className)}
                      onClick={onClose}
                      transition={{
                        ease: 'easeInOut',
                        duration: 0.2,
                      }}></motion.div>
                  )}
                </AnimatePresence>
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <div
                  role='dialog'
                  aria-modal='true'
                  className={clsx('!pointer-events-auto focus:outline-none h-fit', {
                    'absolute left-1/2 -translate-x-1/2 bottom-0 sm:top-0': align === 'top',
                    'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2': align === 'center',
                    'absolute inset-0': align === 'none',
                  })}>
                  {children}
                </div>
              </Dialog.Content>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
