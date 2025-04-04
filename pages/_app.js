import '../styles/globals.css';
import { useRouter } from 'next/router';
import AuthGuard from '../components/AuthGuard';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Konfigurasi role yang dibutuhkan untuk tiap halaman
  const roleConfig = {
    '/admin-dashboard': ['admin'],
    '/siswa-dashboard': ['siswa'],
  };
  
  // Ambil role yang dibutuhkan untuk halaman saat ini
  const requiredRoles = roleConfig[router.pathname] || null;

  return (
    <ErrorBoundary>
      {requiredRoles ? (
        <AuthGuard allowedRoles={requiredRoles}>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </ErrorBoundary>
  );
}

export default MyApp;