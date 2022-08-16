import { Button, IconButton, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchParamsAPI } from 'http/paramAPI';
import { fetchTypeParamsAPI, updateTypeParamsAPI } from 'http/typeAPI';
import { minusIcon, plusIcon } from 'icons';
import { IParam } from 'models/IParam';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditParamsModal.module.css';

const ControlPanelEditParamsModal = () => {
  const [typeParams, setTypeParams] = useState<IParam[]>([]);
  const [params, setParams] = useState<IParam[]>([]);

  const controlPanelEditParamsModal = useAppSelector(
    (state) => state.modal.controlPanelEditParamsModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditParamsModal.isShowing) {
      fetchTypeParams();
    }
  }, [controlPanelEditParamsModal.isShowing]);

  const fetchTypeParams = () => {
    fetchTypeParamsAPI(
      controlPanelEditParamsModal.typeId,
      controlPanelEditParamsModal.feature.id
    ).then((data) => {
      setTypeParams(data);
      fetchParams(data);
    });
  };

  const fetchParams = (typeParams: IParam[]) => {
    fetchParamsAPI(controlPanelEditParamsModal.feature.id).then((data) => {
      setParams(paramsMinusTypeParams(data, typeParams));
    });
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
    dispatch(modalSlice.actions.closeControlPanelEditParamsModal());

    setTypeParams([]);
    setParams([]);
  };

  const updateTypeParams = () => {
    const paramIds: number[] = [];
    for (let i = 0; i < typeParams.length; i++) {
      paramIds.push(typeParams[i].id);
    }

    updateTypeParamsAPI(controlPanelEditParamsModal.typeId, paramIds).then(
      () => {
        close();
      }
    );
  };

  const removeTypeParam = (param: IParam) => {
    setTypeParams((prevState) =>
      prevState.filter((state) => state.id !== param.id)
    );

    setParams((prevState) => [...prevState, param]);
  };

  const addTypeParam = (param: IParam) => {
    setTypeParams((prevState) => [...prevState, param]);

    setParams((prevState) =>
      prevState.filter((state) => state.id !== param.id)
    );
  };

  return (
    <Modal
      title={controlPanelEditParamsModal.feature.pluralName}
      isShowing={controlPanelEditParamsModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.controls_container}>
          {typeParams.map((typeParam) => (
            <div className={styles.param_item} key={typeParam.id}>
              {typeParam.name}
              <IconButton
                icon={minusIcon}
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
                icon={plusIcon}
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

export default ControlPanelEditParamsModal;
