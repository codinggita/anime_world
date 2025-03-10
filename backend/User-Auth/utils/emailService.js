import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `http://localhost:3000/api/verify/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - AnimeHub',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #e11d48; text-align: center;">Welcome to AnimeHub!</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">
            If the button doesn't work, you can also click this link:<br>
            <a href="${verificationLink}" style="color: #e11d48;">${verificationLink}</a>
          </p>
          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendResetPasswordEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - AnimeHub',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #e11d48; text-align: center;">Password Reset Request</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Your OTP for password reset is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h2 style="color: #e11d48; font-size: 36px; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">
            This OTP will expire in 10 minutes.<br>
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent successfully');
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Failed to send reset password email');
  }
};