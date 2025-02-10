import { apiRequest } from '../lib/api';
import { ParamsOption, UserParameters } from '@/types/params';

export interface UpdateParamsRequest {
  params: Record<string, ParamsOption>;
}

export const getParams = () => {
  return apiRequest<Record<string, ParamsOption>>('/parameters');
};

export const getUserParameters = () => {
  return apiRequest<UserParameters>('/parameters/user');
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

export const saveUserParameters = (requestData: UpdateParamsRequest) => {
  return apiRequest<void>('/parameters/user', {
    method: 'PUT',
    data: requestData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};