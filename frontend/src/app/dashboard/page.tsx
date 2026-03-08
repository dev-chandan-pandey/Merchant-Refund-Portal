"use client"

import useAuth from "@/hooks/useAuth"
import TransactionsTable from "@/components/TransactionsTable"

export default function Dashboard(){

  useAuth()

  return(

    <div className="p-8">

      <h1 className="text-2xl font-semibold mb-6">
        Transactions
      </h1>

      <TransactionsTable/>

    </div>
  )
}