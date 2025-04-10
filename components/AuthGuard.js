import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthGuard = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Fungsi untuk cek apakah user bisa mengakses halaman
    const checkAuth = () => {
      // Halaman login dan register tidak memerlukan autentikasi
      const publicPaths = ['/login', '/register'];
      const path = router.pathname;
      
      if (publicPaths.includes(path)) {
        setAuthorized(true);
        return;
      }
      
      try {
        // Cek apakah user sudah login
        const accessToken = localStorage.getItem('accessToken');
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!accessToken || !userData) {
          // User belum login, redirect ke login page
          setAuthorized(false);
          router.push('/login');
          return;
        }
        
        // Jika allowedRoles diset, cek apakah role user ada di allowedRoles
        if (allowedRoles && !allowedRoles.includes(userData.role)) {
          // User tidak memiliki akses ke halaman ini
          setAuthorized(false);
          
          // Redirect ke dashboard sesuai role
          if (userData.role === 'admin') {
            router.push('/admin-dashboard');
          } else {
            router.push('/siswa-dashboard');
          }
          return;
        }
        
        // User terautentikasi dan memiliki akses
        setAuthorized(true);
      } catch (error) {
        // Error parsing user data atau lainnya
        console.error('Auth error:', error);
        setAuthorized(false);
        router.push('/login');
      }
    };

    // Jalankan saat component mount atau route berubah
    checkAuth();

    // Listen for route changes to check auth
    const authCheck = () => checkAuth();
    router.events.on('routeChangeComplete', authCheck);

    // Cleanup the event listener
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router, allowedRoles]);

  // Menampilkan loading saat cek autentikasi
  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render children jika terautentikasi
  return <>{children}</>;
};

export default AuthGuard;