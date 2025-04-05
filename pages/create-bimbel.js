// pages/create-bimbel.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useApi } from '../hooks/useApi';
import { ArrowLeft } from 'lucide-react';

export default function CreateBimbel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { callApi } = useApi();
  
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    kuota_awal: 0,
    deskripsi: '',
    harga: 0,
  });

  const [formError, setFormError] = useState({});

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role yang benar
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData || userData.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        setUser(userData);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Handle numeric values
    if (name === 'kuota_awal' || name === 'harga') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    }

    setFormData({ ...formData, [name]: processedValue });
    
    // Clear error for this field
    if (formError[name]) {
      setFormError({ ...formError, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nama.trim()) {
      errors.nama = 'Nama bimbel harus diisi';
    }
    
    if (!formData.lokasi.trim()) {
      errors.lokasi = 'Lokasi bimbel harus diisi';
    }
    
    if (formData.kuota_awal <= 0) {
      errors.kuota_awal = 'Kuota harus lebih dari 0';
    }
    
    if (formData.harga < 0) {
      errors.harga = 'Harga tidak boleh negatif';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await callApi('post', `${process.env.NEXT_PUBLIC_BIMBEL_API_URL}/bimbel/bimbels/`, formData);
      
      if (result.success) {
        router.push('/admin-dashboard');
      }
    } catch (error) {
      console.error("Error creating bimbel:", error);
      
      // Set API errors if there are any
      if (error.response && error.response.data) {
        setFormError(error.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Tambah Bimbel - BimbelKu</title>
      </Head>
      
      <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/admin-dashboard"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tambah Bimbel Baru</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama Bimbel
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formError.nama ? 'border-red-300' : ''
                      }`}
                    />
                    {formError.nama && (
                      <p className="mt-1 text-sm text-red-600">{formError.nama}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
                    Lokasi
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="lokasi"
                      id="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formError.lokasi ? 'border-red-300' : ''
                      }`}
                    />
                    {formError.lokasi && (
                      <p className="mt-1 text-sm text-red-600">{formError.lokasi}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="kuota_awal" className="block text-sm font-medium text-gray-700">
                    Kuota
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="kuota_awal"
                      id="kuota_awal"
                      min="1"
                      value={formData.kuota_awal}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formError.kuota_awal ? 'border-red-300' : ''
                      }`}
                    />
                    {formError.kuota_awal && (
                      <p className="mt-1 text-sm text-red-600">{formError.kuota_awal}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                    Harga (Rp)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="harga"
                      id="harga"
                      min="0"
                      value={formData.harga}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formError.harga ? 'border-red-300' : ''
                      }`}
                    />
                    {formError.harga && (
                      <p className="mt-1 text-sm text-red-600">{formError.harga}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                    Deskripsi
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      rows="3"
                      value={formData.deskripsi}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Deskripsikan bimbel Anda secara singkat. Informasi ini akan ditampilkan kepada siswa.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link 
                  href="/admin-dashboard"
                  className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}