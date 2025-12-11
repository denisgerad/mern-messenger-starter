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
				<div key={m._id || i} style={{display:'flex', justifyContent:'space-between', padding:6}}>
					<div><b>{m.sender}</b>: {m.text}</div>
					{m.sender === user.id && (
						<button style={{marginLeft:8}} onClick={async ()=>{
							try{
								await API.delete(`/messages/${m._id}`)
								// notify receiver via socket so they can remove the message
								socket && socket.emit('delete:message', { id: m._id, receiver: m.receiver })
								setMessages(prev => prev.filter(x => (x._id || x.id) !== (m._id || m.id)))
							}catch(err){
								alert(err.response?.data?.message || 'Delete failed')
							}
						}}>Delete</button>
					)}
				</div>
			))}
</div>
<MessageInput onSend={send} />
</div>
)
}