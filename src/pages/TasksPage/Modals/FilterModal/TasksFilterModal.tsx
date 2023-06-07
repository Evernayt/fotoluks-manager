import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { Button, Checkbox, Modal, SelectButton, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ALL_DEPARTMENTS } from 'constants/states/department-states';
import { ALL_SHOPS } from 'constants/states/shop-states';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDepartment } from 'models/api/IDepartment';
import { IShop } from 'models/api/IShop';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { taskSlice } from 'store/reducers/TaskSlice';
import styles from './TasksFilterModal.module.scss';
import { accessCheck } from 'helpers';

const TasksFilterModal = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [urgent, setUrgent] = useState<boolean>(false);

  const tasksFilterModal = useAppSelector(
    (state) => state.modal.tasksFilterModal
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const selectedShop = useAppSelector((state) => state.task.selectedShop);
  const selectedDepartment = useAppSelector(
    (state) => state.task.selectedDepartment
  );
  const iTaskMember = useAppSelector((state) => state.task.iTaskMember);
  const iTaskCreator = useAppSelector((state) => state.task.iTaskCreator);
  const archive = useAppSelector((state) => state.task.archive);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tasksFilterModal.isShowing) {
      fetchShops();
      fetchDepartments();
    }
  }, [tasksFilterModal.isShowing]);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops([ALL_SHOPS, ...data.rows]);
    });
  };

  const fetchDepartments = () => {
    DepartmentAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setDepartments([ALL_DEPARTMENTS, ...data.rows]);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('tasksFilterModal'));
  };

  const clear = () => {
    dispatch(taskSlice.actions.setForceUpdate(true));
    dispatch(taskSlice.actions.clearFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(taskSlice.actions.setForceUpdate(true));
    dispatch(
      taskSlice.actions.activeFilter({
        shopIds: [selectedShop.id],
        departmentIds: [selectedDepartment.id],
        creatorId: iTaskCreator ? employee?.id : undefined,
        employeeId: iTaskMember ? employee?.id : undefined,
        archive,
        startDate,
        endDate,
        urgent,
      })
    );
    close();
  };

  const reset = () => {
    dispatch(taskSlice.actions.setSelectedShop(ALL_SHOPS));
    dispatch(taskSlice.actions.setSelectedDepartment(ALL_DEPARTMENTS));
    dispatch(taskSlice.actions.setITaskCreator(false));
    dispatch(taskSlice.actions.setITaskMember(false));
    dispatch(taskSlice.actions.setArchive(false));
    setStartDate('');
    setEndDate('');
    setUrgent(false);
  };

  return (
    <Modal
      title="Фильтры задач"
      isShowing={tasksFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <SelectButton
          title="Филиал"
          containerClassName={styles.select_btn}
          items={shops}
          defaultSelectedItem={selectedShop}
          onChange={(item) => dispatch(taskSlice.actions.setSelectedShop(item))}
        />
        <SelectButton
          title="Отдел"
          containerClassName={styles.select_btn}
          items={departments}
          defaultSelectedItem={selectedDepartment}
          onChange={(item) =>
            dispatch(taskSlice.actions.setSelectedDepartment(item))
          }
        />
        <Textbox
          label="От"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Textbox
          label="До"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {accessCheck(employee, 1) && (
          <Checkbox
            text="Я участвую в задаче"
            checked={iTaskMember}
            onChange={() =>
              dispatch(taskSlice.actions.setITaskMember(!iTaskMember))
            }
          />
        )}
        <Checkbox
          text="Я создатель задачи"
          checked={iTaskCreator}
          onChange={() =>
            dispatch(taskSlice.actions.setITaskCreator(!iTaskCreator))
          }
        />
        <Checkbox
          text="Срочная задача"
          checked={urgent}
          onChange={() => setUrgent((prevState) => !prevState)}
        />
        <Checkbox
          text="В архиве"
          checked={archive}
          onChange={() => dispatch(taskSlice.actions.setArchive(!archive))}
        />
      </div>
      <div className={styles.controls}>
        <Button onClick={clear}>Очистить</Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default TasksFilterModal;
