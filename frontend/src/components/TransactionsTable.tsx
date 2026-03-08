"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useSearchParams, useRouter } from "next/navigation"

export default function TransactionsTable() {

  const router = useRouter()
  const params = useSearchParams()

  const page = params.get("page") || "1"
  const status = params.get("status") || ""
  const search = params.get("search") || ""

  const { data, isLoading } = useQuery({

    queryKey: ["transactions", page, status, search],

    queryFn: async () => {

      const res = await api.get(
        `/transactions?page=${page}&status=${status}&search=${search}`
      )

      return res.data.data
    }

  })

  const changePage = (p: number) => {

    router.push(`/dashboard?page=${p}&status=${status}&search=${search}`)
  }

  if (isLoading) return <p>Loading...</p>

  const transactions = data.transactions

  return (

    <div>

      <div className="mb-4 flex gap-2">

        <input
          placeholder="Search transaction"
          className="border p-2"
          defaultValue={search}
          onBlur={(e) => {
            router.push(`/dashboard?page=1&search=${e.target.value}`)
          }}
        />

      </div>

      <table className="w-full border">

        <thead>

          <tr className="border-b">

            <th className="p-2">Transaction ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((t: any) => (

            <tr
              key={t.transactionId}
              className="border-b cursor-pointer"
              onClick={() => router.push(`/transaction/${t.transactionId}`)}
            >

              <td className="p-2">{t.transactionId}</td>
              <td className="p-2">{t.amount}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">
                {new Date(t.transactionDate).toLocaleDateString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="flex gap-2 mt-4">

        {Array.from({ length: data.pagination.pages }).map((_, i) => {

          const p = i + 1

          return (

            <button
              key={p}
              className="border px-3 py-1"
              onClick={() => changePage(p)}
            >
              {p}
            </button>

          )

        })}

      </div>

    </div>

  )
}