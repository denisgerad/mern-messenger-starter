import React, { createContext, useState, useEffect } from 'react'
import API from '../api/api'


export const AuthContext = createContext()


export function AuthProvider({ children }){
const [user, setUser] = useState(null)


useEffect(()=>{
const raw = localStorage.getItem('user')
if (raw) setUser(JSON.parse(raw))
}, [])


const login = async ({ username, password }) => {
const res = await API.post('/auth/login', { username, password })
localStorage.setItem('token', res.data.token)
localStorage.setItem('user', JSON.stringify(res.data.user))
setUser(res.data.user)
return res.data
}


const register = async ({ username, password }) => {
const res = await API.post('/auth/register', { username, password })
localStorage.setItem('token', res.data.token)
localStorage.setItem('user', JSON.stringify(res.data.user))
setUser(res.data.user)
return res.data
}


const logout = () => {
localStorage.removeItem('token')
localStorage.removeItem('user')
setUser(null)
}


return (
<AuthContext.Provider value={{ user, login, register, logout }}>
{children}
</AuthContext.Provider>
)
}