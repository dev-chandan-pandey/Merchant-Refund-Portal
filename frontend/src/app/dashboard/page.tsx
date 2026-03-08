"use client";

import { Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import TransactionsTable from "@/components/TransactionsTable";

// Notice how much cleaner this is! No sidebar code here.
function DashboardContent() {
  useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your recent financial activity.
        </p>
      </div>

      <TransactionsTable />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading transactions...</p>
      </div>
    </div>
  );
}