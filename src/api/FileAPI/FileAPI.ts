import { SERVER_API_URL } from 'constants/api';
import { getToken } from 'helpers/localStorage';
import { UploadFileDto } from './dto/upload-file.dto';

export default class FileAPI {
  static async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const route = `${SERVER_API_URL}files/avatar`;
    const res = await fetch(route, {
      method: 'POST',
      body: formData,
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return res;
  }

  static async uploadFile(file: File, uploadFileDto?: UploadFileDto) {
    const formData = new FormData();
    formData.append('file', file);
    for (let key in uploadFileDto) {
      //@ts-ignore
      formData.append(key, String(uploadFileDto[key]));
    }

    const route = `${SERVER_API_URL}files/upload`;
    const res = await fetch(route, {
      method: 'POST',
      body: formData,
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return res;
  }
}
