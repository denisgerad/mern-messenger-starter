import React from 'react'

// Minimal chat list showing online users (from socket) with a demo fallback
export default function ChatList({ onSelect, onlineUsers = [] }){
	const demo = [
		{ id: 'conv:1', name: 'Alice' },
		{ id: 'conv:2', name: 'Bob' }
	]

	return (
		<div>
			<div style={{padding:8, fontWeight:'bold'}}>Online</div>
			{onlineUsers.length === 0 && <div style={{padding:8, color:'#666'}}>No users online</div>}
			{onlineUsers.map(u => {
				const id = u?.id || u
				const name = u?.username || id
				return (
					<div key={id} onClick={()=>onSelect(id)} style={{padding:10, cursor:'pointer'}}>
						{name}
					</div>
				)
			})}

			<div style={{padding:8, fontWeight:'bold', marginTop:12}}>All</div>
			{demo.map(d => (
				<div key={d.id} onClick={()=>onSelect(d.id)} style={{padding:10, cursor:'pointer'}}>
					{d.name}
				</div>
			))}
		</div>
	)
}