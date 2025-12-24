import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import Avatar from '../components/Avatar'


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'


export default function Chat(){
const { user, logout } = useContext(AuthContext)
const navigate = useNavigate()
const [socket, setSocket] = useState(null)
const [activeConversation, setActiveConversation] = useState(null)
const [onlineUsers, setOnlineUsers] = useState([])
const [socketStatus, setSocketStatus] = useState('disconnected')
const [showDebug, setShowDebug] = useState(false)


useEffect(()=>{
if (!user) return
		const s = io(SOCKET_URL, {
			transports: ['websocket', 'polling'],
			upgrade: true,
			rememberUpgrade: true,
			timeout: 10000
		})
		setSocket(s)
		s.on('connect', ()=>{
			console.log('✅ Socket connected:', s.id)
			setSocketStatus('connected')
			s.emit('user:online', { id: user.id, username: user.username })
			console.log('📤 Emitted user:online', { id: user.id, username: user.username })
		})
		s.on('receive:message', (msg)=>{
			// handle incoming
			console.log('📨 incoming msg', msg)
			// if the incoming message is for this user, open the conversation with the sender
			if (msg.receiver === user.id) {
				setActiveConversation(prev => (prev === msg.sender ? prev : msg.sender))
			}
		})
		s.on('online:users', (list) => {
			console.log('👥 Online users updated:', list)
			setOnlineUsers(list || [])
		})
		s.on('connect_error', (error) => {
			console.error('❌ Socket connection error:', error)
			setSocketStatus('error: ' + error.message)
		})
		s.on('disconnect', (reason) => {
			console.log('🔌 Socket disconnected:', reason)
			setSocketStatus('disconnected: ' + reason)
		})
		s.on('reconnect_attempt', () => {
			console.log('🔄 Attempting to reconnect...')
			setSocketStatus('reconnecting...')
		})
		return ()=> s.disconnect()
	}, [user])

	// Find the other user's info
	const otherUser = onlineUsers.find(u => (u?.id || u) === activeConversation) || null
	const otherUserData = otherUser ? {
		username: otherUser?.username || activeConversation,
		online: true
	} : { username: activeConversation, online: false }


if (!user) return <div>Please login</div>


return (
<div className={`chat-page ${activeConversation ? 'conversation-open' : ''}`}>
			{/* Debug Panel - Triple tap to toggle */}
			<div 
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					padding: '4px 8px',
					background: socketStatus.includes('connected') ? '#00a884' : '#d32f2f',
					color: 'white',
					fontSize: '10px',
					zIndex: 9999,
					cursor: 'pointer',
					borderBottomLeftRadius: '4px'
				}}
				onClick={() => setShowDebug(!showDebug)}
			>
				{socketStatus}
			</div>
			
			{showDebug && (
				<div style={{
					position: 'fixed',
					top: 30,
					right: 0,
					left: 0,
					background: 'rgba(0,0,0,0.95)',
					color: '#00ff00',
					padding: '12px',
					fontFamily: 'monospace',
					fontSize: '11px',
					zIndex: 9998,
					maxHeight: '200px',
					overflow: 'auto',
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-all'
				}}>
					<div>🔌 Socket: {socket?.id || 'null'}</div>
					<div>👤 User: {user?.username} ({user?.id})</div>
					<div>🌐 URL: {SOCKET_URL}</div>
					<div>💬 Active Conv: {activeConversation || 'none'}</div>
					<div>👥 Online: {onlineUsers.length} users</div>
					<div style={{marginTop: 8}}>Online IDs:</div>
					{onlineUsers.map(u => (
						<div key={u?.id || u}> - {u?.username || 'N/A'} ({u?.id || u})</div>
					))}
					<div style={{marginTop: 8, color: '#ff9800'}}>📱 Tap header to close</div>
				</div>
			)}
			
			<aside className="sidebar">
				<div className="sidebar-header">
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Avatar name={user.username} size={40} />
						<h3 style={{ margin: 0 }}>{user.username}</h3>
					</div>
					<button className="logout-button" onClick={async () => { await logout(); navigate('/'); }}>Logout</button>
				</div>
				<ChatList onSelect={setActiveConversation} onlineUsers={onlineUsers} selectedUser={activeConversation} currentUserId={user.id} />
</aside>
			<main className="main-chat">
				<ChatWindow 
					socket={socket} 
					conversationId={activeConversation} 
					user={user} 
					otherUser={otherUserData}
					onBack={() => setActiveConversation(null)}
				/>
</main>
</div>
)
}