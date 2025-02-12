/**
 * Generates a 7-digit seed number for consistent image generation
 * @returns number - A random 7-digit number between 1000000 and 9999999
 */
export const generateFalSeed = (): number => {
  return Math.floor(Math.random() * 9000000) + 1000000;
};