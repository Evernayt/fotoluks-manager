import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { useEffect, useState } from 'react';
import ChangelogAPI from 'api/ChangelogAPI/ChangelogAPI';
import { MIN_INVALID_MSG, MODES, REQUIRED_INVALID_MSG } from 'constants/app';
import { getErrorToast } from 'helpers/toast';
import { CreateChangelogDto } from 'api/ChangelogAPI/dto/create-changelog.dto';
import { controlActions } from 'store/reducers/ControlSlice';
import { UpdateChangelogDto } from 'api/ChangelogAPI/dto/update-changelog.dto';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { mask } from 'node-masker';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MaskedInputFormField } from 'components/ui/masked-input/MaskedInput';
import { AutoResizableTextareaFormField } from 'components/ui/auto-resizable-textarea/AutoResizableTextarea';
import styles from './ChangelogsEditModal.module.scss';

interface FormValues {
  version: string;
  description: string;
}

const INITIAL_FORM_STATE: FormValues = {
  version: '',
  description: '',
};

const ChangelogsEditModal = () => {
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, changelogId, version, mode } = useAppSelector(
    (state) => state.modal.changelogsEditModal
  );

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({ values: formState });

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchChangelog();
    }
  }, [isOpen]);

  const fetchChangelog = () => {
    if (!version) return;
    setIsLoading(true);
    ChangelogAPI.getOneByVersion(version)
      .then((data) => {
        setFormState(data);
      })
      .catch((e) =>
        toast(getErrorToast('ChangelogsEditModal.fetchChangelog', e))
      )
      .finally(() => setIsLoading(false));
  };

  const createChangelog = (values: FormValues) => {
    const createdChangelog: CreateChangelogDto = values;

    ChangelogAPI.create(createdChangelog)
      .then(() => {
        closeModal(true);
      })
      .catch((e) =>
        toast(getErrorToast('ChangelogsEditModal.createChangelog', e))
      )
      .finally(() => setIsLoading(false));
  };

  const updateChangelog = (values: FormValues) => {
    const updatedChangelog: UpdateChangelogDto = {
      ...values,
      id: changelogId,
    };

    ChangelogAPI.update(updatedChangelog)
      .then(() => {
        closeModal(true);
      })
      .catch((e) =>
        toast(getErrorToast('ChangelogsEditModal.updateChangelog', e))
      )
      .finally(() => setIsLoading(false));
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      createChangelog(values);
    } else {
      updateChangelog(values);
    }
  };

  const closeModal = (forceUpdate: boolean = false) => {
    reset();
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('changelogsEditModal'));
    if (forceUpdate) dispatch(controlActions.setForceUpdate(true));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === MODES.ADD_MODE ? 'Новая версия' : 'Редактирование'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoaderWrapper isLoading={isLoading}>
            <form
              className={styles.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl isRequired isInvalid={!!errors.version}>
                <FormLabel>Версия</FormLabel>
                <MaskedInputFormField
                  control={control}
                  name="version"
                  rules={{
                    required: REQUIRED_INVALID_MSG,
                    minLength: { value: 5, message: MIN_INVALID_MSG },
                  }}
                  placeholder="Версия"
                  mask="9.9.9"
                  onChange={(value) =>
                    setValue('version', mask(value, '9.9.9'))
                  }
                />
                <FormErrorMessage>{errors.version?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.version}>
                <FormLabel>Что нового</FormLabel>
                <AutoResizableTextareaFormField
                  control={control}
                  name="description"
                  rules={{ required: REQUIRED_INVALID_MSG }}
                  placeholder="Что нового"
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
              <div className={styles.footer}>
                <Button
                  className={styles.footer_button}
                  onClick={() => closeModal()}
                >
                  Отмена
                </Button>
                <Button
                  className={styles.footer_button}
                  type="submit"
                  colorScheme="yellow"
                >
                  {mode === MODES.ADD_MODE ? 'Создать' : 'Сохранить'}
                </Button>
              </div>
            </form>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangelogsEditModal;
