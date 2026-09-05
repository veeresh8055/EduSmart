import { checkQuizApi, createQuiz, getQuizApi } from '@/Api/quiz.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateQuiz = ()=>{
    return useMutation({
        mutationFn:createQuiz,
        onSuccess:(data)=>{
            toast.success(data.message)
            console.log(data)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}


export const useGetQuiz = (id)=>{
    return useQuery({
        queryFn:()=>getQuizApi(id),
        queryKey:['getQuiz', id]

    })
}

export const useCheckQuiz =(id)=>{
    return useQuery({
        queryFn:()=>checkQuizApi(id),
        queryKey:['checkQuiz', id],
        enabled:!!id
    })
}