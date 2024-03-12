import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { EditableAvatar } from 'components';
import { MODES, REQUIRED_INVALID_MSG } from 'constants/app';
import { Field, FieldProps, Form, Formik } from 'formik';
import { getEmployeeShortName } from 'helpers/employee';
import { getErrorToast } from 'helpers/toast';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IEmployee } from 'models/api/IEmployee';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import * as Yup from 'yup';
import { SelectField } from 'components/ui/select/Select';
import ChatAPI from 'api/ChatAPI/ChatAPI';
import { CreateChatDto } from 'api/ChatAPI/dto/create-chat.dto';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { getFileImageSrc } from 'helpers';
import { UpdateChatDto } from 'api/ChatAPI/dto/update-chat.dto';
import FileAPI from 'api/FileAPI/FileAPI';
import { messengerActions } from 'store/reducers/MessengerSlice';
import socketio from 'socket/socketio';
import styles from './MessengerChatEditModal.module.scss';

interface FormValues {
  name: string;
  employees: IEmployee[];
  creatorId: number;
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  employees: [],
  creatorId: 0,
};

const addFormSchema = Yup.object({
  name: Yup.string().required(REQUIRED_INVALID_MSG),
  employees: Yup.array().min(1, REQUIRED_INVALID_MSG),
});

const editFormSchema = addFormSchema.shape({
  creatorId: Yup.number()
    .min(1, REQUIRED_INVALID_MSG)
    .required(REQUIRED_INVALID_MSG),
});

