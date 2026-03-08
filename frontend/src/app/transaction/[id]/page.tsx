"use client";

import { Suspense, use } from "react";
import TransactionDetail from "@/components/TransactionDetail";

export default function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap with React.use()

  return (
    <Suspense fallback={<p>Loading transaction...</p>}>
      <TransactionDetail id={id} />
    </Suspense>
  );
}