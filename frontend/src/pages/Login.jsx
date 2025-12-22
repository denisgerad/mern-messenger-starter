import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Login(){
const { login, register } = useContext(AuthContext)
const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isRegistering, setIsRegistering] = useState(false)
const navigate = useNavigate()


const handleLogin = async () => {
try{
await login({ username, password })
navigate('/chat')
}catch(err){
const message = err.response?.data?.message || 'Login failed'
alert(message)
}
}


const handleRegister = async () => {
if (!email) {
	alert('Email is required for registration')
	return
}

try{
await register({ username, email, password })
alert('Registration successful! Please check your email to verify your account.')
// Clear form
setUsername('')
setEmail('')
setPassword('')
setIsRegistering(false)
}catch(err){
alert(err.response?.data?.message || 'Register failed')
}
}


return (
<div className="login">
			<h1>💬 Messenger</h1>
			
			{!isRegistering ? (
				<>
<input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
					<div style={{ display: 'flex', gap: 12, width: '300px' }}>
<button onClick={handleLogin}>Login</button>
<button onClick={() => setIsRegistering(true)}>Register</button>
					</div>
				</>
			) : (
				<>
<input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
<input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
					<div style={{ display: 'flex', gap: 12, width: '300px' }}>
<button onClick={handleRegister}>Create Account</button>
<button onClick={() => setIsRegistering(false)}>Back to Login</button>
					</div>
				</>
			)}
</div>
)
}