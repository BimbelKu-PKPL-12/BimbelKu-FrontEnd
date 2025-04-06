import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useApi } from '../hooks/useApi';
import { PlusCircle, Edit, Trash2, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bimbels, setBimbels] = useState([]);
  const [loadingBimbels, setLoadingBimbels] = useState(false);
  const { callApi } = useApi();

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
        fetchBimbels();
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchBimbels = async () => {
    setLoadingBimbels(true);
    try {
      const result = await callApi('get', `${process.env.NEXT_PUBLIC_BIMBEL_API_URL}/bimbel/bimbels/my_bimbels/`);
      if (result.success) {
        setBimbels(result.data);
      }
    } catch (error) {
      console.error("Error fetching bimbels:", error);
    } finally {
      setLoadingBimbels(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleDeleteBimbel = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bimbel ini?')) {
      try {
        const result = await callApi('delete', `${process.env.NEXT_PUBLIC_BIMBEL_API_URL}/bimbel/bimbels/${id}/`);
        if (result.success) {
          fetchBimbels();
        }
      } catch (error) {
        console.error("Error deleting bimbel:", error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard - BimbelKu</title>
      </Head>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Bimbel Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Daftar Bimbel Saya</h2>
            <Link 
              href="/create-bimbel"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Bimbel
            </Link>
          </div>

          {loadingBimbels ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : bimbels.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Anda belum memiliki bimbel. Klik &quot;Tambah Bimbel&quot; untuk membuat bimbel pertama Anda.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {bimbels.map((bimbel) => (
                  <li key={bimbel.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-purple-600 truncate">{bimbel.nama}</p>
                          <p className="text-sm text-gray-500">{bimbel.lokasi}</p>
                        </div>
                        <div className="flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bimbel.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {bimbel.is_approved ? 'Disetujui' : 'Menunggu Persetujuan'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Kuota: {bimbel.sisa_kuota}/{bimbel.kuota_awal}
                          </p>
                          <p className="mt-2 sm:mt-0 sm:ml-6 flex items-center text-sm text-gray-500">
                            <span className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400">Rp</span>
                            {new Intl.NumberFormat('id-ID').format(bimbel.harga)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            href={`/edit-bimbel/${bimbel.id}`}
                            className="inline-flex items-center p-2 border border-transparent rounded-md text-sm text-purple-600 hover:bg-purple-100"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteBimbel(bimbel.id)}
                            className="inline-flex items-center p-2 border border-transparent rounded-md text-sm text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}