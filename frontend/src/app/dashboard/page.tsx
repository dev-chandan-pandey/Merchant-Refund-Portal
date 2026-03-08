"use client";

import { Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import TransactionsTable from "@/components/TransactionsTable";
import { useRouter } from "next/navigation";

function DashboardContent() {
  useAuth();
const router = useRouter()

  const logout = () => {

    localStorage.removeItem("token")

    router.push("/login")

  }
  return (
    <div className="p-8">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Transactions
        </h1>

        <button
          onClick={logout}
          className="border px-3 py-1"
        >
          Logout
        </button>

      </div>

      <TransactionsTable/>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}