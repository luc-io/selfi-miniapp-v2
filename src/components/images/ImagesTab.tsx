// Previous imports...
// Don't change any imports or interface declarations

const generateCommand = (image: GeneratedImage): string => {
  const parts = ['/gen', image.prompt];
  
  // Add model parameters
  if (image.params?.num_inference_steps) parts.push(`--s ${image.params.num_inference_steps}`);
  if (image.params?.guidance_scale) parts.push(`--c ${image.params.guidance_scale}`);
  if (typeof image.seed === 'number' && !isNaN(image.seed)) {
    parts.push(`--seed ${image.seed}`);
  }

  // Add all LoRAs with their trigger words and scales
  if (image.params?.loras?.length > 0) {
    image.params.loras.forEach(lora => {
      if (lora.triggerWord && lora.scale) {
        parts.push(`--l ${lora.triggerWord}:${lora.scale}`);
      }
    });
  }
  
  return parts.join(' ');
};

// Rest of the file remains unchanged...