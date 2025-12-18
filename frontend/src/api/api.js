import axios from 'axios'


const API = axios.create({ 
	baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
	withCredentials: true // Enable sending cookies with requests
})


// No longer need to manually set Authorization header
// The httpOnly cookie will be sent automatically
API.interceptors.request.use((config) => {
	return config
})


export default API