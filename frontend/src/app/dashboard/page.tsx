"use client";

import { Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import TransactionsTable from "@/components/TransactionsTable";

function DashboardContent() {
  useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
      <TransactionsTable />
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