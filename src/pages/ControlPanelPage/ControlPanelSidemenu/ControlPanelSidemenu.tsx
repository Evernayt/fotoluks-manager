import {
  IconBox,
  IconCategory,
  IconFeature,
  IconMug,
  IconParam,
  IconShop,
  IconUser,
  IconSidemenuChecked,
  IconSidemenu,
} from 'icons';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Tooltip } from 'components';
import styles from './ControlPanelSidemenu.module.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { useMemo } from 'react';
import { ISidemenu } from 'models/ISidemenu';

const ControlPanelSidemenu = () => {
  const isMinimizedSidemenu = useAppSelector(
    (state) => state.controlPanel.isMinimizedSidemenu
  );
  const activeItemId = useAppSelector(
    (state) => state.controlPanel.activeItemId
  );

  const dispatch = useAppDispatch();

  const items = useMemo<ISidemenu[]>(
    () => [
      {
        id: 1,
        Icon: IconUser,
        name: 'Пользователи',
      },
      {
        id: 2,
        Icon: IconMug,
        name: 'Товары',
      },
      {
        id: 3,
        Icon: IconBox,
        name: 'Продукты',
      },
      {
        id: 4,
        Icon: IconCategory,
        name: 'Категории',
      },
      {
        id: 5,
        Icon: IconFeature,
        name: 'Характеристики',
      },
      {
        id: 6,
        Icon: IconParam,
        name: 'Параметры',
      },
      {
        id: 7,
        Icon: IconShop,
        name: 'Филиалы',
      },
    ],
    []
  );

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
        {items.map((item) => {
          const { Icon } = item;
          return (
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
                    <Icon
                      className={
                        activeItemId === item.id
                          ? 'secondary-checked-icon'
                          : 'secondary-icon'
                      }
                      size={20}
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
          );
        })}
      </div>
      <div>
        <input
          id="sidemenu_toggle"
          name="sidemenu_toggle"
          type="checkbox"
          onChange={toggleSidemenu}
        />
        <label className={styles.toggle} htmlFor="sidemenu_toggle">
          {isMinimizedSidemenu ? (
            <IconSidemenu className="link-icon" size={20} />
          ) : (
            <IconSidemenuChecked className="link-icon" size={20} />
          )}
        </label>
      </div>
    </div>
  );
};

export default ControlPanelSidemenu;
