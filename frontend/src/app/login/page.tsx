"use client"

import { useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  const login = async (e:any) => {

    e.preventDefault()

    setLoading(true)

    try {

      const res = await api.post("/auth/login",{
        email,
        password
      })

      localStorage.setItem("token",res.data.data.accessToken)

      router.push("/dashboard")

    } catch {

      alert("Invalid credentials")

    }

    setLoading(false)
  }

  return (

    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={login}
        className="w-[350px] p-6 border rounded-lg"
      >

        <h1 className="text-xl mb-4 font-semibold">
          Merchant Login
        </h1>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button
          className="w-full bg-black text-white p-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  )
}