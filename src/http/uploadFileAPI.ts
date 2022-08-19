import { SERVER_API_URL } from 'constants/api';

export const uploadAvatarAPI = async (formData: BodyInit) => {
  const route = `${SERVER_API_URL}api/uploadFile/avatar/`;
  const res = await fetch(route, {
    method: 'POST',
    body: formData,
  });
  return res;
};
