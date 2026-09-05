import { createComment } from '@/Api/comment.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useCreateComment=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createComment,
        onSuccess:(data)=>{
            queryClient.invalidateQueries(['getComment'])
            toast.success(data.message)
        },

        onError:(err)=>{
            console.log(err)
        }
    })
}