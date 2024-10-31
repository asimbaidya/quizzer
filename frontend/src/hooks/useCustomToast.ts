import { useToast } from '@chakra-ui/react';

interface ToastOptions {
  title: string;
  description?: string;
  status?: 'info' | 'warning' | 'success' | 'error';
  duration?: number;
  isClosable?: boolean;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top'
    | 'bottom';
}

const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({
    title,
    description,
    status = 'info',
    duration = 1000,
    isClosable = true,
    position = 'bottom-right',
  }: ToastOptions) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position,
    });
  };

  return { showToast };
};

export default useCustomToast;
