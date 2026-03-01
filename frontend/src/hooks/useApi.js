import { useState, useCallback } from 'react';

// ==================== CUSTOM HOOK: USE API ====================
// Handles loading, error, and data states for API calls
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setLoading(false);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      // Get better error messages based on status code
      let errorMessage;
      
      if (err.response?.status === 409) {
        // Duplicate submission
        errorMessage = err.response?.data?.message || 'This email has already been submitted';
      } else if (err.response?.status === 429) {
        // Rate limit
        errorMessage = err.response?.data?.message || 'Too many requests. Please try again later';
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.details?.[0]?.message ||
          err.message ||
          'An error occurred';
      }

      setError(errorMessage);
      setLoading(false);

      if (onError) {
        onError(errorMessage);
      }

      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, request, clearError };
};

// ==================== CUSTOM HOOK: USE FORM ====================
// Manages form state and validation
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (err) {
        // Error handling is done in onSubmit
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setErrors,
    resetForm,
  };
};

// ==================== CUSTOM HOOK: USE LOCAL STORAGE ====================
// Manage localStorage with hooks
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useApi;
