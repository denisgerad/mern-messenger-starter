import React, { useEffect, useState } from 'react'
import API from '../api/api'
import MessageInput from './MessageInput'


export default function ChatWindow({ socket, conversationId, user }){
const [messages, setMessages] = useState([])


useEffect(()=>{
if (!conversationId) return
API.get(`/messages/${conversationId}`).then(res=> setMessages(res.data.messages)).catch(()=>{})
}, [conversationId])


useEffect(()=>{
if (!socket) return
socket.on('receive:message', (msg)=>{
if (msg.conversationId === conversationId) setMessages(prev => [...prev, msg])
})
return ()=> socket.off('receive:message')
}, [socket, conversationId])


const send = async (text) => {
if (!socket || !conversationId) return
const payload = { conversationId, sender: user.id, receiver: 'TODO:receiverId', text }
socket.emit('send:message', payload)
setMessages(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }])
}


return (
<div style={{display:'flex', flexDirection:'column', height:'100%'}}>
<div style={{flex:1, overflow:'auto'}}>
{messages.map((m, i)=> (
<div key={i}><b>{m.sender}</b>: {m.text}</div>
))}
</div>
<MessageInput onSend={send} />
</div>
)
}