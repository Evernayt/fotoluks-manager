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
import { AutoResizableTextarea, MaskedInput } from 'components';
import { useEffect, useState } from 'react';
import ChangelogAPI from 'api/ChangelogAPI/ChangelogAPI';
import * as Yup from 'yup';
import { MIN_INVALID_MSG, MODES, REQUIRED_INVALID_MSG } from 'constants/app';
import { getErrorToast } from 'helpers/toast';
import { CreateChangelogDto } from 'api/ChangelogAPI/dto/create-changelog.dto';
import { controlActions } from 'store/reducers/ControlSlice';
import { UpdateChangelogDto } from 'api/ChangelogAPI/dto/update-changelog.dto';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { Field, FieldProps, Form, Formik } from 'formik';
import { mask } from 'node-masker';
import styles from './ChangelogsEditModal.module.scss';

interface FormValues {
  version: string;
  description: string;
}

const INITIAL_FORM_STATE: FormValues = {
  version: '',
  description: '',
};

const formSchema = Yup.object({
  version: Yup.string().required(REQUIRED_INVALID_MSG).min(5, MIN_INVALID_MSG),
  description: Yup.string().required(REQUIRED_INVALID_MSG),
});

const ChangelogsEditModal = () => {
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, changelogId, version, mode } = useAppSelector(
    (state) => state.modal.changelogsEditModal
  );

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

  const submit = (values: FormValues) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      createChangelog(values);
    } else {
      updateChangelog(values);
    }
  };

  const closeModal = (forceUpdate: boolean = false) => {
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
            <Formik
              initialValues={formState}
              validationSchema={formSchema}
              enableReinitialize
              onSubmit={submit}
            >
              {() => (
                <Form className={styles.form}>
                  <Field name="version">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Версия</FormLabel>
                        <MaskedInput
                          {...field}
                          placeholder="Версия"
                          onChange={(value) =>
                            form.setFieldValue(field.name, mask(value, '9.9.9'))
                          }
                          mask="9.9.9"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Что нового</FormLabel>
                        <AutoResizableTextarea
                          {...field}
                          placeholder="Что нового"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
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
                </Form>
              )}
            </Formik>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangelogsEditModal;
