import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function VerifyEmail() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [status, setStatus] = useState('verifying') // verifying, success, error
	const [message, setMessage] = useState('Verifying your email...')
	
	useEffect(() => {
		const token = searchParams.get('token')
		
		if (!token) {
			setStatus('error')
			setMessage('Invalid verification link')
			return
		}
		
		const verifyEmail = async () => {
			try {
				const response = await axios.get(`${API}/api/auth/verify-email?token=${token}`)
				setStatus('success')
				setMessage(response.data.message || 'Email verified successfully!')
				
				// Redirect to login after 3 seconds
				setTimeout(() => {
					navigate('/')
				}, 3000)
			} catch (err) {
				setStatus('error')
				setMessage(err.response?.data?.message || 'Verification failed')
			}
		}
		
		verifyEmail()
	}, [searchParams, navigate])
	
	return (
		<div className="login" style={{ textAlign: 'center' }}>
			<h1>📧 Email Verification</h1>
			
			{status === 'verifying' && (
				<div>
					<p>{message}</p>
					<div style={{ fontSize: '40px', marginTop: '20px' }}>⏳</div>
				</div>
			)}
			
			{status === 'success' && (
				<div>
					<div style={{ fontSize: '60px', color: '#4CAF50' }}>✅</div>
					<p style={{ color: '#4CAF50', marginTop: '20px' }}>{message}</p>
					<p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
						Redirecting to login...
					</p>
				</div>
			)}
			
			{status === 'error' && (
				<div>
					<div style={{ fontSize: '60px', color: '#f44336' }}>❌</div>
					<p style={{ color: '#f44336', marginTop: '20px' }}>{message}</p>
					<Link to="/" style={{ 
						display: 'inline-block',
						marginTop: '20px',
						color: '#007bff',
						textDecoration: 'none'
					}}>
						Back to Login
					</Link>
				</div>
			)}
		</div>
	)
}
