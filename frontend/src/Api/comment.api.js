import axios from "axios"

export const createComment=async({id, payload})=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/comment/createComment/${id}`,
        payload,
       {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        },
    )

    return res.data
}