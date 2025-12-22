const nodemailer = require('nodemailer');

// Create reusable transporter
// For production, use a real email service (Gmail, SendGrid, AWS SES, etc.)
const createTransporter = () => {
	// For development/testing, use Ethereal (fake SMTP)
	// For production, replace with real SMTP credentials from environment variables
	if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT || 587,
			secure: process.env.EMAIL_SECURE === 'true',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		});
	}
	
	// Fallback: log to console in development
	console.warn('⚠️ Email service not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in environment variables.');
	return null;
};

const sendVerificationEmail = async (email, username, verificationToken) => {
	const transporter = createTransporter();
	
	// Build verification URL
	const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
	const verificationUrl = `${clientOrigin}/verify-email?token=${verificationToken}`;
	
	const mailOptions = {
		from: process.env.EMAIL_FROM || '"MERN Messenger" <noreply@messenger.com>',
		to: email,
		subject: 'Verify Your Email - MERN Messenger',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Welcome to MERN Messenger, ${username}!</h2>
				<p>Thank you for registering. Please verify your email address to complete your registration.</p>
				<p>Click the button below to verify your email:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${verificationUrl}" 
						 style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
						Verify Email Address
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p style="word-break: break-all; color: #666;">${verificationUrl}</p>
				<p style="color: #999; font-size: 12px; margin-top: 40px;">
					This link will expire in 24 hours. If you didn't create an account, please ignore this email.
				</p>
			</div>
		`
	};
	
	if (!transporter) {
		// In development without email configured, log to console
		console.log('\n📧 ===== EMAIL VERIFICATION =====');
		console.log(`To: ${email}`);
		console.log(`Subject: ${mailOptions.subject}`);
		console.log(`Verification URL: ${verificationUrl}`);
		console.log('================================\n');
		return { success: true, message: 'Email logged to console (dev mode)' };
	}
	
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Verification email sent:', info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('Error sending verification email:', error);
		throw new Error('Failed to send verification email');
	}
};

module.exports = {
	sendVerificationEmail
};
