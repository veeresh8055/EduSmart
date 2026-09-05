import { checkOutSuccessApi, purchaseCourseApi } from '@/Api/purchase.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const usePayment = ()=>{
    return useMutation({
        mutationFn:purchaseCourseApi,
        onSuccess:(data)=>{
            if(data.url){
                window.location.href=data.url
            }
            // toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useCheckoutSuccess=()=>{
    return useMutation({
        mutationFn:(sessionId)=>checkOutSuccessApi(sessionId),
        onSuccess:(data)=>{
            toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}