import { RefObject, useEffect, useMemo, useState } from 'react';

const useElementOnScreen = (
  options: IntersectionObserverInit,
  targetRef: RefObject<HTMLElement>
): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting);
  };

  const optionsMemo = useMemo(() => {
    return options;
  }, [options]);

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo);
    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [targetRef, optionsMemo]);

  return isVisible;
};

export default useElementOnScreen;
