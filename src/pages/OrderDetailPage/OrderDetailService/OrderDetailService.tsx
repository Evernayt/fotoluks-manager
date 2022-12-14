import { DropdownButton, IconButton } from 'components';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconDotsMenu, IconEdit, IconFolder } from 'icons';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { FC } from 'react';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderDetailService.module.css';

interface OrderDetailServiceProps {
  finishedProduct: IFinishedProduct;
  openServiceModal: (mode: Modes, finishedProduct: IFinishedProduct) => void;
}

const OrderDetailService: FC<OrderDetailServiceProps> = ({
  finishedProduct,
  openServiceModal,
}) => {
  const finishedProductsForCreate = useAppSelector(
    (state) => state.order.finishedProductsForCreate
  );
  const mainFolder = useAppSelector((state) => state.app.mainFolder);

  const dispatch = useAppDispatch();

  const deleteFinishedProduct = () => {
    dispatch(orderSlice.actions.deleteFinishedProduct(finishedProduct.id));
    const finishedProductForCreate = finishedProductsForCreate.find(
      (x) => x.id === finishedProduct.id
    );

    if (finishedProductForCreate === undefined) {
      dispatch(
        orderSlice.actions.addFinishedProductsForDelete(
          Number(finishedProduct.id)
        )
      );
    }
  };

  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-directory', [mainFolder]);

    window.electron.ipcRenderer.once('select-directory', (arg: any) => {
      const fullPath: string = arg[0][0];
      if (fullPath === undefined) return;

      const folder = fullPath.replace(mainFolder, '');
      dispatch(
        orderSlice.actions.updateFinishedProduct({ ...finishedProduct, folder })
      );
    });
  };

  const deleteFolder = () => {
    dispatch(
      orderSlice.actions.updateFinishedProduct({
        ...finishedProduct,
        folder: '',
      })
    );
  };

  const openFolder = () => {
    const folderPath = mainFolder + finishedProduct.folder;
    window.electron.ipcRenderer.sendMessage('open-folder', [folderPath]);
  };

  const serviceMenu = [
    {
      id: 1,
      name: finishedProduct.folder ? '?????????????????? ??????????' : '?????????????????? ??????????',
      onClick: finishedProduct.folder ? deleteFolder : selectFolder,
    },
    {
      id: 2,
      name: '??????????????',
      onClick: deleteFinishedProduct,
    },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.info_container}>
        <div className={styles.main_info}>
          <img
            className={styles.img}
            src={
              finishedProduct.type.image ? finishedProduct.type.image : noImage
            }
            alt=""
          />
          <div className={styles.info}>
            <span className={styles.product_name}>
              {finishedProduct.product.name},{' '}
              {finishedProduct.type.name.toLowerCase()}
            </span>
            <div>
              {finishedProduct.selectedParams.map((selectedParam) => {
                if (!selectedParam.param) return;
                if (selectedParam.param.feature?.name === '????????') {
                  return (
                    <div
                      className={styles.product_param}
                      key={selectedParam.id}
                    >
                      {selectedParam.param.feature.name}:{' '}
                      <span
                        className={styles.product_param_color}
                        style={{
                          backgroundColor: selectedParam.param.value,
                        }}
                      >
                        <span style={{ color: 'white' }}>
                          {selectedParam.param.name}
                        </span>
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <span
                      className={styles.product_param}
                      key={selectedParam.id}
                    >
                      {selectedParam.param.feature?.name}:{' '}
                      {selectedParam.param.value}
                    </span>
                  );
                }
              })}
            </div>
            <div>
              <span className={styles.product_price}>
                ????????: {finishedProduct.price} ??.
              </span>
              <span className={styles.product_quantity}>
                ??????-????: {finishedProduct.quantity} ????.
              </span>
            </div>
          </div>
        </div>
        {finishedProduct.comment && (
          <div className={styles.product_comment}>
            {finishedProduct.comment}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <IconButton
          icon={<IconEdit className="secondary-icon" />}
          style={{ marginBottom: '8px' }}
          onClick={() => openServiceModal(Modes.EDIT_MODE, finishedProduct)}
        />
        <DropdownButton
          options={serviceMenu}
          icon={<IconDotsMenu className="secondary-icon" />}
          placement={Placements.leftStart}
        />
        {finishedProduct.folder && (
          <IconButton
            icon={<IconFolder className="secondary-icon" />}
            style={{ marginTop: '8px' }}
            onClick={openFolder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetailService;
