import React from 'react'
import Avatar from './Avatar'
import { getFirstName } from '../utils/avatar'

// Minimal chat list showing online users (from socket)
export default function ChatList({ onSelect, onlineUsers = [], selectedUser, currentUserId }){
	// Filter out current user from online users
	const filteredOnlineUsers = onlineUsers.filter(u => {
		const id = u?.id || u
		return id !== currentUserId
	})

	return (
		<div className="chat-list">
			<div className="chat-list-section-title">Online</div>
			{filteredOnlineUsers.length === 0 && (
				<div style={{padding:12, color:'#667781', fontSize: 14}}>
					No users online
				</div>
			)}
			{filteredOnlineUsers.map(u => {
				const id = u?.id || u
				const name = u?.username
				// Only show users with valid usernames (skip if only ID is available)
				if (!name || name === id) return null
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
			}).filter(Boolean)}
		</div>
	)
}