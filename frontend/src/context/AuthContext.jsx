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
	console.log('🔐 Login attempt...')
	const res = await API.post('/auth/login', { username, password })
	console.log('📥 Login response received:', JSON.stringify({
		hasToken: !!res.data.token,
		hasUser: !!res.data.user,
		tokenLength: res.data.token?.length || 0,
		responseKeys: Object.keys(res.data),
		responseDataPreview: JSON.stringify(res.data).substring(0, 100)
	}, null, 2))
	
	// Test localStorage availability
	try {
		localStorage.setItem('test', 'test')
		const testRead = localStorage.getItem('test')
		localStorage.removeItem('test')
		console.log('✅ localStorage is available:', testRead === 'test')
	} catch (e) {
		console.error('❌ localStorage test failed:', e.message)
	}
	
	// Token is now stored in httpOnly cookie, but also save to localStorage for mobile fallback
	if (res.data.token) {
		try {
			localStorage.setItem('token', res.data.token)
			const savedToken = localStorage.getItem('token')
			console.log('💾 Token save result:', JSON.stringify({
				saved: savedToken === res.data.token,
				savedLength: savedToken?.length || 0,
				expectedLength: res.data.token.length
			}, null, 2))
		} catch (e) {
			console.error('❌ Failed to save token:', e.message)
		}
	} else {
		console.error('❌ NO TOKEN IN LOGIN RESPONSE!', JSON.stringify({
			responseData: res.data,
			cookies: document.cookie,
			headers: Object.keys(res.headers || {})
		}, null, 2))
	}
	
	try {
		localStorage.setItem('user', JSON.stringify(res.data.user))
		const savedUser = localStorage.getItem('user')
		console.log('💾 User saved:', !!savedUser)
	} catch (e) {
		console.error('❌ Failed to save user:', e.message)
	}
	
	setUser(res.data.user)
	return res.data
}


const register = async ({ username, password, accessCode }) => {
	console.log('📝 Register attempt...')
	const res = await API.post('/auth/register', { username, password, accessCode })
	console.log('📥 Register response received:', JSON.stringify({
		hasToken: !!res.data.token,
		hasUser: !!res.data.user,
		responseKeys: Object.keys(res.data)
	}, null, 2))
	
	// Token is now stored in httpOnly cookie, but also save to localStorage for mobile fallback
	if (res.data.token) {
		try {
			localStorage.setItem('token', res.data.token)
			const savedToken = localStorage.getItem('token')
			console.log('💾 Token saved:', savedToken === res.data.token)
		} catch (e) {
			console.error('❌ Failed to save token:', e.message)
		}
	}
	
	try {
		localStorage.setItem('user', JSON.stringify(res.data.user))
		console.log('💾 User saved')
	} catch (e) {
		console.error('❌ Failed to save user:', e.message)
	}
	
	setUser(res.data.user)
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


return (
<AuthContext.Provider value={{ user, login, register, logout }}>
{children}
</AuthContext.Provider>
)
}