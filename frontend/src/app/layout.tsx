"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, ReceiptText, User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
 useAuth();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased text-gray-900">
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen">
            
            {/* 1. SIDEBAR - Fixed positioning */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full z-30">
              <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm">T</div>
                  Transactify
                </div>
              </div>
              
              <nav className="flex-1 px-4 space-y-1">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <ReceiptText className="h-4 w-4" /> Transactions
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <User className="h-4 w-4" /> Profile
                </button>
              </nav>

              {/* <div className="p-4 border-t border-gray-100">
                <button  onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut  className="h-4 w-4" /> Logout
                </button>
              </div> */}
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            {/* We use lg:ml-64 to push the content to the right so it doesn't hide behind the sidebar */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
              
              {/* Top Header */}
              <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
                <div className="text-sm text-gray-400">Overview</div>
                <div className="p-4 border-t border-gray-100">
                <button  onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut  className="h-4 w-4" /> Logout
                </button>
              </div>
                <div className="flex items-center gap-4">
                  <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </header>

              {/* This is where your Dashboard Page or Transaction Detail Page renders */}
              <main className="p-4 lg:p-8">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
              </main>

            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}