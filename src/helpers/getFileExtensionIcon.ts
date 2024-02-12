import { EXTENSIONS } from 'constants/images';

const getFileExtensionIcon = (extension: string) => {
  switch (extension) {
    case 'cdr':
      return EXTENSIONS.cdr;
    case 'doc':
    case 'docx':
    case 'odt':
      return EXTENSIONS.doc;
    case 'dwg':
      return EXTENSIONS.dwg;
    case 'jpg':
    case 'jpeg':
      return EXTENSIONS.jpgFile;
    case 'pdf':
      return EXTENSIONS.pdf;
    case 'png':
      return EXTENSIONS.png;
    case 'ppt':
      return EXTENSIONS.ppt;
    case 'psd':
      return EXTENSIONS.psd;
    case 'rar':
      return EXTENSIONS.rar;
    case 'tiff':
    case 'tif':
      return EXTENSIONS.tiff;
    case 'txt':
      return EXTENSIONS.txt;
    case 'xls':
    case 'xlsx':
    case 'ods':
      return EXTENSIONS.xls;
    case 'zip':
    case '7z':
      return EXTENSIONS.zip;
    default:
      return EXTENSIONS.file;
  }
};

export default getFileExtensionIcon;
