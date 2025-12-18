import axios from 'axios'


const API = axios.create({ 
\tbaseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
\twithCredentials: true // Enable sending cookies with requests
})


// No longer need to manually set Authorization header
// The httpOnly cookie will be sent automatically
API.interceptors.request.use((config) => {
\treturn config
})


export default API