import { useState } from 'react';
import axios from 'axios';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        throw new Error('Refresh token tidak ditemukan');
      }

      // Update URL dengan path yang benar
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/token/refresh/`,
        data: { refresh }
      });

      if (response.data && response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        return response.data.access;
      } else {
        throw new Error('Format refresh token tidak valid');
      }
    } catch (error) {
      // Jika refresh token juga tidak valid, arahkan ke halaman login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw error;
    }
  };

  const callApi = async (method, url, data = null, retrying = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Debugging: tampilkan URL yang diakses
      console.log(`[API Call] ${method.toUpperCase()} ${url}`);
      
      // Cek apakah ada token
      const token = localStorage.getItem('accessToken');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios({
        method,
        url,
        data,
        headers
      });
      
      setLoading(false);
      return { data: response.data, success: true };
    } catch (err) {
      console.error(`[API Error] ${err.message}`);
      if (err.response) {
        console.error(`[API Response Status] ${err.response.status}`);
        console.error('[API Response Data]', err.response.data);
      }
      
      // Jika error 401 (Unauthorized) dan belum mencoba refresh token
      if (err.response && err.response.status === 401 && !retrying) {
        try {
          // Coba refresh token dan ulangi request
          await refreshToken();
          return callApi(method, url, data, true);
        } catch (refreshError) {
          setLoading(false);
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
          return { error: 'Sesi Anda telah berakhir', success: false };
        }
      }
      
      setLoading(false);
      
      let errorMessage = 'Terjadi kesalahan';
      
      if (err.response) {
        if (err.response.status === 400) {
          // Untuk validasi form, bisa mengembalikan detail error
          errorMessage = err.response.data || 'Data tidak valid';
          // Jika errorMessage adalah objek, biarkan sebagaimana adanya
          if (typeof errorMessage === 'object') {
            setError('Mohon periksa kembali data yang dimasukkan');
            return { error: errorMessage, success: false, validation: true };
          }
        } else if (err.response.status === 403) {
          errorMessage = 'Anda tidak memiliki izin untuk melakukan operasi ini';
        } else if (err.response.status === 404) {
          errorMessage = 'Endpoint tidak ditemukan. Periksa konfigurasi API URL.';
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