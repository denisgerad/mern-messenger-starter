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
		const s = io(SOCKET_URL, {
			transports: ['websocket', 'polling'],
			upgrade: true,
			rememberUpgrade: true,
			timeout: 10000
		})
		setSocket(s)
		s.on('connect', ()=>{
			console.log('Socket connected:', s.id)
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
			console.log('Online users updated:', list)
			setOnlineUsers(list || [])
		})
		s.on('connect_error', (error) => {
			console.error('Socket connection error:', error)
		})
		s.on('disconnect', (reason) => {
			console.log('Socket disconnected:', reason)
		})
		return ()=> s.disconnect()
	}, [user])
					onBack={() => setActiveConversation(null)}
				/>
</main>
</div>
)
}