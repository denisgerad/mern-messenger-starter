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


useEffect(()=>{
if (!user) return
const s = io(SOCKET_URL)
setSocket(s)
		s.on('connect', ()=>{
			s.emit('user:online', { id: user.id, username: user.username })
		})
		s.on('receive:message', (msg)=>{
			// handle incoming
			console.log('incoming msg', msg)
			// if the incoming message is for this user, open the conversation with the sender
			if (msg.receiver === user.id) {
				setActiveConversation(prev => (prev === msg.sender ? prev : msg.sender))
			}
		})
		s.on('online:users', (list) => {
			setOnlineUsers(list || [])
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
<div className="chat-page">
			<aside className="sidebar">
				<div className="sidebar-header">
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Avatar name={user.username} size={40} />
						<h3 style={{ margin: 0 }}>{user.username}</h3>
					</div>
					<button className="logout-button" onClick={async () => { await logout(); navigate('/'); }}>Logout</button>
				</div>
<ChatList onSelect={setActiveConversation} onlineUsers={onlineUsers} selectedUser={activeConversation} />
</aside>
			<main className="main-chat">
				<ChatWindow 
					socket={socket} 
					conversationId={activeConversation} 
					user={user} 
					otherUser={otherUserData}
				/>
</main>
</div>
)
}