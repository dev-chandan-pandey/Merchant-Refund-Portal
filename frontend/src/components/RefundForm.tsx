"use client";

import { useState } from "react";
import api from "@/lib/api";
import { AlertCircle, CheckCircle2, Loader2, IndianRupee } from "lucide-react";

export default function RefundForm({ transactionId }: { transactionId: string }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const submitRefund = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await api.post(`/refunds/${transactionId}`, {
        amount: Number(amount),
        reason,
      });

      setMessage({ type: "success", text: "Refund processed successfully!" });
      
      // Delay reload to let user see success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setMessage({ 
        type: "error", 
        text: err?.response?.data?.message || "Refund failed. Please try again." 
      });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Raise Refund</h3>
        <p className="text-sm text-gray-500 mb-4">Specify the amount and reason for this refund request.</p>

        {/* Feedback Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="text-sm">₹</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Refund</label>
            <input
              placeholder="e.g., Customer request, Duplicate payment"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={!amount || !reason || loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Review Refund
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => !loading && setShowConfirm(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Refund</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                You are about to refund <span className="font-semibold text-gray-900">₹{amount}</span> for this transaction. This action is irreversible.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-2">
              <button
                onClick={submitRefund}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : "Confirm Refund"}
              </button>
              
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}