import { Button, Checkbox, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { initialFilter } from 'constants/InitialStates/initialFilterState';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelFeaturesFilterModal.module.css';

const ControlPanelFeaturesFilterModal = () => {
  const [inArchive, setInArchive] = useState<boolean>(false);

  const controlPanelFeaturesFilterModal = useAppSelector(
    (state) => state.modal.controlPanelFeaturesFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelFeaturesFilterModal());
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearFeaturesFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeFeaturesFilter({
        filter: initialFilter,
        archive: inArchive,
      })
    );
    close();
  };

  const reset = () => {
    setInArchive(false);
  };

  return (
    <Modal
      title="Фильтры характеристок"
      isShowing={controlPanelFeaturesFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <Checkbox
          text="В архиве"
          checked={inArchive}
          onChange={() => setInArchive((prevState) => !prevState)}
        />
      </div>
      <div className={styles.controls}>
        <Button
          style={{ marginRight: '8px', minWidth: 'max-content' }}
          onClick={clear}
        >
          Очистить
        </Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default ControlPanelFeaturesFilterModal;
