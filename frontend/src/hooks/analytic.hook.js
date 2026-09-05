import { dailyDataApi, getDataApi } from '@/Api/Analytic.api'
import { useQuery }  from  '@tanstack/react-query'

export const useGetDataHook=()=>{
    return useQuery({
        queryFn:getDataApi,
        queryKey:['getData']
    })
}

export const useGetDailyData=(startDate,endDate)=>{
    return useQuery({
        queryFn:()=>dailyDataApi(startDate,endDate),
        queryKey:['dailyDataApi',startDate,endDate]
    })
}