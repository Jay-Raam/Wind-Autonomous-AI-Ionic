/**
 * Error Handling Utilities
 */

import { ApiError } from '../types/index';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const parseApiError = (error: any): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error?.response?.data) {
    return {
      message: error.response.data.message || error.message || 'An error occurred',
      code: error.response.data.code || 'API_ERROR',
      statusCode: error.response.status || 500,
    };
  }

  if (error?.message) {
    return {
      message: error.message,
      code: 'NETWORK_ERROR',
      statusCode: 0,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
};

export const getErrorMessage = (error: any): string => {
  const parsedError = parseApiError(error);
  return parsedError.message;
};

export const isUnauthorizedError = (error: any): boolean => {
  const statusCode = error?.response?.status;
  return statusCode === 401 || error?.code === 'INVALID_TOKEN';
};
