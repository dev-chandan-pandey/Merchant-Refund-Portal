"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

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

  // Helper to handle URL updates without custom functions
  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); 
    router.push(`/dashboard?${newParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-96 w-full bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const { transactions, pagination } = data;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search by ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            defaultValue={search}
            onBlur={(e) => updateFilters("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Group */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              className="text-xs md:text-sm outline-none bg-transparent"
              defaultValue={fromDate}
              onChange={(e) => updateFilters("fromDate", e.target.value)}
            />
            <span className="text-gray-300">-</span>
            <input
              type="date"
              className="text-xs md:text-sm outline-none bg-transparent"
              defaultValue={toDate}
              onChange={(e) => updateFilters("toDate", e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={status}
            onChange={(e) => updateFilters("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t: any) => (
                <tr
                  key={t.transactionId}
                  className="group hover:bg-blue-50/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/transaction/${t.transactionId}`)}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{t.transactionId.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {/* Status Logic using inline Tailwind */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      t.status === 'Successful' ? 'bg-green-50 text-green-700 border-green-200' :
                      t.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                      t.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 text-sm">
                    {new Date(t.transactionDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold">{pagination.pages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={Number(page) === 1}
              onClick={() => updateFilters("page", String(Number(page) - 1))}
              className="p-2 border border-gray-300 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-100 transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              disabled={Number(page) === pagination.pages}
              onClick={() => updateFilters("page", String(Number(page) + 1))}
              className="p-2 border border-gray-300 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-100 transition-all shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}