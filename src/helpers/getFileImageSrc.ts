const getFileImageSrc = (image: File | null) => {
  return image ? URL.createObjectURL(image) : null;
};

export default getFileImageSrc;
