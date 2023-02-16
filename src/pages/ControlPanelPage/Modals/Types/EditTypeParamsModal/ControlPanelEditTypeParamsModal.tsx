import ParamAPI from 'api/ParamAPI/ParamAPI';
import TypeAPI from 'api/TypeAPI/TypeAPI';
import { Button, IconButton, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconMinus, IconPlus } from 'icons';
import { IParam } from 'models/api/IParam';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditTypeParamsModal.module.scss';

const ControlPanelEditTypeParamsModal = () => {
  const [params, setParams] = useState<IParam[]>([]);
  const [typeParamsForCreate, setTypeParamsForCreate] = useState<IParam[]>([]);
  const [typeParamsForDelete, setTypeParamsForDelete] = useState<IParam[]>([]);

  const editTypeParamsModal = useAppSelector(
    (state) => state.modal.controlPanelEditTypeParamsModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editTypeParamsModal.isShowing) {
      fetchTypeParams();
    }
  }, [editTypeParamsModal.isShowing]);

  const fetchTypeParams = () => {
    TypeAPI.getParams({
      id: editTypeParamsModal.typeId,
      featureId: editTypeParamsModal.feature?.id,
    }).then((data) => {
      setTypeParamsForCreate(data);
      fetchParams(data);
    });
  };

  const fetchParams = (typeParams: IParam[]) => {
    ParamAPI.getAll({ featureId: editTypeParamsModal.feature?.id }).then(
      (data) => {
        setParams(paramsMinusTypeParams(data.rows, typeParams));
      }
    );
  };

  const paramsMinusTypeParams = (
    params: IParam[],
    typeParams: IParam[]
  ): IParam[] => {
    return params.filter((param) => {
      return !typeParams.find((typeParam) => {
        return param.id === typeParam.id;
      });
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditTypeParamsModal'));

    setTypeParamsForCreate([]);
    setTypeParamsForDelete([]);
    setParams([]);
  };

  const updateTypeParams = () => {
    const paramIdsForCreate: number[] = [];
    const paramIdsForDelete: number[] = [];
    typeParamsForCreate.forEach((typeParamForCreate) => {
      paramIdsForCreate.push(typeParamForCreate.id);
    });
    typeParamsForDelete.forEach((typeParamForDelete) => {
      paramIdsForDelete.push(typeParamForDelete.id);
    });

    TypeAPI.updateParams({
      id: editTypeParamsModal.typeId,
      paramIdsForCreate,
      paramIdsForDelete,
    }).then(() => {
      close();
    });
  };

  const removeTypeParam = (param: IParam) => {
    setTypeParamsForCreate((prevState) =>
      prevState.filter((state) => state.id !== param.id)
    );

    setTypeParamsForDelete((prevState) => [...prevState, param]);

    setParams((prevState) => [...prevState, param]);
  };

  const addTypeParam = (param: IParam) => {
    setTypeParamsForCreate((prevState) => [...prevState, param]);

    setTypeParamsForDelete((prevState) =>
      prevState.filter((state) => state.id !== param.id)
    );

    setParams((prevState) =>
      prevState.filter((state) => state.id !== param.id)
    );
  };

  return (
    <Modal
      title={editTypeParamsModal.feature?.pluralName}
      isShowing={editTypeParamsModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.controls_container}>
          {typeParamsForCreate.map((typeParam) => (
            <div className={styles.param_item} key={typeParam.id}>
              {typeParam.name}
              <IconButton
                icon={<IconMinus className="secondary-icon" />}
                style={{ minHeight: '32px', padding: '4px' }}
                onClick={() => removeTypeParam(typeParam)}
              />
            </div>
          ))}
        </div>
        <div className={styles.controls_container}>
          {params.map((param) => (
            <div className={styles.param_item} key={param.id}>
              {param.name}
              <IconButton
                icon={<IconPlus className="secondary-icon" />}
                style={{ minHeight: '32px', padding: '4px' }}
                onClick={() => addTypeParam(param)}
              />
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          <Button variant={ButtonVariants.primary} onClick={updateTypeParams}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditTypeParamsModal;
