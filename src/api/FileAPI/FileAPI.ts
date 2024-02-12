import { $authHost } from 'api';

export default class FileAPI {
  static async uploadAvatar(file: File): Promise<{ link: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await $authHost.post('files/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  static async uploadManagerFile(file: File): Promise<{ link: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await $authHost.post(
      'files/upload-manager-file',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  }
}
