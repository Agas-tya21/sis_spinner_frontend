// app/customer/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react"; // [MODIFIKASI] Tambah useCallback
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Edit, Trash2, PlusCircle } from "lucide-react"; // [MODIFIKASI] Tambah PlusCircle
// Import API_BASE_URL dari file konfigurasi yang baru
import { API_BASE_URL } from "@/app/config/api"; 
// TAMBAHKAN: Import komponen Navbar
import Navbar from "@/app/components/Navbar"; 

// [BARU] Import komponen sidebar
import AddCustomerSidebar from "@/app/components/AddCustomerSidebar"; 


// Asumsi interface Customer (pastikan Anda memiliki file types/index.ts)
interface Customer {
  id: string; 
  nama: string;
  cabang: string;
  periode: string;
  namaNasabah: string;
  status: string;
  tanggalDibuat: string; 
}


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  // [BARU] State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // [MODIFIKASI] Pindahkan fetchCustomers ke useCallback untuk memoization
  const fetchCustomers = useCallback(async () => {
    // Set loading ke true saat fetch baru dimulai (termasuk refresh)
    // Tapi hanya reset error jika ini adalah fetch awal
    if(customers.length === 0) setError(null);
    setIsLoading(true); 

    const token = localStorage.getItem("token");

    if (!token) {
      // Jika tidak ada token, arahkan ke halaman login
      router.push("/login?redirect=/customers");
      // Set isLoading ke false agar tidak terjebak dalam loop loading
      setIsLoading(false); 
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Mengirimkan JWT token untuk autentikasi
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (response.status === 401) {
        // Token tidak valid/expired
        localStorage.removeItem("token");
        router.push("/login?redirect=/customers");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
      setError(null); // Clear error on success
    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, customers.length]); // Tambahkan router dan customers.length sebagai dependency

  // [MODIFIKASI] Gunakan fetchCustomers yang sudah di-memoize
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Gunakan fetchCustomers sebagai dependency

  // Fungsi untuk dipanggil setelah customer baru berhasil disimpan (callback dari sidebar)
  const handleSuccessSave = () => {
    fetchCustomers(); // Muat ulang data customer
  };
  
  // Fungsi untuk membuka sidebar
  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  }

  // Fungsi untuk menutup sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  }


  const getStatusBadge = (status: string) => {
    const baseStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status.toLowerCase()) {
      case 'aktif':
        return <span className={`${baseStyle} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>Aktif</span>;
      case 'menunggu':
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`}>Menunggu</span>;
      case 'nonaktif':
        return <span className={`${baseStyle} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`}>Nonaktif</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}>{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch {
        return dateString;
    }
  };

  // --- Render States ---
  
  // Tampilkan loading penuh jika data awal belum ada
  if (isLoading && customers.length === 0) { 
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error penuh jika data awal belum ada dan terjadi error
  if (error && customers.length === 0) { 
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-10 text-red-600 bg-red-50 p-6 rounded-lg border border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-300">
            <AlertCircle className="h-10 w-10" />
            <h2 className="text-xl font-bold mt-3">Gagal Memuat Data</h2>
            <p className="mt-1 text-sm text-center">Terjadi kesalahan saat mengambil data customer. Pastikan server backend berjalan.</p>
            <p className="text-xs italic mt-2">Detail Error: {error}</p>
          </div>
        </main>
      </div>
    );
  }
  
  const tableHeaders = ["Nama", "Cabang", "Periode", "Nama Nasabah", "Status", "Tanggal Dibuat", "Aksi"];

  return (
    // TAMBAHKAN: Wrapper utama untuk layout dan Navbar
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar /> 
      
      {/* Bungkus konten utama di dalam <main> dengan padding dan max-width */}
      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Daftar Customer</h1>
            {/* [MODIFIKASI] Ganti alert dengan membuka sidebar */}
            <button
              onClick={handleOpenSidebar}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Tambah Customer
            </button>
          </header>

          {/* Optional: Tampilkan error kecil jika error terjadi setelah load awal */}
          {error && customers.length > 0 && (
            <div className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 dark:border-red-800" role="alert">
                <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <span className="font-medium">Kesalahan Memuat Data:</span> {error} (Menampilkan data terakhir yang berhasil dimuat)
            </div>
          )}

          {customers.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg dark:border-gray-700">
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Tidak ada data customer yang ditemukan.</p>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Silakan gunakan tombol Tambah Customer untuk memulai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{customer.cabang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{customer.periode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{customer.namaNasabah}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(customer.tanggalDibuat)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => alert(`Edit customer ID: ${customer.id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => alert(`Hapus customer ID: ${customer.id}`)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Tampilkan indikator loading kecil di bawah tabel saat refresh */}
                  {isLoading && customers.length > 0 && (
                     <tr className="bg-gray-100 dark:bg-gray-700">
                        <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                            Memuat ulang data...
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* [BARU] Component Sidebar Popup */}
      <AddCustomerSidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onSuccessSave={handleSuccessSave}
      />

    </div>
  );
}