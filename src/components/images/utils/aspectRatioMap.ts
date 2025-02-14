// Aspect ratio mapping from saved parameters to command format
export const ASPECT_RATIO_MAPPING: Record<string, string> = {
  landscape_4_3: '4:3',
  landscape_16_9: '16:9',
  square_hd: '1:1',
  square: '1:1',
  portrait_4_3: '3:4',  // Note: Flipped ratio for portrait
  portrait_16_9: '9:16' // Note: Flipped ratio for portrait
};