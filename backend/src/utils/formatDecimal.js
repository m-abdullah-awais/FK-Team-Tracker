// utils/formatDecimal.js
export const formatDecimal = (num, digits = 2) => {
    if (typeof num !== 'number') return 0;
    return Number(num.toFixed(digits));
  };
  