"use client"
import { Suspense } from "react";

import useAuth from "@/hooks/useAuth"
import TransactionsTable from "@/components/TransactionsTable"

export default function Dashboard(){

  useAuth()

  return(

    <div className="p-8">
 <Suspense fallback={<p>Loading...</p>}>

      <h1 className="text-2xl font-semibold mb-6">
        Transactions
      </h1>

      <TransactionsTable/>
 </Suspense>

    </div>
  )
}