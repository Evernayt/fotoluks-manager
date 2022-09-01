import { KeyboardEvent } from 'react';

const enterPressHandler = (event: KeyboardEvent, handler: () => void) => {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    handler();
  }
};

export default enterPressHandler;