const MessengerChatEditModal = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [creators, setCreators] = useState<IEmployee[]>([]);
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, mode, chatId } = useAppSelector(
    (state) => state.modal.messengerChatEditModal
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const activeChat = useAppSelector((state) => state.messenger.activeChat);

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchChat();
    }
  }, [isOpen]);

  const fetchEmployees = () => {
    EmployeeAPI.getAll()
      .then((data) => {
        const employeesWithoutMe = data.rows.filter(
          (x) => x.id !== employee?.id
        );
        setEmployees(employeesWithoutMe);
        setCreators(data.rows);
      })
      .catch((e) => toast(getErrorToast(e)))
      .finally(() => setIsLoading(false));
  };

  const fetchChat = () => {
    if (!chatId) return;

    setIsLoading(true);
    ChatAPI.getOne(chatId)
      .then((data) => {
        const chatEmployees = data.chatMembers?.map(
          (chatMember) => chatMember.employee
        );
        const employeesWithoutMe = chatEmployees?.filter(
          (x) => x.id !== employee?.id
        );
        setImage(data.image);
        setFormState({ ...data, employees: employeesWithoutMe || [] });
      })
      .catch((e) => toast(getErrorToast(e)))
      .finally(() => setIsLoading(false));
  };

  const createChat = (imageLink: string | null, values: FormValues) => {
    const employeeIds = values.employees.map((x) => x.id);
    const createdChat: CreateChatDto = {
      name: values.name,
      image: imageLink,
      creatorId: employee?.id,
      employeeIds,
    };

    return new Promise((resolve, reject) => {
      ChatAPI.create(createdChat)
        .then((data) => {
          dispatch(messengerActions.addChat(data));
          dispatch(messengerActions.setActiveChat(data));
          socketio.updateChat(data);
          closeModal();
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  };

  const updateChat = (imageLink: string | null, values: FormValues) => {
    const employeeIds = values.employees.map((x) => x.id);
    if (employee) employeeIds.push(employee.id);
    if (values.creatorId) {
      if (!employeeIds.some((id) => id === values.creatorId)) {
        employeeIds.push(values.creatorId);
      }
    }
    const updatedChat: UpdateChatDto = {
      id: chatId,
      name: values.name,
      image: imageLink,
      employeeIds,
      creatorId: values.creatorId,
    };

    return new Promise((resolve, reject) => {
      ChatAPI.update(updatedChat)
        .then((data) => {
          dispatch(messengerActions.updateChat(data));
          if (activeChat?.id === data.id) {
            dispatch(messengerActions.setActiveChat(data));
          }
          socketio.updateChat(data);
          closeModal();
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  };

  const submit = (values: FormValues) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      if (imageFile) {
        FileAPI.uploadAvatar(imageFile)
          .then(({ link }) => {
            setIsLoading(true);
            createChat(link, values)
              .catch((e) =>
                toast(getErrorToast('MessengerChatEditModal.createChat', e))
              )
              .finally(() => setIsLoading(false));
          })
          .catch((e) =>
            toast(getErrorToast('MessengerChatEditModal.uploadImage', e))
          )
          .finally(() => setIsLoading(false));
      } else {
        createChat(null, values)
          .catch((e) =>
            toast(getErrorToast('MessengerChatEditModal.createChat', e))
          )
          .finally(() => setIsLoading(false));
      }
    } else {
      if (imageFile) {
        FileAPI.uploadManagerFile(imageFile)
          .then(({ link }) => {
            setIsLoading(true);
            updateChat(link, values)
              .catch((e) =>
                toast(getErrorToast('MessengerChatEditModal.updateChat', e))
              )
              .finally(() => setIsLoading(false));
          })
          .catch((e) =>
            toast(getErrorToast('MessengerChatEditModal.uploadImage', e))
          )
          .finally(() => setIsLoading(false));
      } else {
        updateChat(image, values)
          .catch((e) =>
            toast(getErrorToast('MessengerChatEditModal.updateChat', e))
          )
          .finally(() => setIsLoading(false));
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImage(null);
  };

  const closeModal = () => {
    setImageFile(null);
    setImage(null);
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('messengerChatEditModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === MODES.ADD_MODE ? 'Новый чат' : 'Редактирование чата'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoaderWrapper isLoading={isLoading}>
            <div className={styles.container}>
              <EditableAvatar
                avatar={imageFile ? getFileImageSrc(imageFile) : image}
                onAvatarSelect={setImageFile}
                onAvatarRemove={removeImage}
              />
              <div>
                <Divider orientation="vertical" mx={2} />
              </div>
              <div className={styles.form_container}>
                <Formik
                  initialValues={formState}
                  validationSchema={
                    mode === MODES.ADD_MODE ? addFormSchema : editFormSchema
                  }
                  enableReinitialize
                  onSubmit={submit}
                >
                  {() => (
                    <Form className={styles.form}>
                      <Field name="name">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!meta.error && meta.touched}>
                            <FormLabel>Название чата</FormLabel>
                            <Input {...field} placeholder="Название чата" />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="employees">
                        {({ field, form, meta }: FieldProps) => (
                          <FormControl isInvalid={!!meta.error && meta.touched}>
                            <FormLabel>Участники чата</FormLabel>
                            <SelectField
                              placeholder="Участники чата"
                              options={employees}
                              isMulti
                              isClearable={false}
                              getOptionLabel={(option) =>
                                getEmployeeShortName(option)
                              }
                              getOptionValue={(option) => option.id}
                              fieldProps={field}
                              formProps={form}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      {mode === MODES.EDIT_MODE && (
                        <Field name="creatorId">
                          {({ field, form, meta }: FieldProps) => (
                            <FormControl
                              isInvalid={!!meta.error && meta.touched}
                            >
                              <FormLabel>Админ чата</FormLabel>
                              <SelectField
                                placeholder="Админ чата"
                                options={creators}
                                getOptionLabel={(option) =>
                                  getEmployeeShortName(option)
                                }
                                getOptionValue={(option) => option.id}
                                fieldProps={field}
                                formProps={form}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )}
                      <div className={styles.footer}>
                        <Button
                          className={styles.footer_button}
                          onClick={closeModal}
                        >
                          Отмена
                        </Button>
                        <Button
                          className={styles.footer_button}
                          type="submit"
                          colorScheme="yellow"
                        >
                          {mode === MODES.ADD_MODE
                            ? 'Создать чат'
                            : 'Сохранить'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MessengerChatEditModal;
