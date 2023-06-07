import FeatureAPI from 'api/FeatureAPI/FeatureAPI';
import { UpdateParamDto } from 'api/ParamAPI/dto/update-param.dto';
import ParamAPI from 'api/ParamAPI/ParamAPI';
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
import { INITIAL_FEATURE } from 'constants/states/feature-states';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconPlus } from 'icons';
import { IFeature } from 'models/api/IFeature';
import { IParam } from 'models/api/IParam';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditParamModal.module.scss';

const ControlPanelEditParamModal = () => {
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [selectedFeature, setSelectedFeature] =
    useState<IFeature>(INITIAL_FEATURE);
  const [param, setParam] = useState<IParam>();
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const editParamModal = useAppSelector(
    (state) => state.modal.controlPanelEditParamModal
  );
  const editFeatureModal = useAppSelector(
    (state) => state.modal.controlPanelEditFeatureModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editParamModal.isShowing) {
      if (editParamModal.mode === Modes.EDIT_MODE) {
        fetchParam();
      }

      fetchFeatures();
    }
  }, [editParamModal.isShowing]);

  useEffect(() => {
    if (!editFeatureModal.isShowing && editParamModal.isShowing) {
      fetchFeatures();
    }
  }, [editFeatureModal.isShowing]);

  const fetchFeatures = () => {
    FeatureAPI.getAll().then((data) => {
      setFeatures(data.rows);
    });
  };

  const fetchParam = () => {
    ParamAPI.getOne(editParamModal.paramId).then((data) => {
      if (data.feature) setSelectedFeature(data.feature);

      setParam(data);
      setName(data.name);
      setValue(data.value);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditParamModal'));

    setFeatures([]);
    setSelectedFeature(INITIAL_FEATURE);
    setParam(undefined);
    setName('');
    setValue('');
  };

  const updateParam = () => {
    if (param) {
      const updatedParam: UpdateParamDto = {
        id: param.id,
        name,
        value,
        featureId: selectedFeature.id,
      };

      ParamAPI.update(updatedParam).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createParam = () => {
    ParamAPI.create({ name, value, featureId: selectedFeature.id }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditFeatureModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditFeatureModal',
        props: { featureId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  return (
    <Modal
      title={
        editParamModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый параметр'
      }
      isShowing={editParamModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.controls_container}>
          <div className={styles.main_controls}>
            <SelectButton
              title="Характеристика"
              items={features}
              defaultSelectedItem={selectedFeature}
              onChange={setSelectedFeature}
              style={{ width: '100%' }}
            />
            <Tooltip label="Добавить характеристику">
              <div>
                <IconButton
                  icon={<IconPlus className="secondary-icon" />}
                  onClick={openEditFeatureModal}
                />
              </div>
            </Tooltip>
          </div>

          <Textbox
            label="Наименование"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textbox
            label="Значение (цвет в HEX)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            containerStyle={{ margin: '12px 0', minWidth: '310px' }}
          />
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editParamModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              disabled={selectedFeature.id === INITIAL_FEATURE.id}
              onClick={createParam}
            >
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
