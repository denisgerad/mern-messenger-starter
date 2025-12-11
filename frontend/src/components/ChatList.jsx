import React from 'react'


// Minimal static chat list. Replace with API call to fetch conversations.
export default function ChatList({ onSelect }){
const demo = [
{ id: 'conv:1', name: 'Alice' },
{ id: 'conv:2', name: 'Bob' }
]
return (
<div>
{demo.map(d => (
<div key={d.id} onClick={()=>onSelect(d.id)} style={{padding:10, cursor:'pointer'}}>
{d.name}
</div>
))}
</div>
)
}