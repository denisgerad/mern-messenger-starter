import React from 'react'
import { getAvatarColor, getInitials } from '../utils/avatar'

export default function Avatar({ name, size = 40, online = false, className = '' }) {
  const initials = getInitials(name)
  const bgColor = getAvatarColor(name)
  
  return (
    <div 
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        position: 'relative',
        flexShrink: 0
      }}
    >
      {initials}
      {online && (
        <div 
          className="online-indicator"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            border: '2px solid white'
          }}
        />
      )}
    </div>
  )
}
