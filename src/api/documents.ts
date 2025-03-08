import axios from 'axios';
import { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const documentsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const uploadDocument = async (file: File, instructions?: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (instructions) {
      formData.append('instructions', instructions);
    }

    const response = await documentsApi.post<{ documentId: string }>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.documentId;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const processDocument = async (documentId: string): Promise<void> => {
  try {
    await documentsApi.post(`/documents/${documentId}/process`);
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