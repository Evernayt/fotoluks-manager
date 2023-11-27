const correctPhone = (phone: string) => {
  phone = phone.replace(/\D/g, '');
  let editedPhone = phone;
  if (phone.startsWith('+7') || phone.startsWith('7')) {
    editedPhone = phone.replace('+', '').replace('7', '8');
  } else if (phone.length > 0 && !phone.startsWith('8')) {
    editedPhone = '8' + phone;
  }
  editedPhone = editedPhone.substring(0, 11);
  return editedPhone;
};

export default correctPhone;
