const transporter = require('./mailer');

const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email.html?token=${token}`;
    
    await transporter.sendMail({
        from: `"Super SaaS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your email',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Super SaaS!</h2>
                <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Verify Email
                    </a>
                </div>
                <p>If the button doesn't work, you can also click this link:</p>
                <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
        `
    });
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;
    
    await transporter.sendMail({
        from: `"Super SaaS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </div>
                <p>If the button doesn't work, you can also click this link:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
        `
    });
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}; 