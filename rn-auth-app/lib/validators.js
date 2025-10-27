export const isEmail = (v ='') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const minLen = (v = '', n) => (v || '').length >= n;