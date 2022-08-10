const firstLetterToUpperCase = (text: string): string => {
  if (!text) return text;

  return text[0].toUpperCase() + text.slice(1);
};

export default firstLetterToUpperCase;
