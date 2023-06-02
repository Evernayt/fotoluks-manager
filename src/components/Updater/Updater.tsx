import IconButton, {
  IconButtonVariants,
} from 'components/UI/IconButton/IconButton';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconArrowBarToDown, IconCloudDownload } from 'icons';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './Updater.module.scss';

const Updater = () => {
  const checkUpdate = useAppSelector((state) => state.app.checkUpdate);
  const downloadUpdate = useAppSelector((state) => state.app.downloadUpdate);

  const dispatch = useAppDispatch();

  const openUpdaterModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'updaterModal' }));
  };

  const renderIcon = () => {
    if (
      checkUpdate.success &&
      !downloadUpdate.pending &&
      !downloadUpdate.success &&
      !downloadUpdate.failure
    ) {
      return (
        <Tooltip label="Доступна новая версия" placement="left">
          <div>
            <IconButton
              icon={
                <IconCloudDownload
                  className="secondary-checked-icon"
                  size={20}
                />
              }
              variant={IconButtonVariants.primary}
              circle
              onClick={openUpdaterModal}
            />
          </div>
        </Tooltip>
      );
    } else if (downloadUpdate.pending) {
      return (
        <Tooltip label="Скачивание обновлений" placement="left">
          <div>
            <IconButton
              icon={
                <IconCloudDownload
                  className={['secondary-checked-icon', styles.animate].join(
                    ' '
                  )}
                  size={20}
                />
              }
              circle
              onClick={openUpdaterModal}
            />
          </div>
        </Tooltip>
      );
    } else if (downloadUpdate.success) {
      return (
        <Tooltip label="Обновление скачано" placement="left">
          <div>
            <IconButton
              icon={
                <IconArrowBarToDown
                  className="secondary-checked-icon"
                  size={20}
                />
              }
              variant={IconButtonVariants.primary}
              circle
              onClick={openUpdaterModal}
            />
          </div>
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  return renderIcon();
};

export default Updater;
