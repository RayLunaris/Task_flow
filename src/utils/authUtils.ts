export const hashPassword = (password: string): string => {
 // Simple simulation of hashing for demo purposes
 return btoa(password).split('').reverse().join('');
};

export const verifyPassword = (password: string, hashed: string): boolean => {
 return hashPassword(password) === hashed;
};
