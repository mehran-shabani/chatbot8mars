import axios from 'axios';
import { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const chatApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const uploadPdf = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await chatApi.post<{ documentId: string }>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.documentId;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sendMessage = async (message: string, documentId?: string): Promise<string> => {
  try {
    const response = await chatApi.post<{ reply: string }>('/chat/message', {
      message,
      documentId,
    });

    return response.data.reply;
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