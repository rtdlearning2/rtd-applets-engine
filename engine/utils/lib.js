export const parseSize = (value, fallback) => {
  const num = Number.parseFloat(String(value).trim());
  return Number.isFinite(num) ? num : fallback;
};
