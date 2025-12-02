'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gunakan setTimeout agar update state tidak dianggap "synchronous"
    // Ini memindahkan eksekusi ke antrian berikutnya (event loop) untuk menghindari error cascading render
    const checkAuth = setTimeout(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        // Jika tidak ada token, arahkan ke login
        router.push('/login');
      } else {
        // Jika ada token, set state
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }, 0); // Delay 0ms cukup untuk memecah eksekusi synchronous

    // Membersihkan timeout jika komponen di-unmount sebelum pengecekan selesai
    return () => clearTimeout(checkAuth);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Memuat sistem...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar Sederhana */}
        <nav className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Sis Spinner Dashboard</h1>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  router.push('/login');
                }}
                className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Konten Utama */}
        <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Selamat Datang!</h2>
            <p className="mt-2 text-gray-600">
              Anda telah berhasil login. Ini adalah halaman utama sistem.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}