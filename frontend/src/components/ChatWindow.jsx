import React, { useEffect, useState } from 'react'
import API from '../api/api'
import MessageInput from './MessageInput'
import Avatar from './Avatar'
import { getFirstName } from '../utils/avatar'


export default function ChatWindow({ socket, conversationId, user, otherUser }){
const [messages, setMessages] = useState([])


useEffect(()=>{
	if (!conversationId) return
	// derive a stable conversation id from the two user ids so both sides use the same id
	const convId = [user.id, conversationId].sort().join(':')
	API.get(`/messages/${convId}`).then(res=> setMessages(res.data.messages)).catch(()=>{})
}, [conversationId])


useEffect(()=>{
if (!socket) return
socket.on('receive:message', (msg)=>{
	// only append if the incoming message belongs to the current conversation
	const convId = [user.id, conversationId].sort().join(':')
	console.log('ChatWindow convId:', convId, 'incoming msg.convId:', msg.conversationId)
	if (msg.conversationId === convId) setMessages(prev => [...prev, msg])
})
		socket.on('message:deleted', ({ id }) => {
			setMessages(prev => prev.filter(m => (m._id || m.id) !== id))
		})
		socket.on('conversation:deleted', ({ conversationId: convId }) => {
			// if the deleted conversation is the one currently open, clear messages
			const currentConv = [user.id, conversationId].sort().join(':')
			if (convId === currentConv) setMessages([])
		})
return ()=> socket.off('receive:message')
}, [socket, conversationId])


const send = async (text) => {
	if (!socket || !conversationId) return
	const receiver = conversationId
	const convId = [user.id, receiver].sort().join(':')
	const payload = { conversationId: convId, sender: user.id, receiver, text }
	socket.emit('send:message', payload)
	setMessages(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }])
}

	const formatTime = (timestamp) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
	}

return (
<div className="chat-window">
			{/* Chat Header */}
			{conversationId && (
				<div className="chat-header">
					<Avatar name={otherUser?.username || conversationId} size={40} />
					<div className="chat-header-info">
						<div className="chat-header-name">
							{otherUser?.username || conversationId}
						</div>
						<div className="chat-header-status">
							{otherUser?.online ? 'Online' : 'Offline'}
						</div>
					</div>
					<button 
						className="delete-conversation-btn"
						onClick={async ()=>{
							if (!conversationId) return;
							const convId = [user.id, conversationId].sort().join(':')
							try{
								await API.delete(`/messages/conversation/${convId}`)
								// tell other participant to clear the conversation
								socket && socket.emit('conversation:deleted', { conversationId: convId, otherId: conversationId })
								setMessages([])
							}catch(err){
								alert(err.response?.data?.message || 'Delete conversation failed')
							}
						}}
					>
						🗑️ Delete
					</button>
				</div>
			)}

			{/* Messages Container */}
			<div className="messages-container">
				{!conversationId && (
					<div className="no-conversation-selected">
						<div style={{fontSize: 48, marginBottom: 16}}>💬</div>
						<div style={{fontSize: 18, color: '#667781'}}>
							Select a conversation to start messaging
						</div>
					</div>
				)}
			{messages.map((m, i)=> {
					const isSent = m.sender === user.id
					const senderName = isSent ? user.username : (otherUser?.username || conversationId)
					const firstName = getFirstName(senderName)
					
					return (
						<div 
							key={m._id || i} 
							className={`message ${isSent ? 'message-sent' : 'message-received'}`}
						>
							{!isSent && (
								<Avatar name={senderName} size={32} className="message-avatar" />
							)}
							<div className="message-content">
								{!isSent && (
									<div className="message-sender-name">{firstName}</div>
								)}
								<div className="message-bubble">
									<div className="message-text">{m.text}</div>
									<div className="message-time">
										{formatTime(m.createdAt)}
									</div>
								</div>
							</div>
							{isSent && (
								<Avatar name={senderName} size={32} className="message-avatar" />
							)}
						</div>
					)
				})}
</div>

			{/* Message Input */}
			{conversationId && <MessageInput onSend={send} />}
</div>
)
}