/**
 * Generates a random 7-digit number (1000000-9999999) for seed
 * @returns number - A random 7-digit number
 */
export const generateFalSeed = (): number => {
  const min = 1000000; // 7 digits start
  const max = 9999999; // 7 digits end
  return Math.floor(Math.random() * (max - min + 1)) + min;
};