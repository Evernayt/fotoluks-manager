import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Code,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { DatePicker, PeriodSelect } from 'components';
import { useState } from 'react';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { getErrorToast } from 'helpers/toast';
import moment from 'moment';
import { ICON_SIZE, MS_DATE_FORMAT } from 'constants/app';
import { IconInfoCircle } from '@tabler/icons-react';
import styles from './UpdateRetailshiftsModel.module.scss';

interface FormState {
  dates: [string, string];
}

const INITIAL_FORM_STATE: FormState = {
  dates: ['', ''],
};

const OWNER_GROUPS = [
  {
    href: 'https://api.moysklad.ru/api/remap/1.2/entity/group/0447b753-d269-11e4-90a2-8ecb00030567',
    name: 'Фото и печатных услуг',
    suffixes: ['.1', '.4'],
  },
  {
    href: 'https://api.moysklad.ru/api/remap/1.2/entity/group/dac5cdd0-6ce9-11e6-7a69-8f55002015cc',
    name: 'Канцтовары',
    suffixes: ['.2', '.3'],
  },
];

const UpdateRetailshiftsModel = () => {
  const [progress, setProgress] = useState<number>(0);
  const [maxProgress, setMaxProgress] = useState<number>(0);
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [skipMessage, setSkipMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [updatedRetailshifts, setUpdatedRetailshifts] = useState<string[]>([]);
  const [skippedRetailshifts, setSkippedRetailshifts] = useState<string[]>([]);
  const [errorRetailshifts, setErrorRetailshifts] = useState<string[]>([]);

  const { isOpen } = useAppSelector(
    (state) => state.modal.updateRetailshiftsModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  const updateRetailshifts = async (
    values: FormState,
    { setSubmitting }: FormikHelpers<FormState>
  ) => {
    try {
      setProgress(0);
      setUpdateMessage('');
      setSkipMessage('');
      setErrorMessage('');
      setUpdatedRetailshifts([]);
      setSkippedRetailshifts([]);
      setErrorRetailshifts([]);

      const startDate = moment(values.dates[0]).format(MS_DATE_FORMAT);
      const endDate = moment(values.dates[1]).format(MS_DATE_FORMAT);

      const [employeeData, retailshiftData] = await Promise.all([
        MoyskladAPI.getEmployees(),
        MoyskladAPI.getRetailshifts({ momentPeriod: [startDate, endDate] }),
      ]);

      if (!retailshiftData?.rows) {
        setSubmitting(false);
        return;
      }

      const tasksToProcess = retailshiftData.rows.filter((retailshift) => {
        return !/\.\d+/.test(retailshift.name);
      });

      const tasksToSkip = retailshiftData.rows.filter((retailshift) => {
        return /\.\d+/.test(retailshift.name);
      });

      setMaxProgress(tasksToProcess.length);

      if (tasksToSkip.length > 0) {
        setSkippedRetailshifts(tasksToSkip.map((r) => r.name));
        setSkipMessage(`Пропущено: ${tasksToSkip.length}`);
      }

      const updated: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < tasksToProcess.length; i++) {
        const retailshift = tasksToProcess[i];

        try {
          const employeeHref = retailshift.owner.meta.href;
          const foundEmployee = employeeData.rows?.find(
            (employee) => employee.meta.href === employeeHref
          );
          const ownerGroup = OWNER_GROUPS.find(
            (group) => group.href === foundEmployee?.group.meta.href
          );

          if (ownerGroup) {
            let retailshiftName = retailshift.name + ownerGroup.suffixes[0];

            const containedInSkip = tasksToSkip.some(
              (r) => r.name === retailshiftName
            );
            const containedInUpdated = updated.some(
              (name) => name === retailshiftName
            );

            if (containedInSkip || containedInUpdated) {
              retailshiftName = retailshift.name + ownerGroup.suffixes[1];
            }

            const newRetailshift = {
              id: retailshift.id,
              name: retailshiftName,
            };

            let isUpdated = false;
            let retries = 0;
            const maxRetries = 3;

            while (retries < maxRetries) {
              try {
                isUpdated = await MoyskladAPI.updateRetailshift(newRetailshift);
                break;
              } catch (err: any) {
                const status = err.response?.status;
                if (status === 429 || status === 503) {
                  retries++;
                  const delay = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
                  await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                  throw err;
                }
              }
            }

            if (isUpdated) {
              updated.push(newRetailshift.name);
              setUpdateMessage(
                `Обновление: ${retailshift.name} ➜ ${newRetailshift.name}`
              );
            } else {
              errors.push(retailshift.name);
              setErrorMessage(
                `Ошибка: ${retailshift.name} ✖ ${newRetailshift.name}`
              );
            }
          }

          setProgress((prev) => prev + 1);

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Failed to process ${retailshift.name}`, err);
          errors.push(retailshift.name);
          setProgress((prev) => prev + 1);
        }
      }

      if (updated.length > 0) {
        setUpdateMessage(`Обновлено: ${updated.length}`);
      }
      if (errors.length > 0) {
        setErrorMessage(`Ошибок: ${errors.length}`);
      }
      setUpdatedRetailshifts(updated);
      setErrorRetailshifts(errors);
    } catch (error) {
      toast(getErrorToast('updateRetailshifts.getRetailshifts'));
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('updateRetailshiftsModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" flexDir="row" alignItems="center" gap="8px">
          Изменение номеров
          <Tooltip
            label={`Фото и печатных услуг — *.1 или *.4\nКанцтовары — *.2 или *.3`}
            whiteSpace="pre-line"
            placement="right"
          >
            <IconInfoCircle size={ICON_SIZE} />
          </Tooltip>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={INITIAL_FORM_STATE}
            enableReinitialize
            onSubmit={updateRetailshifts}
          >
            {(props) => (
              <Form className={styles.form}>
                <Field name="dates">
                  {({ field, form }: FieldProps) => (
                    <FormControl>
                      <PeriodSelect
                        label="Дата открытия"
                        onClick={(period) =>
                          form.setFieldValue('dates', [
                            period.startDate,
                            period.endDate,
                          ])
                        }
                      />
                      <DatePicker
                        placeholderText="Дата открытия"
                        startDate={field.value[0]}
                        endDate={field.value[1]}
                        selectsRange
                        isClearable
                        disabled={form.isSubmitting}
                        onChange={(startDate, endDate) =>
                          form.setFieldValue('dates', [startDate, endDate])
                        }
                      />
                    </FormControl>
                  )}
                </Field>
                <Accordion allowToggle>
                  {updateMessage && (
                    <AccordionItem
                      mb="8px"
                      isDisabled={updatedRetailshifts.length === 0}
                    >
                      <AccordionButton
                        p="0"
                        _hover={{ bgColor: 'none' }}
                        _disabled={{ opacity: 1, cursor: 'default' }}
                      >
                        <Badge colorScheme="green" flex="1" textAlign="left">
                          <HStack justify="space-between">
                            <Text fontSize="10.5px">{updateMessage}</Text>
                            {updatedRetailshifts.length !== 0 && (
                              <AccordionIcon />
                            )}
                          </HStack>
                        </Badge>
                      </AccordionButton>
                      <AccordionPanel pb="8px">
                        <Code colorScheme="green">
                          {updatedRetailshifts.join(', ')}
                        </Code>
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                  {skipMessage && (
                    <AccordionItem
                      mb="8px"
                      isDisabled={skippedRetailshifts.length === 0}
                    >
                      <AccordionButton
                        p="0"
                        _hover={{ bgColor: 'none' }}
                        _disabled={{ opacity: 1, cursor: 'default' }}
                      >
                        <Badge flex="1" textAlign="left">
                          <HStack justify="space-between">
                            <Text fontSize="10.5px">{skipMessage}</Text>
                            {skippedRetailshifts.length !== 0 && (
                              <AccordionIcon />
                            )}
                          </HStack>
                        </Badge>
                      </AccordionButton>
                      <AccordionPanel pb="8px">
                        <Code>{skippedRetailshifts.join(', ')}</Code>
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                  {errorMessage && (
                    <AccordionItem
                      mb="8px"
                      isDisabled={errorRetailshifts.length === 0}
                    >
                      <AccordionButton
                        p="0"
                        _hover={{ bgColor: 'none' }}
                        _disabled={{ opacity: 1, cursor: 'default' }}
                      >
                        <Badge colorScheme="red" flex="1" textAlign="left">
                          <HStack justify="space-between">
                            <Text fontSize="10.5px">{errorMessage}</Text>
                            {errorRetailshifts.length !== 0 && (
                              <AccordionIcon />
                            )}
                          </HStack>
                        </Badge>
                      </AccordionButton>
                      <AccordionPanel pb="8px">
                        <Code colorScheme="red">
                          {errorRetailshifts.join(', ')}
                        </Code>
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                </Accordion>
                {progress > 0 && (
                  <Progress
                    value={progress}
                    max={maxProgress}
                    colorScheme="yellow"
                    size="xs"
                    borderRadius="full"
                  />
                )}
                <div className={styles.footer}>
                  <Button
                    className={styles.footer_button}
                    isLoading={props.isSubmitting}
                    type="submit"
                    colorScheme="yellow"
                    isDisabled={!props.values.dates[0]}
                  >
                    Изменить
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateRetailshiftsModel;
