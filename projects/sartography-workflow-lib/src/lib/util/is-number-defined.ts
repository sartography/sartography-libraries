export const isNumberDefined = (n: number): boolean => (typeof n === 'number') && isFinite(n) && !isNaN(n);
