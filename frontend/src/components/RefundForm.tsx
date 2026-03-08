"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function RefundForm({transactionId}:any){

  const [amount,setAmount] = useState("")
  const [reason,setReason] = useState("")

  const submit = async ()=>{

    await api.post(`/refunds/${transactionId}`,{
      amount:Number(amount),
      reason
    })

    alert("Refund created")

    location.reload()
  }

  return(

    <div className="mt-4">

      <h3 className="font-medium mb-2">
        Raise Refund
      </h3>

      <input
        placeholder="Amount"
        className="border p-2 mr-2"
        onChange={e=>setAmount(e.target.value)}
      />

      <input
        placeholder="Reason"
        className="border p-2 mr-2"
        onChange={e=>setReason(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-black text-white px-3 py-2"
      >
        Submit
      </button>

    </div>
  )
}