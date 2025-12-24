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
		// Token is now stored in httpOnly cookie, but also save to localStorage for mobile fallback
		if (res.data.token) {
			localStorage.setItem('token', res.data.token)
		}
return res.data
}


const register = async ({ username, password, accessCode }) => {
const res = await API.post('/auth/register', { username, password, accessCode })
		// Token is now stored in httpOnly cookie, but also save to localStorage for mobile fallback
		if (res.data.token) {
			localStorage.setItem('token', res.data.token)
		}
return res.data
}


const logout = async () => {
	// Call backend to clear the httpOnly cookie
	try {
		await API.post('/auth/logout')
	} catch (err) {
		console.error('Logout error:', err)
	}
	localStorage.removeItem('user')
	localStorage.removeItem('token')
	setUser(null)
}