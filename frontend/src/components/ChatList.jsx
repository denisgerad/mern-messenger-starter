import React from 'react'
import Avatar from './Avatar'
import { getFirstName } from '../utils/avatar'

// Minimal chat list showing online users (from socket) with a demo fallback
export default function ChatList({ onSelect, onlineUsers = [], selectedUser }){
	const demo = [
		{ id: 'conv:1', name: 'Alice' },
		{ id: 'conv:2', name: 'Bob' }
	]

	return (
		<div className="chat-list">
			<div className="chat-list-section-title">Online</div>
			{onlineUsers.length === 0 && (
				<div style={{padding:12, color:'#667781', fontSize: 14}}>
					No users online
				</div>
			)}
			{onlineUsers.map(u => {
				const id = u?.id || u
				const name = u?.username || id
				const isSelected = selectedUser === id
				return (
					<div 
						key={id} 
						onClick={()=>onSelect(id)} 
						className={`chat-list-item ${isSelected ? 'selected' : ''}`}
					>
						<Avatar name={name} size={48} online={true} />
						<div className="chat-list-item-content">
							<div className="chat-list-item-name">{name}</div>
							<div className="chat-list-item-status">Online</div>
						</div>
					</div>
				)
			})}

			<div className="chat-list-section-title" style={{marginTop: 12}}>All</div>
			{demo.map(d => {
				const isSelected = selectedUser === d.id
				return (
					<div 
						key={d.id} 
						onClick={()=>onSelect(d.id)} 
						className={`chat-list-item ${isSelected ? 'selected' : ''}`}
					>
						<Avatar name={d.name} size={48} />
						<div className="chat-list-item-content">
							<div className="chat-list-item-name">{d.name}</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}