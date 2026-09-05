import axios from "axios"

export const getQuizApi = async(id)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/quiz/getQuiz/${id}`,
        {
            headers:'Application/json',
            withCredentials:true
        }
    )
    return res.data
}

export const createQuiz = async(payload)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/quiz/generateQuiz`,
        payload,
        {
             headers:'Application/json',
            withCredentials:true
        }
    )
    return res.data
}


export const checkQuizApi = async(id)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/quiz/checkQuiz/${id}`,
        {
           headers:'Application/json',
            withCredentials:true 
        }
    )
    return res.data
}
