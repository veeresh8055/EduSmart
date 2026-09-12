import api from './client'

export const getQuizApi = async(id)=>{
    const res = await api.get(`/quiz/getQuiz/${id}`,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )
    return res.data
}

export const createQuiz = async(payload)=>{
    const res = await api.post('/quiz/generateQuiz',
        payload,
        {
             headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )
    return res.data
}


export const checkQuizApi = async(id)=>{
    const res = await api.get(`/quiz/checkQuiz/${id}`,
        {
           headers: { 'Content-Type': 'application/json' },
            withCredentials:true 
        }
    )
    return res.data
}
