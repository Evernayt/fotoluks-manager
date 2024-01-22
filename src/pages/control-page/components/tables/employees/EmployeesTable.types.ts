import { IEmployee } from 'models/api/IEmployee';

export interface IEmployeeWithConnection extends IEmployee {
  connectionStatus: 'В сети' | 'Не в сети';
}
