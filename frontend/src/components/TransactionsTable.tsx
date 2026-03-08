"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

export default function TransactionsTable() {
  const router = useRouter();
  const params = useSearchParams();

  const page = params.get("page") || "1";
  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page, status, search, fromDate, toDate],
    queryFn: async () => {
      const res = await api.get(
        `/transactions?page=${page}&status=${status}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`
      );
      return res.data.data;
    },
  });

  const changePage = (p: number) => {
    router.push(
      `/dashboard?page=${p}&status=${status}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`
    );
  };

 if (isLoading) {

  return (

    <div className="bg-white rounded-xl border p-6">

      <div className="animate-pulse space-y-4">

        {Array.from({length:8}).map((_,i)=>(

          <div
            key={i}
            className="h-10 bg-gray-200 rounded"
          />

        ))}

      </div>

    </div>

  )

}

  const transactions = data.transactions;

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          placeholder="Search transaction"
          className="border p-2"
          defaultValue={search}
          onBlur={(e) => {
            router.push(
              `/dashboard?page=1&search=${e.target.value}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`
            );
          }}
        />

        <input
          type="date"
          className="border p-2"
          defaultValue={fromDate}
          onChange={(e) => {
            router.push(
              `/dashboard?page=1&search=${search}&status=${status}&fromDate=${e.target.value}&toDate=${toDate}`
            );
          }}
        />

        <input
          type="date"
          className="border p-2"
          defaultValue={toDate}
          onChange={(e) => {
            router.push(
              `/dashboard?page=1&search=${search}&status=${status}&fromDate=${fromDate}&toDate=${e.target.value}`
            );
          }}
        />

        {/* ✅ Status filter */}
        <select
          className="border p-2"
          value={status}
          onChange={(e) => {
            router.push(
              `/dashboard?page=1&status=${e.target.value}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`
            );
          }}
        >
          <option value="">All Status</option>
          <option value="Successful">Successful</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Transactions table */}
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">

        <p className="text-sm text-gray-500">
          Page {page} of {data.pagination.pages}
        </p>

        <div className="flex items-center gap-2">

          {/* Previous Button */}

          <button
            disabled={Number(page) === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
            onClick={() => changePage(Number(page) - 1)}
          >
            Previous
          </button>

          {/* Page Numbers */}

          {Array.from({ length: data.pagination.pages }).map((_, i) => {
            const p = i + 1;

            return (
              <button
                key={p}
                className={`px-3 py-1 text-sm rounded-md border ${p === Number(page)
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                  }`}
                onClick={() => changePage(p)}
              >
                {p}
              </button>
            );
          })}

          {/* Next Button */}

          <button
            disabled={Number(page) === data.pagination.pages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
            onClick={() => changePage(Number(page) + 1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}