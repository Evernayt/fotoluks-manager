import { UpdateEmployeeDto } from 'api/EmployeeAPI/dto/update-employee.dto';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import FileAPI from 'api/FileAPI/FileAPI';
import { Avatar } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { employeeSlice } from 'store/reducers/EmployeeSlice';

const ProfileAvatar = () => {
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const editAvatar = (image: File) => {
    FileAPI.uploadAvatar(image).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (employee) {
            const updatedEmployee: UpdateEmployeeDto = {
              id: employee.id,
              avatar: data.link,
            };
            EmployeeAPI.update(updatedEmployee).then((data) => {
              dispatch(employeeSlice.actions.updateEmployee(data));
            });
          }
        });
      } else {
        res.json().then((data) => {
          showGlobalMessage(data.message);
        });
      }
    });
  };

  return (
    <Avatar
      image={employee?.avatar ? employee.avatar : defaultAvatar}
      onAvatarSelect={editAvatar}
    />
  );
};

export default ProfileAvatar;
