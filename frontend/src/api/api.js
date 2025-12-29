import axios from 'axios'


const API = axios.create({ 
	baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
	withCredentials: true // Enable sending cookies with requests
})


// Add token from localStorage if cookies don't work (mobile fallback)
API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	console.log('🔍 API Request Interceptor:', {
		url: config.url,
		method: config.method,
		hasToken: !!token,
		tokenPreview: token ? `${token.substring(0, 20)}...` : 'NONE',
		withCredentials: config.withCredentials,
		userAgent: navigator.userAgent.substring(0, 50)
	})
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
		console.log('✅ Authorization header set')
	} else {
		console.warn('⚠️ NO TOKEN FOUND IN LOCALSTORAGE')
	}
	return config
})

// Store token from response if available
API.interceptors.response.use(
	(response) => {
		// If the response contains a token, store it
		if (response.data?.token) {
			localStorage.setItem('token', response.data.token)
			console.log('💾 Token stored from response')
		}
		return response
	},
	(error) => {
		console.error('❌ API Error:', {
			status: error.response?.status,
			message: error.response?.data?.message,
			url: error.config?.url,
			method: error.config?.method,
			hasAuthHeader: !!error.config?.headers?.Authorization
		})
		return Promise.reject(error)
	}
)

export default API