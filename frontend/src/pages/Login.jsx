import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Login(){
const { login, register } = useContext(AuthContext)
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
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
await register({ username, password })
navigate('/chat')
}catch(err){
alert(err.response?.data?.message || 'Register failed')
}
}


return (
<div className="login">
<input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
<input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<div>
<button onClick={handleLogin}>Login</button>
<button onClick={handleRegister}>Register</button>
</div>
</div>
)
}