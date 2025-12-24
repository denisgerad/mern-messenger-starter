import axios from 'axios'


const API = axios.create({ 
	baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
	withCredentials: true // Enable sending cookies with requests
})


// Add token from localStorage if cookies don't work (mobile fallback)
API.interceptors.request.use((config) => {
	try {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
			console.log('✅ Token added to request headers')
		} else {
			console.log('⚠️ No token found in localStorage')
		}
	} catch (err) {
		// iOS Safari in private mode may throw on localStorage access
		console.error('❌ localStorage access error:', err)
	}
	return config
}, (error) => {
	console.error('❌ Request interceptor error:', error)
	return Promise.reject(error)
})

// Store token from response if available
API.interceptors.response.use(
	(response) => {
		// If the response contains a token, store it
		try {
			if (response.data?.token) {
				localStorage.setItem('token', response.data.token)
				console.log('✅ Token stored in localStorage')
			}
		} catch (err) {
			// iOS Safari in private mode may throw on localStorage access
			console.error('❌ localStorage write error:', err)
		}
		return response
	},
	(error) => {
		console.error('❌ API Error:', {
			url: error.config?.url,
			method: error.config?.method,
			status: error.response?.status,
			message: error.response?.data?.message || error.message
		})
		return Promise.reject(error)
	}
)

export default API