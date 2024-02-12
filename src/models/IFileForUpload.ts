export interface IFilePathForUpload {
  id: string;
  targetId: number | string;
  filePath: string;
}

export interface IFileForUpload {
  targetId: number | string;
  filename: string;
  file: Uint8Array;
}
