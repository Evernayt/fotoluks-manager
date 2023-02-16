import { APPS } from 'constants/app';
import { IApp } from 'models/api/IApp';

const getApps = (employeeApps: IApp[] | undefined) => {
  if (!employeeApps) return [];

  return APPS.filter((app) => {
    return employeeApps.find((employeeApp) => {
      return app.value === employeeApp.value;
    });
  });
};

export default getApps;
