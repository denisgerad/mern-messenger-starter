import React, { useEffect, useState } from 'react'
import API from '../api/api'
import MessageInput from './MessageInput'


export default function ChatWindow({ socket, conversationId, user }){
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


return (
<div style={{display:'flex', flexDirection:'column', height:'100%'}}>
<div style={{flex:1, overflow:'auto'}}>
			{messages.map((m, i)=> (
			<div key={m._id || i} style={{padding:6}}>
				<div><b>{m.sender}</b>: {m.text}</div>
				</div>
			))}
</div>
			<div style={{padding:10}}>
				<button onClick={async ()=>{
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
				}}>Delete Conversation</button>
			</div>
<MessageInput onSend={send} />
</div>
)
}