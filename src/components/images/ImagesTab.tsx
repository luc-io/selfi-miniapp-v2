// Previous imports stay the same...

const generateCommand = (image: GeneratedImage): string => {
  const parts = ['/gen', image.prompt];
  
  if (image.width && image.height) {
    const ar = image.width === image.height ? '1:1' : '16:9';
    parts.push(`--ar ${ar}`);
  }
  if (image.params?.num_inference_steps) parts.push(`--s ${image.params.num_inference_steps}`);
  if (image.params?.guidance_scale) parts.push(`--c ${image.params.guidance_scale}`);
  if (typeof image.seed === 'number' && !isNaN(image.seed)) {
    parts.push(`--seed ${image.seed}`);
  }
  // Handle optional loras with optional chaining and nullish coalescing
  (image.loras ?? []).forEach(lora => {
    parts.push(`--l ${lora.triggerWord || lora.name}:${lora.scale}`);
  });
  
  return parts.join(' ');
};

// Rest of the file stays the same...