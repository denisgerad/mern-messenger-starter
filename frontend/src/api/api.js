import axios from 'axios'


const API = axios.create({ 
	baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
	withCredentials: true // Enable sending cookies with requests
})


// Add token from localStorage if cookies don't work (mobile fallback)
API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Store token from response if available
API.interceptors.response.use(
	(response) => {
		// If the response contains a token, store it
		if (response.data?.token) {
			localStorage.setItem('token', response.data.token)
		}
		return response
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default API