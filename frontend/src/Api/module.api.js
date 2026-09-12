import api from './client'

export const createModuleApi = async(payload)=>{
    const res = await api.post('/module/createModule', payload)

    return res.data
}


export const getModuleApi = async(id)=>{
    const res = await api.get(`/module/getModule/${id}`)

    return res.data
}


export const getCommentApi  = async(id)=>{
    const res = await api.get(`/module/comment/${id}`)

    return res.data
}
