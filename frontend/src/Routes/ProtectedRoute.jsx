import { Spinner } from "@/components/ui/spinner"
import { useGetUserHook } from "@/hooks/User.hook"
import { useUserStore } from "@/Store/user.store"
import { useEffect } from "react"

import { Navigate } from "react-router-dom"

export const ProtectedRoutes =({children})=>{
    const setUser = useUserStore((state)=>state.setUser)
    const {data, isLoading, isError, error} = useGetUserHook()

    
    console.log(data)
    useEffect(()=>{
        if(data){
        setUser(data)
    }

    })
    if(isLoading){
        return (
             <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Loading ...</h1>
        </div>
      </div>
        )
    }

   if (isError || !data) {
    console.error("Auth error:", error)
    return <Navigate to="/login" replace />
  }

    return children
}