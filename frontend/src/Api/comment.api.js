import api from './client'

export const createComment=async({id, payload})=>{
    const res = await api.post(`/comment/createComment/${id}`, payload)

    return res.data
}
