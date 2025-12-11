import React, { useContext, useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'


export default function Chat(){
const { user, logout } = useContext(AuthContext)
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


if (!user) return <div>Please login</div>


return (
<div className="chat-page">
<aside style={{width:300}}>
<h3>{user.username}</h3>
<button onClick={logout}>Logout</button>
<ChatList onSelect={setActiveConversation} onlineUsers={onlineUsers} />
</aside>
<main style={{flex:1}}>
<ChatWindow socket={socket} conversationId={activeConversation} user={user} />
</main>
</div>
)
}