import { APPS } from 'constants/app';
import { IApp } from 'models/api/IApp';
import { IEmployee } from 'models/api/IEmployee';

export const getEmployeeApps = (employeeApps: IApp[] | undefined) => {
  if (!employeeApps) return [];

  return APPS.filter((app) => {
    return employeeApps.find((employeeApp) => {
      return app.value === employeeApp.value;
    });
  });
};

export const accessCheck = (
  employee: IEmployee | null,
  accessLevel: number
) => {
  if (!employee || !employee.role) {
    return false;
  } else if (employee.role.accessLevel <= accessLevel) {
    return true;
  } else {
    return false;
  }
};

export const getEmployeeFullName = (employee: IEmployee | null | undefined) => {
  return `${employee?.name} ${employee?.surname}`;
};

export const getEmployeeShortName = (
  employee: IEmployee | null | undefined
) => {
  return `${employee?.name} ${employee?.surname[0]}.`;
};
