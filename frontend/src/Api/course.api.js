import api from './client'

export const createCourseApi=async(payload)=>{
    const res = await api.post('/course/createCourse', payload)
    return res.data
}



export const getCourseApi = async(search)=>{
    const res = await api.get('/course/getCourse', { params: search ? { search } : {} })

    return res.data
}


export const getSingleCourseApi =async(id)=>{
    const res=await api.get(`/course/getSingleCourse/${id}`)
    return res.data
}


export const getPurchaseCourseApi = async(courseId)=>{
    const res = await api.get(`/course/purchasedCourse/${courseId}`)

    return res.data
}

export const getAllPurchaseCourseApi = async()=>{
    const res = await api.get('/course/getAllCoursePurchase')

    return res.data
}
