# Email Verification Setup Guide

## ✅ What's Been Implemented

Your MERN Messenger now has **mandatory email verification**:

- ✅ Users must provide email during registration
- ✅ Email must be verified before logging in
- ✅ Verification emails sent with 24-hour expiry tokens
- ✅ Resend verification email functionality
- ✅ Frontend registration form updated with email field
- ✅ Verification page for email confirmation

## 🚀 Setup Instructions

### 1. Update Render Environment Variables

Add these **new** environment variables to your Render backend service:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="MERN Messenger <noreply@yourapp.com>"
```

### 2. Configure Email Service

**Option A: Gmail (Recommended for Testing)**

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Copy the generated password
4. Use this as `EMAIL_PASS` in Render

**Option B: SendGrid (Recommended for Production)**

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Set environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

**Option C: Development Mode (No Email Service)**

If you don't configure email credentials, verification links will be **logged to Render console**. You can:
1. Check Render logs after registration
2. Copy the verification URL from logs
3. Open it in your browser

### 3. How It Works

**Registration Flow:**
1. User enters username, email, and password
2. System creates unverified user account
3. Verification email sent with token link
4. User clicks link → redirected to `/verify-email?token=...`
5. Token validated, user marked as verified
6. User can now log in

**Login Flow:**
1. User enters username and password
2. If not verified → Error: "Please verify your email..."
3. If verified → Login successful

### 4. Testing Locally

Create `backend/.env.local` with your new MongoDB credentials + email config:

```bash
PORT=8000
MONGO_URI=mongodb+srv://new-user:new-password@cluster0.bwhw2ot.mongodb.net/user-auth?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173

# Email config (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="MERN Messenger <noreply@test.com>"
```

Run locally:
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 5. API Endpoints

**New endpoints added:**

- `GET /api/auth/verify-email?token=xxx` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email
  ```json
  {
    "email": "user@example.com"
  }
  ```

**Updated endpoints:**

- `POST /api/auth/register` - Now requires email
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

- `POST /api/auth/login` - Blocks unverified users
  ```json
  {
    "username": "johndoe",
    "password": "securepassword"
  }
  ```

## 🔧 Troubleshooting

**Issue: Email not sending**
- Check Render logs for email configuration warnings
- Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS are set correctly
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder

**Issue: "Username taken" on any registration**
- This was the old bug - now fixed!
- The problematic `email_1` index is automatically dropped on server start

**Issue: Existing users can't log in**
- Existing users in database don't have `isVerified=true`
- Option 1: Manually update in MongoDB Atlas:
  ```javascript
  db.users.updateMany({}, { $set: { isVerified: true } })
  ```
- Option 2: Delete old test users and re-register

**Issue: "Invalid or expired verification token"**
- Tokens expire after 24 hours
- Use the resend verification endpoint
- Or register again with a different email

## 📝 Database Changes

Your User model now includes:

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  passwordHash: String (required),
  isVerified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpires: Date,
  walletAddress: String,
  createdAt: Date
}
```

## 🎯 Next Steps

1. **Configure email service** in Render (see step 1)
2. **Test registration** with your email
3. **Check inbox** for verification email
4. **Click verification link** to activate account
5. **Try logging in** - should work now!

## 🔒 Security Notes

- Passwords are hashed with bcrypt
- Verification tokens are 32-byte random hex strings
- Tokens expire after 24 hours
- Email addresses are unique and lowercase
- JWT tokens expire after 7 days

---

**Need help?** Check Render logs for detailed error messages!
