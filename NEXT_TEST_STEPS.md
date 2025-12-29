# iPhone Delete Issue - Next Test Steps

## Changes Deployed

✅ **Enhanced Logging** - Now tracking:
- Token presence in localStorage before delete
- Authorization header attachment
- Request/response details
- User agent information

✅ **Token Verification** - Checks localStorage before attempting delete

✅ **Better Error Messages** - Specific guidance for 401 errors

## What to Look for in Next Test

When you test delete on iPhone Chrome again, you'll now see these logs:

### 1. Pre-Delete Check (before API call)
```
🔍 Pre-Delete Check: {
  hasToken: true/false,
  hasUser: true/false,
  userIdFromContext: "...",
  conversationId: "...",
  userAgent: "..."
}
```

**Key Question**: Is `hasToken` showing `true` or `false`?

### 2. API Request Interceptor
```
🔍 API Request Interceptor: {
  url: "/messages/conversation/...",
  method: "delete",
  hasToken: true/false,
  tokenPreview: "eyJhbGciOiJIUzI1NiI..." or "NONE",
  withCredentials: true,
  userAgent: "..."
}
```

**Key Questions**: 
- Does `hasToken` match the Pre-Delete Check?
- Is there a token preview showing?
- Do you see "✅ Authorization header set" or "⚠️ NO TOKEN FOUND IN LOCALSTORAGE"?

### 3. API Error Details (if 401 occurs)
```
❌ API Error: {
  status: 401,
  message: "No token",
  url: "/messages/conversation/...",
  method: "delete",
  hasAuthHeader: true/false
}
```

**Critical**: Does `hasAuthHeader` show `true` or `false`?

## Diagnosis Guide

### Scenario A: Token Missing from localStorage
```
🔍 Pre-Delete Check: { hasToken: false, ... }
❌ No token in localStorage
```
**Problem**: Token is being cleared from localStorage on iPhone
**Likely Cause**: iOS Safari Intelligent Tracking Prevention or storage limits
**Solution Needed**: Implement refresh token mechanism or force re-login

### Scenario B: Token Present but Not Sent
```
🔍 Pre-Delete Check: { hasToken: true, ... }
🔍 API Request Interceptor: { hasToken: true, tokenPreview: "eyJ..." }
✅ Authorization header set
❌ API Error: { hasAuthHeader: false }
```
**Problem**: Token is in localStorage, interceptor adds it, but it's not reaching the server
**Likely Cause**: Header stripping by iOS network stack or proxy
**Solution Needed**: Alternative auth method or header name

### Scenario C: Token Sent but Invalid
```
🔍 API Request Interceptor: { hasToken: true, ... }
✅ Authorization header set
❌ API Error: { hasAuthHeader: true, message: "Token invalid" }
```
**Problem**: Token is corrupted or expired
**Likely Cause**: localStorage corruption or JWT expiration
**Solution Needed**: Check token format, implement token refresh

### Scenario D: Cookie vs Header Conflict
```
✅ Authorization header set
❌ API Error: { message: "No token" }
```
**Problem**: Backend might be rejecting one auth method
**Solution Needed**: Check backend middleware priority

## Test Commands

Run these in iPhone Chrome console before clicking delete:

```javascript
// Check current auth state
console.log('Token:', localStorage.getItem('token'))
console.log('User:', localStorage.getItem('user'))

// Test token format
const token = localStorage.getItem('token')
if (token) {
  console.log('Token length:', token.length)
  console.log('Token starts with:', token.substring(0, 10))
  try {
    const parts = token.split('.')
    console.log('JWT parts:', parts.length, '(should be 3)')
    console.log('Payload:', JSON.parse(atob(parts[1])))
  } catch(e) {
    console.error('Token parse error:', e)
  }
}
```

## Expected Behavior After Fix

If token exists:
1. Pre-Delete Check shows `hasToken: true`
2. Interceptor shows `✅ Authorization header set`
3. Delete succeeds with `✅ Delete successful`
4. No 401 error

If token missing:
1. Pre-Delete Check shows `hasToken: false`
2. User sees alert: "Your session has expired. Please log in again."
3. No API call is made
4. No confusing error messages

## Share These Logs

After your next test, please share:
1. The complete console output (especially the 🔍 and ❌ emoji logs)
2. Any alert messages you see
3. Whether the token check happens before the API call
4. The result of the test commands above

This will tell us exactly where the token is getting lost!

---

**Created**: 2025-12-29
