import { type Model } from '@/types';

interface Params {
  image_size: string;
  num_inference_steps: number;
  seed: number;
  guidance_scale: number;
  num_images: number;
  sync_mode: boolean;
  enable_safety_checker: boolean;
  output_format: 'jpeg' | 'png';
}

interface SaveParamsResponse {
  success: boolean;
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const paramsApi = {
  async saveParams(model: Model, params: Params): Promise<SaveParamsResponse> {
    try {
      console.log('[API] Saving parameters:', { 
        url: `${API_URL}/api/params`,
        model, 
        params,
        initData: window.Telegram?.WebApp?.initData,
        userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id
      });
      
      const response = await fetch(`${API_URL}/api/params`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': window.Telegram?.WebApp?.initData || ''
        },
        body: JSON.stringify({
          user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
          model,
          params
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] Failed to save parameters:', { 
          status: response.status,
          statusText: response.statusText,
          error: errorData 
        });
        throw new Error(errorData.message || 'Failed to save parameters');
      }

      const data = await response.json();
      console.log('[API] Parameters saved successfully:', data);
      return data;
    } catch (error) {
      console.error('[API] Error saving parameters:', error);
      throw error;
    }
  },
}