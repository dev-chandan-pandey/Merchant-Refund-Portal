"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

export default function TransactionDetail({id}:any){

  const {data,isLoading} = useQuery({

    queryKey:["transaction",id],

    queryFn: async ()=>{

      const res = await api.get(`/transactions/${id}`)

      return res.data.data
    }

  })

  if(isLoading) return <p>Loading...</p>

  const t = data.transaction

  return(

    <div className="p-4 border rounded">

      <h2 className="text-lg font-semibold mb-3">
        Transaction Detail
      </h2>

      <p>ID: {t.transactionId}</p>
      <p>Amount: {t.amount}</p>
      <p>Status: {t.status}</p>

      <h3 className="mt-4 font-medium">Timeline</h3>

      <ul>

        {data.timeline.map((e:any)=>(

          <li key={e._id}>
            {e.status} – {new Date(e.timestamp).toLocaleString()}
          </li>

        ))}

      </ul>

      {data.refundEligible ? (
        <RefundForm transactionId={t._id}/>
      ) : (
        <p className="mt-3 text-red-500">
          {data.reason}
        </p>
      )}

    </div>
  )
}