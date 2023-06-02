import { IEmployee } from '../models/api/IEmployee';

const accessCheck = (employee: IEmployee | null, accessLevel: number) => {
  if (!employee || !employee.role) {
    return false;
  } else if (employee.role.accessLevel <= accessLevel) {
    return true;
  } else {
    return false;
  }
};

export default accessCheck;
