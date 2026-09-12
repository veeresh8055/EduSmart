import { checkQuizApi, createQuiz, getQuizApi } from '@/Api/quiz.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateQuiz = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createQuiz,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['checkQuiz'] })
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
