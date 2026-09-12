import api from './client'

export const getDataApi = async()=>{
    const res = await api.get('/analytic/getAnalytic',
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )
    return res.data
}


export const dailyDataApi = async(startDate, endDate)=>{
    const res = await api.get('/analytic/getDailyData',
        {
            params:{startDate, endDate},
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )

    return res.data
}
