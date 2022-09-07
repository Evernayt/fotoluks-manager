import {
  Button,
  IconButton,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchFeaturesAPI } from 'http/featureAPI';
import { createParamAPI, fetchParamAPI, updateParamAPI } from 'http/paramAPI';
import { plusIcon } from 'icons';
import { IFeature } from 'models/IFeature';
import { IParam } from 'models/IParam';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditParamModal.module.css';

const ControlPanelEditParamModal = () => {
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<IFeature>(features[0]);
  const [param, setParam] = useState<IParam>();
  const [paramName, setParamName] = useState<string>('');
  const [paramValue, setParamValue] = useState<string>('');

  const controlPanelEditParamModal = useAppSelector(
    (state) => state.modal.controlPanelEditParamModal
  );
  const controlPanelEditFeatureModal = useAppSelector(
    (state) => state.modal.controlPanelEditFeatureModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditParamModal.isShowing) {
      if (controlPanelEditParamModal.mode === Modes.EDIT_MODE) {
        fetchParam();
      }

      fetchFeatures();
    }
  }, [controlPanelEditParamModal.isShowing]);

  useEffect(() => {
    if (
      !controlPanelEditFeatureModal.isShowing &&
      controlPanelEditParamModal.isShowing
    ) {
      fetchFeatures();
    }
  }, [controlPanelEditFeatureModal.isShowing]);

  const fetchFeatures = () => {
    fetchFeaturesAPI().then((data) => {
      setFeatures(data.rows);
    });
  };

  const fetchParam = () => {
    fetchParamAPI(controlPanelEditParamModal.paramId).then((data) => {
      if (data.feature) setSelectedFeature(data.feature);
      setParam(data);
      setParamName(data.name);
      setParamValue(data.value);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditParamModal());

    setFeatures([]);
    setSelectedFeature(features[0]);
    setParam(undefined);
    setParamName('');
    setParamValue('');
  };

  const updateParam = () => {
    if (param) {
      const updatedParam: IParam = {
        ...param,
        name: paramName,
        value: paramValue,
        featureId: selectedFeature.id,
      };
      updateParamAPI(updatedParam).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createParam = () => {
    createParamAPI(paramName, paramValue, selectedFeature.id).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditFeatureModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditFeatureModal({
        isShowing: true,
        featureId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  return (
    <Modal
      title={
        controlPanelEditParamModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый параметр'
      }
      isShowing={controlPanelEditParamModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.main_controls}>
          <Tooltip label="Характеристика">
            <div style={{ width: '100%' }}>
              <SelectButton
                items={features}
                defaultSelectedItem={selectedFeature}
                changeHandler={(e) => setSelectedFeature(e)}
                style={{ width: '100%' }}
              />
            </div>
          </Tooltip>

          <Tooltip label="Добавить характеристику">
            <div>
              <IconButton icon={plusIcon} onClick={openEditFeatureModal} />
            </div>
          </Tooltip>
        </div>

        <Textbox
          label="Наименование"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />

        <Textbox
          label="Значение (цвет в HEX)"
          value={paramValue}
          onChange={(e) => setParamValue(e.target.value)}
          containerStyle={{ margin: '12px 0', minWidth: '310px' }}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditParamModal.mode === Modes.ADD_MODE ? (
            <Button variant={ButtonVariants.primary} onClick={createParam}>
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateParam}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditParamModal;
