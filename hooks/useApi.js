// hooks/useApi.js
import { useState } from 'react';
import axios from 'axios';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (method, url, data = null, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        method,
        url,
        data,
        ...options
      });
      
      setLoading(false);
      return { data: response.data, success: true };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Terjadi kesalahan';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Email atau password salah';
        } else {
          errorMessage = err.response.data?.error || 
                         err.response.data?.detail || 
                         'Terjadi kesalahan pada server';
        }
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server';
      } else {
        errorMessage = err.message || 'Terjadi kesalahan';
      }
      
      setError(errorMessage);
      return { error: errorMessage, success: false };
    }
  };

  return { loading, error, callApi };
}