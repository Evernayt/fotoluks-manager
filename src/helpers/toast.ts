import { UseToastOptions } from '@chakra-ui/react';

export const getErrorToast = (
  title: string,
  error?: any,
  isClosable: boolean = true
): UseToastOptions => {
  let description = '';
  if (error === undefined) {
    description = 'Ошибка';
  } else if (typeof error === 'string') {
    description = error;
  } else {
    description = error.response.data
      ? error.response.data.message
      : error.message;
  }

  return {
    title,
    description,
    status: 'error',
    duration: 6000,
    isClosable,
  };
};

export const getInfoToast = (title: string): UseToastOptions => {
  return {
    title,
    status: 'info',
    duration: 6000,
    isClosable: true,
  };
};

export const getSuccessToast = (title: string): UseToastOptions => {
  return {
    title,
    status: 'success',
    duration: 4000,
    isClosable: true,
  };
};
