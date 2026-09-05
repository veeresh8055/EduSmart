import axios from "axios"

export const createCourseApi=async(payload)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/createCourse`,
        payload,
        {
            headers:{'Content-Type':'multipart/form-data'},
            withCredentials:true
        },
        
    )
    return res.data
}



export const getCourseApi = async(search)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getCourse`,
        {
            params:search?{search}:{},
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}


export const getSingleCourseApi =async(id)=>{
    const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getSingleCourse/${id}`,
         {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}


export const getPurchaseCourseApi = async(courseId)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/purchasedCourse/${courseId}`,
        {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}

export const getAllPurchaseCourseApi = async()=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getAllCoursePurchase`,
        {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}