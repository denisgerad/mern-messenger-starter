import React from 'react'
import { Outlet } from 'react-router-dom'


export default function App(){
return (
<div className="app-root">
<h1 style={{textAlign:'center'}}>MERN Messenger (Starter)</h1>
<Outlet />
</div>
)
}