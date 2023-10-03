const capitalize = (string) => {
  if (!string) {
    return '';
  }
  const words = string
    .split(/[,.\-_\s]/)
    .map((word) => word[0].toUpperCase() + word.substring(1));

  return words.join('');
};
module.exports = {
  capitalize,
};
