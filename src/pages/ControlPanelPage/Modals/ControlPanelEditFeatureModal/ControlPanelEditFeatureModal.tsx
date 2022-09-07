import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  createFeatureAPI,
  fetchFeatureAPI,
  updateFeatureAPI,
} from 'http/featureAPI';
import { IFeature } from 'models/IFeature';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditFeatureModal.module.css';

const ControlPanelEditFeatureModal = () => {
  const [feature, setFeature] = useState<IFeature>();
  const [featureName, setFeatureName] = useState<string>('');
  const [featurePluralName, setFeaturePluralName] = useState<string>('');

  const controlPanelEditFeatureModal = useAppSelector(
    (state) => state.modal.controlPanelEditFeatureModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditFeatureModal.isShowing) {
      if (controlPanelEditFeatureModal.mode === Modes.EDIT_MODE) {
        fetchFeature();
      }
    }
  }, [controlPanelEditFeatureModal.isShowing]);

  const fetchFeature = () => {
    fetchFeatureAPI(controlPanelEditFeatureModal.featureId).then((data) => {
      setFeature(data);
      setFeatureName(data.name);
      setFeaturePluralName(data.pluralName);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditFeatureModal());

    setFeature(undefined);
    setFeatureName('');
    setFeaturePluralName('');
  };

  const updateFeature = () => {
    if (feature) {
      const updatedFeature: IFeature = {
        ...feature,
        name: featureName,
        pluralName: featurePluralName,
      };
      updateFeatureAPI(updatedFeature).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createFeature = () => {
    createFeatureAPI(featureName, featurePluralName).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        controlPanelEditFeatureModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новая характеристика'
      }
      isShowing={controlPanelEditFeatureModal.isShowing}
      hide={close}
    >
      <div>
        <Textbox
          label="Наименование"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
        />

        <Textbox
          label="Наименование (во мн. ч.)"
          value={featurePluralName}
          onChange={(e) => setFeaturePluralName(e.target.value)}
          containerStyle={{ margin: '12px 0', minWidth: '310px' }}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditFeatureModal.mode === Modes.ADD_MODE ? (
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
