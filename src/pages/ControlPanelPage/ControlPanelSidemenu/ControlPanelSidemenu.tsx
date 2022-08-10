import {
  newOrdersCheckedIcon,
  newOrdersIcon,
  sidemenuCheckedIcon,
  sidemenuIcon,
  userCheckedIcon,
  userIcon,
} from 'icons';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Tooltip } from 'components';
import styles from './ControlPanelSidemenu.module.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ControlPanelSidemenu = () => {
  const isMinimizedSidemenu = useAppSelector(
    (state) => state.controlPanel.isMinimizedSidemenu
  );
  const activeItemId = useAppSelector(
    (state) => state.controlPanel.activeItemId
  );

  const dispatch = useAppDispatch();

  const items = [
    {
      id: 1,
      checkedIcon: userCheckedIcon,
      icon: userIcon,
      name: 'Пользователи',
    },
    {
      id: 2,
      checkedIcon: newOrdersCheckedIcon,
      icon: newOrdersIcon,
      name: 'Товары',
    },
  ];

  const toggleSidemenu = () => {
    dispatch(
      controlPanelSlice.actions.setIsMinimizedSidemenu(!isMinimizedSidemenu)
    );
  };

  return (
    <div
      className={styles.container}
      style={isMinimizedSidemenu ? { minWidth: '52px' } : { minWidth: '206px' }}
    >
      <div>
        {items.map((item) => (
          <Tooltip
            label={item.name}
            placement="right"
            delay={400}
            disabled={!isMinimizedSidemenu}
            key={item.id}
          >
            <div>
              <input
                id={item.id.toString()}
                name="orders-sidemenu"
                type="radio"
                checked={activeItemId === item.id}
                onChange={() =>
                  dispatch(controlPanelSlice.actions.setActiveItemId(item.id))
                }
              />
              <label className={styles.rbtn} htmlFor={item.id.toString()}>
                <div className={styles.rbtn_icon}>
                  <img
                    src={
                      activeItemId === item.id ? item.checkedIcon : item.icon
                    }
                    alt={item.name}
                  />
                </div>
                <span
                  className={styles.text}
                  style={
                    isMinimizedSidemenu
                      ? { opacity: '0', visibility: 'hidden' }
                      : { opacity: '1', visibility: 'visible' }
                  }
                >
                  {item.name}
                </span>
              </label>
            </div>
          </Tooltip>
        ))}
      </div>
      <div>
        <input
          id="sidemenu_toggle"
          name="sidemenu_toggle"
          type="checkbox"
          onChange={toggleSidemenu}
        />
        <label className={styles.toggle} htmlFor="sidemenu_toggle">
          <img
            src={isMinimizedSidemenu ? sidemenuIcon : sidemenuCheckedIcon}
            alt="sidemenu"
          />
        </label>
      </div>
    </div>
  );
};

export default ControlPanelSidemenu;
