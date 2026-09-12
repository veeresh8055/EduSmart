import api from './client'

export const registerApi = async(payload)=>{
    const res = await api.post('/register',
        payload,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
    )

    return res.data
}


export const loginApi = async(payload)=>{
    const res = await api.post('/login',
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )

    return res.data
}

export const getUser = async()=>{
    const res = await api.get('/getUser',
        
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )

    return res.data
}


export const logoutApi = async()=>{
    const res = await api.post('/logout',
        {},
         {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true
        }
    )
    return res.data
}
