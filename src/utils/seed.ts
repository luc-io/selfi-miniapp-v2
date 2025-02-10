export const generateFalSeed = (): number => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

export const isCompressedSeed = (seed: number): boolean => {
  return seed >= 0 && seed <= 4294967295; // 2^32 - 1
};

export const expandCompressedSeed = (seed: number): number => {
  if (!isCompressedSeed(seed)) return seed;
  return seed + 4294967296; // Add 2^32
};