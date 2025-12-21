import React, { useState } from 'react'


export default function MessageInput({ onSend }){
const [text, setText] = useState('')
const submit = () => {
if (!text.trim()) return
onSend(text)
setText('')
}
return (
		<div className="message-input-container">
			<input 
				className="message-input"
				placeholder="Type a message..."
				value={text} 
				onChange={e=>setText(e.target.value)} 
				onKeyDown={e=> e.key==='Enter' && submit()} 
			/>
			<button 
				className="send-button" 
				onClick={submit}
				disabled={!text.trim()}
			>
				<svg 
					viewBox="0 0 24 24" 
					width="24" 
					height="24"
					fill="currentColor"
				>
					<path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
				</svg>
			</button>
		</div>
)
}