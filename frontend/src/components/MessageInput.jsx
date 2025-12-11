import React, { useState } from 'react'


export default function MessageInput({ onSend }){
const [text, setText] = useState('')
const submit = () => {
if (!text.trim()) return
onSend(text)
setText('')
}
return (
<div style={{display:'flex', padding:10}}>
<input style={{flex:1}} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key==='Enter' && submit()} />
<button onClick={submit}>Send</button>
</div>
)
}