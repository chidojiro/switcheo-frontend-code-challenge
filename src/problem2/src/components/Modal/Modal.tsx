import { Button } from '@/shadcn/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { createContext, useContext, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import Overlay, { OverlayProps } from './Overlay';

export type ModalProps = OverlayProps &
  React.PropsWithChildren & {
    size?: 'md' | 'lg' | 'sm';
    motionClassName?: string;
    onOpenChange?: (open: boolean) => void;
  };

const ModalContext = createContext<{ rootProps: ModalProps }>(null as any);

const Modal = ({ children, className, size = 'md', motionClassName, ...restProps }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ModalContext.Provider value={{ rootProps: restProps }}>
      <Overlay {...restProps} onClose={() => restProps.onOpenChange?.(false)}>
        <motion.div
          className={twMerge('flex flex-col max-h-screen pt-6  overflow-hidden sm:pb-6', motionClassName)}
          initial={{ opacity: 0, y: '60%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '60%' }}
          transition={{
            ease: 'easeInOut',
            duration: 0.2,
          }}>
          <div
            ref={ref}
            data-test='modal'
            className={clsx(
              'bg-white rounded-t-2xl sm:rounded-b-2xl sm:h-full w-screen mx-auto overflow-y-auto',
              'flex flex-col',
              {
                'sm:max-w-96': size === 'sm',
                'sm:max-w-112': size === 'md',
                'sm:max-w-144': size === 'lg',
              },
              className
            )}>
            {children}
          </div>
        </motion.div>
      </Overlay>
    </ModalContext.Provider>
  );
};

type ModalHeaderProps = JSX.IntrinsicElements['div'] & {};

const ModalHeader = ({ className, children, ...restProps }: ModalHeaderProps) => {
  const {
    rootProps: { onOpenChange },
  } = useContext(ModalContext);

  return (
    <Dialog.Title id='modal-header' className='sticky top-0 left-0 z-30 bg-white/84 backdrop-blur-2xl'>
      <div
        className={clsx('text-base px-6 py-4 text-black flex justify-between items-center', className)}
        {...restProps}>
        <h2 className='font-semibold'>{children}</h2>
        <Button
          data-test='modal-close'
          variant='ghost'
          className='flex items-center justify-center w-8 h-8 p-0'
          onClick={() => onOpenChange?.(false)}>
          <XIcon className='text-black' width={20} height={20} />
        </Button>
      </div>
    </Dialog.Title>
  );
};

type ModalBodyProps = JSX.IntrinsicElements['div'];

const ModalBody = ({ className, children, ...restProps }: ModalBodyProps) => {
  return (
    <div className={clsx('px-6 pt-1 pb-6 flex-1 max-h-[60vh]', className)} {...(restProps as any)}>
      {children}
    </div>
  );
};

type ModalFooterProps = JSX.IntrinsicElements['div'];

const ModalFooter = ({ className, children, ...restProps }: ModalFooterProps) => {
  return (
    <div
      id='modal-footer'
      className={clsx('px-6 py-4 flex justify-end gap-2 sticky bottom-0 left-0 z-30 bg-white', className)}
      {...restProps}>
      {children}
    </div>
  );
};

export default Modal;

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
