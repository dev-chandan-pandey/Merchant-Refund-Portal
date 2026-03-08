"use client"

import { useParams } from "next/navigation"
import TransactionDetail from "@/components/TransactionDetail"

export default function Page(){

  const {id} = useParams()

  return(

    <div className="p-8">

      <TransactionDetail id={id}/>

    </div>

  )
}