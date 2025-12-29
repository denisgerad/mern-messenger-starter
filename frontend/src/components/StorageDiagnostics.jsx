import React, { useState, useEffect } from 'react'

/**
 * LocalStorage Diagnostic Component
 * Shows real-time localStorage status - helpful for debugging iOS issues
 * 
 * Usage: Add <StorageDiagnostics /> to Chat.jsx temporarily
 */
export default function StorageDiagnostics() {
	const [storage, setStorage] = useState({})
	const [isAvailable, setIsAvailable] = useState(false)

	useEffect(() => {
		const checkStorage = () => {
			try {
				// Test if localStorage is available
				localStorage.setItem('test', 'test')
				localStorage.removeItem('test')
				setIsAvailable(true)

				// Get all relevant items
				setStorage({
					token: localStorage.getItem('token'),
					user: localStorage.getItem('user'),
					tokenLength: localStorage.getItem('token')?.length || 0,
					timestamp: new Date().toLocaleTimeString()
				})
			} catch (e) {
				setIsAvailable(false)
				console.error('localStorage check failed:', e)
			}
		}

		checkStorage()
		// Check every 2 seconds
		const interval = setInterval(checkStorage, 2000)
		return () => clearInterval(interval)
	}, [])

	const forceRefresh = () => {
		const token = localStorage.getItem('token')
		const user = localStorage.getItem('user')
		setStorage({
			token,
			user,
			tokenLength: token?.length || 0,
			timestamp: new Date().toLocaleTimeString()
		})
	}

	const testStorage = () => {
		try {
			const testValue = `test_${Date.now()}`
			localStorage.setItem('diagnostic_test', testValue)
			const retrieved = localStorage.getItem('diagnostic_test')
			localStorage.removeItem('diagnostic_test')
			alert(`Storage Test: ${retrieved === testValue ? '✅ PASS' : '❌ FAIL'}`)
		} catch (e) {
			alert(`❌ Storage Error: ${e.message}`)
		}
	}

	return (
		<div style={{
			position: 'fixed',
			bottom: 10,
			right: 10,
			background: 'rgba(0,0,0,0.9)',
			color: 'white',
			padding: 12,
			borderRadius: 8,
			fontSize: 11,
			fontFamily: 'monospace',
			zIndex: 9999,
			maxWidth: 300,
			boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
		}}>
			<div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 12 }}>
				📊 Storage Diagnostics
			</div>
			
			<div style={{ marginBottom: 6 }}>
				<strong>Available:</strong> {isAvailable ? '✅' : '❌'}
			</div>
			
			<div style={{ marginBottom: 6 }}>
				<strong>Token:</strong> {storage.token ? `✅ (${storage.tokenLength} chars)` : '❌ MISSING'}
			</div>
			
			<div style={{ marginBottom: 6 }}>
				<strong>User:</strong> {storage.user ? '✅' : '❌'}
			</div>
			
			<div style={{ marginBottom: 8, opacity: 0.6 }}>
				Last check: {storage.timestamp}
			</div>

			<div style={{ display: 'flex', gap: 4 }}>
				<button 
					onClick={forceRefresh}
					style={{
						padding: '4px 8px',
						fontSize: 10,
						background: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: 4,
						cursor: 'pointer'
					}}
				>
					Refresh
				</button>
				<button 
					onClick={testStorage}
					style={{
						padding: '4px 8px',
						fontSize: 10,
						background: '#2196F3',
						color: 'white',
						border: 'none',
						borderRadius: 4,
						cursor: 'pointer'
					}}
				>
					Test Storage
				</button>
			</div>

			{!isAvailable && (
				<div style={{
					marginTop: 8,
					padding: 8,
					background: '#f44336',
					borderRadius: 4,
					fontSize: 10
				}}>
					⚠️ localStorage is blocked or unavailable!
				</div>
			)}

			{isAvailable && !storage.token && (
				<div style={{
					marginTop: 8,
					padding: 8,
					background: '#ff9800',
					borderRadius: 4,
					fontSize: 10
				}}>
					⚠️ No token in localStorage!
				</div>
			)}
		</div>
	)
}
