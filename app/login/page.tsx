"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/app/config/api"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // PERBAIKAN: Mengganti 'email' menjadi 'username' agar sesuai dengan LoginRequest.java di backend
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        // Asumsi API mengembalikan pesan error
        const errorData = await response.json();
        // Menangani kasus jika backend melempar RuntimeException yang tidak mengembalikan JSON body
        const errorMessage = (errorData && errorData.message) ? errorData.message : "Email atau password salah. Pastikan server berjalan.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Simpan token ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // Arahkan ke halaman /customer setelah login berhasil
        router.push("/customer"); 
      } else {
        throw new Error("Login berhasil, namun token tidak ditemukan.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 dark:shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Akses dashboard manajemen customer
          </p>
        </div>

        {error && (
          <div className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 dark:border-red-800" role="alert">
            <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
            <span className="font-medium">Kesalahan:</span> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alamat Email / Username
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="text" // Mengganti ke type="text" lebih fleksibel untuk username
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}