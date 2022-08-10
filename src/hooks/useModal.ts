import { useState } from 'react';

export interface IModal {
  isShowing: boolean;
  toggle: () => void;
}

const useModal = (): IModal => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  };
};

export default useModal;
