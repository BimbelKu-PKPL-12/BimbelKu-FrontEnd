import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
  // Cek apakah user sudah login
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');
    
    if (userData && accessToken) {
      // Verifikasi token dulu
      const verifyToken = async () => {
        try {
          // Panggil endpoint profile untuk verifikasi token
          const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/profile/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            // Token valid, redirect ke dashboard sesuai role
            if (userData.role === 'admin') {
              router.push('/admin-dashboard');
            } else {
              router.push('/siswa-dashboard');
            }
          } else {
            // Token tidak valid, hapus dan redirect ke login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/login');
          }
        } catch (error) {
          router.push('/login');
        }
      };
      
      verifyToken();
    } else {
      // User belum login, redirect ke halaman login
      router.push('/login');
    }
  } catch (error) {
    // Error parsing user data, redirect ke login
    router.push('/login');
  }
}, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Head>
        <title>BimbelKu - Aplikasi Bimbingan Belajar</title>
      </Head>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}