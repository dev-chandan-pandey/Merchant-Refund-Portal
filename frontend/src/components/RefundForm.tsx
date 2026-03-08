"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function RefundForm({ transactionId }: any) {

  const [amount,setAmount] = useState("")
  const [reason,setReason] = useState("")
  const [showConfirm,setShowConfirm] = useState(false)
  const [loading,setLoading] = useState(false)

  const submitRefund = async () => {

    setLoading(true)

    try {

      await api.post(`/refunds/${transactionId}`,{
        amount:Number(amount),
        reason
      })

      alert("Refund successful")

      location.reload()

    } catch(err:any) {

      alert(err?.response?.data?.message || "Refund failed")

    }

    setLoading(false)
    setShowConfirm(false)

  }

  return (

    <div className="mt-4">

      <h3 className="font-medium mb-2">Raise Refund</h3>

      <input
        placeholder="Amount"
        className="border p-2 mr-2 rounded"
        onChange={(e)=>setAmount(e.target.value)}
      />

      <input
        placeholder="Reason"
        className="border p-2 mr-2 rounded"
        onChange={(e)=>setReason(e.target.value)}
      />

      <button
        onClick={()=>setShowConfirm(true)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit Refund
      </button>

      {/* Confirmation Modal */}

      {showConfirm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg shadow-md w-[350px]">

            <h3 className="text-lg font-semibold mb-2">
              Confirm Refund
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to refund ₹{amount}?
            </p>

            <div className="flex justify-end gap-2">

              <button
                onClick={()=>setShowConfirm(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitRefund}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}