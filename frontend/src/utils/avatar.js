// Utility functions for generating avatars

/**
 * Generate a consistent color based on a string (e.g., username)
 */
export function getAvatarColor(str) {
  const colors = [
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#673ab7', // Deep Purple
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#ff9800', // Orange
    '#ff5722', // Deep Orange
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get initials from a name or username
 */
export function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
}

/**
 * Extract first name from full name or username
 */
export function getFirstName(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts[0];
}
