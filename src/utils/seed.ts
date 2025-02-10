export interface SeedInfo {
  falSeed: number;  // Original FAL seed
  seed: number;     // Compressed 7-digit seed
}

// Frontend doesn't need to compress seeds, only display them
// Compression happens on the backend