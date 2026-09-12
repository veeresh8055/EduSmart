import api from './client'

export const purchaseCourseApi = async(payload)=>{
    const res = await api.post('/payment/checkout',
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )
    return res.data
}


export const checkOutSuccessApi = async(sessionId)=>{
    const res = await api.post('/payment/checkout-success',
        {sessionId},
        {
           headers: { 'Content-Type': 'application/json' },
            withCredentials:true  
        }
    )

    return res.data
}
