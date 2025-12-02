"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // PERBAIKAN: Gunakan useEffect dengan pengecekan kondisi untuk menghindari re-render berlebih
  useEffect(() => {
    // Cek token di localStorage
    const token = localStorage.getItem("token");
    const userIsLoggedIn = !!token;

    // Hanya update state jika status login berbeda dengan state saat ini
    if (userIsLoggedIn !== isLoggedIn) {
      setIsLoggedIn(userIsLoggedIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array kosong agar hanya berjalan sekali saat mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login"); // Asumsi ada halaman login
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Customers", href: "/customers" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-[var(--background)] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              {/* Placeholder Logo Icon */}
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">SisSpinner</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive(link.href)
                    ? "border-blue-500 text-[var(--foreground)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-4 ml-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-[var(--background)] border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}