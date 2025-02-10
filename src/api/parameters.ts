import { ParamsOption } from '@/types/params';
import { apiRequest } from '../lib/api';

export interface UpdateParamsRequest {
  params: Record<string, ParamsOption>;
}

export const getParams = () => {
  return apiRequest<Record<string, ParamsOption>>('/parameters');
};

export const updateParams = (requestData: UpdateParamsRequest) => {
  return apiRequest<void>('/parameters', {
    method: 'PUT',
    data: requestData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};