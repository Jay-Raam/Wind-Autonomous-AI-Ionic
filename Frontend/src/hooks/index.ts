/**
 * Custom Hooks
 * Reusable hooks for common functionality
 */

import { useEffect, useState } from 'react';
import { useAuthStore, useTaskStore, useSettingsStore, useUIStore } from '../store';
import { useHistory } from 'react-router-dom';
import { Task } from '../types/index';

/**
 * Hook to handle async operations with loading/error states
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as Error);
      setStatus('error');
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, data, error, isLoading: status === 'pending' };
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const tokens = useAuthStore((state: any) => state.tokens);
  return !!tokens?.accessToken;
};

/**
 * Hook for form input handling
 */
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues({ ...values, [field]: value });
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors({ ...errors, [field]: error });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    reset,
    setValues,
    setErrors,
  };
};

/**
 * Hook for polling task status
 */
export const usePollTask = (taskId: string | null, interval = 2000) => {
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    setIsPolling(true);
    let pollInterval: NodeJS.Timeout;

    const poll = async () => {
      try {
        const updatedTask = await getTaskById(taskId);
        setTask(updatedTask);

        // Stop polling if task is completed or failed
        if (updatedTask.status === 'completed' || updatedTask.status === 'failed') {
          setIsPolling(false);
          if (pollInterval) {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.warn('Poll error:', error);
      }
    };

    // Poll immediately
    poll();

    // Set up interval
    pollInterval = setInterval(poll, interval);

    return () => clearInterval(pollInterval);
  }, [taskId, interval]);

  return { task, isPolling };
};

/**
 * Hook for toast notifications
 */
export const useToast = () => {
  const { addToast } = useUIStore();

  return {
    success: (message: string, duration?: number) =>
      addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      addToast(message, 'error', duration),
    warning: (message: string, duration?: number) =>
      addToast(message, 'warning', duration),
    info: (message: string, duration?: number) =>
      addToast(message, 'info', duration),
  };
};

/**
 * Hook to prevent unauthorized access
 */
export const useAuthGuard = () => {
  const history = useHistory();
  const isAuthenticated = useIsAuthenticated();
  const isInitialized = useAuthStore((state: any) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      history.replace('/login');
    }
  }, [isInitialized, isAuthenticated, history]);

  return isInitialized && isAuthenticated;
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  const user = useAuthStore((state: any) => state.user);
  return user;
};
