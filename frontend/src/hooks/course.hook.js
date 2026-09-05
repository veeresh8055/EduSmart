import { createCourseApi, getAllPurchaseCourseApi, getCourseApi, getPurchaseCourseApi, getSingleCourseApi } from '@/Api/course.api'
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useQueryClient } from 'node_modules/@tanstack/react-query/build/legacy'
export const useCreateCouseHook=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createCourseApi,
        onSuccess:()=>{
           queryClient.invalidateQueries(['getCourse'])
        },

        onError:(err)=>{
            console.log(err)
        }
    })
}


export const useGetCourseHook = (search)=>{
    return useQuery({
        queryFn:()=>getCourseApi(search),
        queryKey:['getCourse', search]
    })
}

export const useGetSingleCourseHook =(id)=>{
    return useQuery({
        queryFn:()=>getSingleCourseApi(id),
        queryKey:['getSingleCourse',id]

    })
}


export const useGetPurchaseCourse=(courseId)=>{
    return useQuery({
        queryFn:()=>getPurchaseCourseApi(courseId),
        queryKey:['getPurchaseCourse', courseId]
    })
}

export const useGetAllPurchaseCourse=()=>{
    return useQuery({
        queryFn:getAllPurchaseCourseApi,
        queryKey:['getAllPurchaseCourse']
    })
}