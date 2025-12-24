import React, { useEffect, useState } from 'react'
import API from '../api/api'
import MessageInput from './MessageInput'
import Avatar from './Avatar'
import { getFirstName } from '../utils/avatar'


export default function ChatWindow({ socket, conversationId, user, otherUser, onBack }){
const [messages, setMessages] = useState([])
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)


useEffect(()=>{
	if (!conversationId) return
	// derive a stable conversation id from the two user ids so both sides use the same id
	const convId = [user.id, conversationId].sort().join(':')
	API.get(`/messages/${convId}`).then(res=> setMessages(res.data.messages)).catch(()=>{})
}, [conversationId])


useEffect(()=>{
if (!socket) return
const handleReceiveMessage = (msg)=>{
	// only append if the incoming message belongs to the current conversation
	const convId = [user.id, conversationId].sort().join(':')
	console.log('ChatWindow convId:', convId, 'incoming msg.convId:', msg.conversationId)
	if (msg.conversationId === convId) setMessages(prev => [...prev, msg])
}

const handleMessageDeleted = ({ id }) => {
	setMessages(prev => prev.filter(m => (m._id || m.id) !== id))
}

const handleConversationDeleted = ({ conversationId: convId }) => {
	// if the deleted conversation is the one currently open, clear messages
	const currentConv = [user.id, conversationId].sort().join(':')
	if (convId === currentConv) setMessages([])
}

socket.on('receive:message', handleReceiveMessage)
socket.on('message:deleted', handleMessageDeleted)
socket.on('conversation:deleted', handleConversationDeleted)

return ()=> {
	socket.off('receive:message', handleReceiveMessage)
	socket.off('message:deleted', handleMessageDeleted)
	socket.off('conversation:deleted', handleConversationDeleted)
}
}, [socket, conversationId, user.id])


const send = async (text) => {
	if (!socket || !conversationId) return
	const receiver = conversationId
	const convId = [user.id, receiver].sort().join(':')
	const payload = { conversationId: convId, sender: user.id, receiver, text }
	console.log('📤 Sending message:', payload)
	console.log('📤 Socket ID:', socket.id)
	console.log('📤 Socket connected:', socket.connected)
	socket.emit('send:message', payload)
	setMessages(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }])
}

const handleDeleteConversation = () => {
	setShowDeleteConfirm(true)
}

const executeDelete = async () => {
	if (!conversationId || isDeleting) return;
	
	setIsDeleting(true);
	setShowDeleteConfirm(false);
	
	const convId = [user.id, conversationId].sort().join(':');
	
	try {
		console.log('Deleting conversation:', convId);
		
		// Get token from localStorage for debugging
		const token = localStorage.getItem('token');
		console.log('Token available:', !!token);
		console.log('Status: connected');
		
		const response = await API.delete(`/messages/conversation/${convId}`);
		console.log('Delete response:', response.data);
		
		// Tell other participant to clear the conversation
		if (socket && socket.connected) {
			socket.emit('conversation:deleted', { conversationId: convId, otherId: conversationId });
		}
		
		setMessages([]);
	} catch (err) {
		console.error('Delete error:', err);
		console.error('Error details:', {
			status: err.response?.status,
			data: err.response?.data,
			message: err.message
		});
		
		const errorMsg = err.response?.data?.message || err.message || 'Delete conversation failed';
		
		// Use custom alert for iOS compatibility
		setShowDeleteConfirm(false);
		setTimeout(() => {
			alert(errorMsg);
		}, 100);
	} finally {
		setIsDeleting(false);
	}
}

const cancelDelete = () => {
	setShowDeleteConfirm(false)
}

	const formatTime = (timestamp) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
	}

return (
<div className="chat-window">
			{/* Custom Delete Confirmation Dialog - iOS Compatible */}
			{showDeleteConfirm && (
				<div className="modal-overlay" onClick={cancelDelete}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<h3>Delete Conversation?</h3>
						<p>This will permanently delete all messages in this conversation.</p>
						<div className="modal-buttons">
							<button 
								className="modal-btn modal-btn-cancel" 
								onClick={cancelDelete}
								disabled={isDeleting}
							>
								Cancel
							</button>
							<button 
								className="modal-btn modal-btn-delete" 
								onClick={executeDelete}
								disabled={isDeleting}
							>
								{isDeleting ? 'Deleting...' : 'Delete'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Chat Header */}
			{conversationId && (
				<div className="chat-header">
					{onBack && (
						<button className="back-button" onClick={onBack}>
							←
						</button>
					)}
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
						onClick={(e)=>{
							// Prevent event bubbling for iOS Safari compatibility
							e.preventDefault();
							e.stopPropagation();
							handleDeleteConversation();
						}}
						onTouchEnd={(e)=>{
							// iOS Safari touch event handling
							e.preventDefault();
							e.stopPropagation();
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