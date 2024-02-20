import { IRole } from 'models/api/IRole';
import { FC } from 'react';

interface EmployeeRolesCellProps {
  roles: IRole[];
}

const EmployeeRolesCell: FC<EmployeeRolesCellProps> = ({ roles }) => {
  return <>{roles.map((role) => role.name).join(', ')}</>;
};

export default EmployeeRolesCell;
