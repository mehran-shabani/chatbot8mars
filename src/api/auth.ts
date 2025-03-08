import axios from 'axios';

import { User, AuthResponse, ApiError } from '../types';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';



const authApi = axios.create({

  baseURL: API_URL,

  withCredentials: true,

});



export const login = async (email: string, password: string): Promise<AuthResponse> => {

  try {

    const response = await authApi.post<AuthResponse>('/auth/login', { email, password });

    return response.data;

  } catch (error) {

    throw handleApiError(error);

  }

};



export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {

  try {

    const response = await authApi.post<AuthResponse>('/auth/register', { email, password, name });

    return response.data;

  } catch (error) {

    throw handleApiError(error);

  }

};



export const logout = async (): Promise<void> => {

  try {

    await authApi.post('/auth/logout');

  } catch (error) {

    throw handleApiError(error);

  }

};



const handleApiError = (error: unknown): ApiError => {

  if (axios.isAxiosError(error)) {

    return {

      message: error.response?.data?.message || 'An error occurred',

      code: error.response?.data?.code,

    };

  }

  return { message: 'An unexpected error occurred' };

};

