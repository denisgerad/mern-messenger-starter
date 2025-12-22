import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Login(){
const { login, register } = useContext(AuthContext)
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [accessCode, setAccessCode] = useState('')
const [isRegistering, setIsRegistering] = useState(false)
const navigate = useNavigate()


const handleLogin = async () => {
try{
await login({ username, password })
navigate('/chat')
}catch(err){
alert(err.response?.data?.message || 'Login failed')
}
}


const handleRegister = async () => {
try{
await register({ username, password, accessCode })
navigate('/chat')
}catch(err){
alert(err.response?.data?.message || 'Register failed')
}
}


return (
<div className="login">
			<h1>💬 Messenger</h1>
			<p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
				Demo MERN Stack App
			</p>
			
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
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<input 
						placeholder="Access Code (required)" 
						value={accessCode} 
						onChange={e=>setAccessCode(e.target.value)}
						style={{ borderColor: '#ff9800' }}
					/>
					<p style={{ fontSize: '11px', color: '#ff9800', margin: '5px 0' }}>
						⚠️ Access code required for demo registration
					</p>
					<div style={{ display: 'flex', gap: 12, width: '300px' }}>
<button onClick={handleRegister}>Create Account</button>
<button onClick={() => setIsRegistering(false)}>Back to Login</button>
					</div>
				</>
			)}
</div>
)
}