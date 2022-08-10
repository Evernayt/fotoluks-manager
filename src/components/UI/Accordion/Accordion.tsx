import { FC, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Accordion.module.css';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  isShowing: boolean;
  toggle: () => void;
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({
  label,
  isShowing,
  toggle,
  children,
  ...props
}) => {
  return (
    <AnimatePresence>
      <div className={styles.accordion} onClick={toggle} {...props}>
        {isShowing ? 'Скрыть' : label}
      </div>

      {isShowing && (
        <motion.div
          key="children"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
            },
          }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Accordion;
