import { UpdateFeatureDto } from 'api/FeatureAPI/dto/update-feature.dto';
import FeatureAPI from 'api/FeatureAPI/FeatureAPI';
import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFeature } from 'models/api/IFeature';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditFeatureModal.module.scss';

const ControlPanelEditFeatureModal = () => {
  const [feature, setFeature] = useState<IFeature>();
  const [name, setName] = useState<string>('');
  const [pluralName, setPluralName] = useState<string>('');

  const editFeatureModal = useAppSelector(
    (state) => state.modal.controlPanelEditFeatureModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editFeatureModal.isShowing) {
      if (editFeatureModal.mode === Modes.EDIT_MODE) {
        fetchFeature();
      }
    }
  }, [editFeatureModal.isShowing]);

  const fetchFeature = () => {
    FeatureAPI.getOne(editFeatureModal.featureId).then((data) => {
      setFeature(data);
      setName(data.name);
      setPluralName(data.pluralName);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditFeatureModal'));

    setFeature(undefined);
    setName('');
    setPluralName('');
  };

  const updateFeature = () => {
    if (feature) {
      const updatedFeature: UpdateFeatureDto = {
        id: feature.id,
        name,
        pluralName,
      };
      FeatureAPI.update(updatedFeature).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createFeature = () => {
    FeatureAPI.create({ name, pluralName }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        editFeatureModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новая характеристика'
      }
      isShowing={editFeatureModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.controls_container}>
          <Textbox
            label="Наименование"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textbox
            label="Наименование (во мн. ч.)"
            value={pluralName}
            onChange={(e) => setPluralName(e.target.value)}
          />
        </div>

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editFeatureModal.mode === Modes.ADD_MODE ? (
            <Button variant={ButtonVariants.primary} onClick={createFeature}>
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateFeature}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditFeatureModal;
