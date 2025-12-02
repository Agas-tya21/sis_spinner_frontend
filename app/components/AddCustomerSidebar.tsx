// app/components/AddCustomerSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, PlusCircle, AlertCircle } from "lucide-react";
// Import API_BASE_URL dari file konfigurasi
import { API_BASE_URL } from "@/app/config/api"; 
// Import interface Customer (dari file types/index.ts yang telah diunggah)
import { Customer } from "@/app/types"; 

// Tipe data untuk form input (sama dengan Customer, tapi tanpa ID dan tanggal)
interface NewCustomerData {
  nama: string;
  cabang: string;
  periode: string;
  namaNasabah: string;
  status: string;
}

interface AddCustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSave: () => void; // Callback untuk memuat ulang data di parent
}

const initialFormState: NewCustomerData = {
  nama: "",
  cabang: "",
  periode: "",
  namaNasabah: "",
  status: "Menunggu", // Default status
};

export default function AddCustomerSidebar({
  isOpen,
  onClose,
  onSuccessSave,
}: AddCustomerSidebarProps) {
  const [formData, setFormData] = useState<NewCustomerData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form saat sidebar dibuka
  useEffect(() => {
    if (isOpen) {
        setFormData(initialFormState);
        setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
        setError("Autentikasi diperlukan. Silakan login kembali.");
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Mengirimkan JWT token untuk autentikasi
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            let errorMessage = `Gagal menyimpan data: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                // Abaikan jika respons bukan JSON
            }
            throw new Error(errorMessage);
        }

        // Sukses
        onSuccessSave(); // Muat ulang data customer di halaman utama
        onClose(); // Tutup sidebar

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Terjadi kesalahan yang tidak diketahui saat menyimpan data.");
        }
    } finally {
        setIsLoading(false);
    }
  };


  return (
    // Backdrop Overlay
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      // Gunakan pointerEvents untuk memastikan klik backdrop bekerja hanya saat sidebar terbuka
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
        {/* Semi-transparent background, menutup sidebar saat diklik */}
        <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={isLoading ? undefined : onClose} // Tidak bisa ditutup saat loading
        ></div>

        {/* Sidebar Panel */}
        <div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <PlusCircle size={20} className="text-blue-500" />
                    Tambah Customer Baru
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="flex flex-col h-[calc(100%-65px)]">
                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-start p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 dark:border-red-800">
                            <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3 mt-0.5" />
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}
                    
                    {/* Input Nama Customer */}
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama Customer <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nama"
                            name="nama"
                            type="text"
                            required
                            value={formData.nama}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Input Cabang */}
                    <div>
                        <label htmlFor="cabang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cabang <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="cabang"
                            name="cabang"
                            type="text"
                            required
                            value={formData.cabang}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Input Periode */}
                    <div>
                        <label htmlFor="periode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Periode <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="periode"
                            name="periode"
                            type="text"
                            required
                            value={formData.periode}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Input Nama Nasabah */}
                    <div>
                        <label htmlFor="namaNasabah" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama Nasabah <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="namaNasabah"
                            name="namaNasabah"
                            type="text"
                            required
                            value={formData.namaNasabah}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Dropdown Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="Menunggu">Menunggu</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Nonaktif">Nonaktif</option>
                        </select>
                    </div>
                </div>

                {/* Footer / Action Buttons */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Customer
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}