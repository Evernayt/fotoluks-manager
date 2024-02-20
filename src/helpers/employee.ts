import { APPS, ROLE_ID } from 'constants/app';
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

export const getEmployeeFullName = (employee: IEmployee | null | undefined) => {
  return `${employee?.name} ${employee?.surname}`;
};

export const getEmployeeShortName = (
  employee: IEmployee | null | undefined
) => {
  return `${employee?.name} ${employee?.surname[0]}.`;
};

export const checkAccessByLevel = (
  employee: IEmployee | null | undefined,
  accessLevel: number
) => {
  if (employee && employee.roles) {
    const minAccessLevel = Math.min(
      ...employee.roles.map((role) => role.accessLevel)
    );
    return minAccessLevel <= accessLevel;
  } else {
    return false;
  }
};

export const checkAccessByRole = (
  employee: IEmployee | null | undefined,
  role: keyof typeof ROLE_ID
) => {
  if (employee && employee.roles) {
    return employee.roles.some((x) => x.name === role);
  } else {
    return false;
  }
};
