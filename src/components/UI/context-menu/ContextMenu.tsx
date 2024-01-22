import { FC } from 'react';
import { Menu, MenuProps } from 'react-contexify';

const ContextMenu: FC<MenuProps> = ({ ...props }) => {
  return (
    <Menu
      style={{ border: '1px solid var(--border-color)', padding: '7px 0' }}
      {...props}
    />
  );
};

export default ContextMenu;
