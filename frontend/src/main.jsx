import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Chat from './pages/Chat'
import VerifyEmail from './pages/VerifyEmail'
import { AuthProvider } from './context/AuthContext'
import './styles.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<AuthProvider>
<BrowserRouter>
<Routes>
<Route path='/' element={<App/>}>
<Route index element={<Login/>} />
<Route path='chat' element={<Chat/>} />
<Route path='verify-email' element={<VerifyEmail/>} />
</Route>
</Routes>
</BrowserRouter>
</AuthProvider>
</React.StrictMode>
)