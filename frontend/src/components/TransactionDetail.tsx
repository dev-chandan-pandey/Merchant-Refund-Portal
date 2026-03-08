"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import RefundForm from "./RefundForm";
import { ArrowLeft, CreditCard, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransactionDetail({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const res = await api.get(`/transactions/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) return <DetailSkeleton />;

  const t = data.transaction;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      {/* Main Detail Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Transaction Summary</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            t.status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {t.status}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">Transaction ID</p>
              <p className="font-mono text-sm text-gray-900 mt-1">{t.transactionId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">Payment Method</p>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900 font-medium">Card •••• 4242</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">Amount</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ₹{t.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">Date & Time</p>
              <p className="text-sm text-gray-900 mt-1 font-medium">
                {new Date(t.transactionDate || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-md font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          Event Timeline
        </h3>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-100">
          {data.timeline.map((e: any, index: number) => (
            <div key={e._id} className="relative flex items-start ml-1">
              <div className={`absolute left-0 mt-1.5 h-3 w-3 rounded-full border-2 border-white ring-4 ring-white z-10 ${
                index === 0 ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
              <div className="ml-10">
                <p className={`text-sm font-semibold ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                  {e.status}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(e.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {data.refundEligible ? (
          <RefundForm transactionId={t._id} />
        ) : (
          <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Refund Unavailable</h4>
              <p className="text-sm text-red-600 mt-1">{data.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-100 rounded-2xl" />
      <div className="h-48 bg-gray-100 rounded-2xl" />
    </div>
  );
}