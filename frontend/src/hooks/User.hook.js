import { getUser, loginApi, logoutApi, registerApi } from "@/Api/user.api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useRegisterHook = ()=>{
    const navigate =  useNavigate()
    return useMutation({
        mutationFn:registerApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            navigate("/")
        },

        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useLoginHook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:loginApi,
        onSuccess:(data)=>{
            toast.success(data?.message)
            navigate('/')
        },

        onError:(err)=>{
            toast.error(err.response.data.message)
           
        }
    })
}

export const useGetUserHook = ()=>{
    return useQuery({
        queryFn:getUser,
        queryKey:['getUser'],
        retry:false
    })
}


export const useLoggedOut=()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:logoutApi,
        onSuccess:(data)=>{
            toast.success(data?.message)
            navigate('/login')
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}