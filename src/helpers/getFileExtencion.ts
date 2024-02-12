const getFileExtencion = (fileName: string | undefined) => {
  return fileName?.split('.').pop() || '';
};

export default getFileExtencion;
