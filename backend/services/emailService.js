import nodemailer from 'nodemailer';
import qr from 'qr-image';

// Create a test transporter that doesn't require real credentials
const createTestTransporter = () => {
  // For development, we'll just log emails instead of actually sending them
  return {
    sendMail: async (mailOptions) => {
      console.log('📧 EMAIL WOULD BE SENT (Development Mode):');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('HTML Content Length:', mailOptions.html?.length);
      console.log('---');
      return { messageId: 'dev-mode-' + Date.now() };
    }
  };
};

// Generate QR Code
const generateQRCode = (text) => {
  try {
    const qr_png = qr.imageSync(text, { type: 'png' });
    return qr_png;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};

// Send verification email
export const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  let transporter;
  try {
    // Try to create real transporter first
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('📧 Using real email transporter');
    } else {
      // Fallback to test mode
      console.log('📧 Using development email mode - emails logged to console');
      transporter = createTestTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RoomBook <noreply@roombook.com>',
      to: email,
      subject: 'Verify Your Email - RoomBook',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to RoomBook! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for registering with RoomBook. To complete your registration, please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>If the button doesn't work, copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace;">
                ${verificationUrl}
              </p>
              <p><strong>For testing:</strong> Click the link above to verify your email.</p>
              <p><em>This is a development environment - in production, this would be a real email.</em></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 RoomBook. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email processed for: ${email}`);
    if (result.messageId && !result.messageId.startsWith('dev-mode-')) {
      console.log('📨 Real email sent with Message ID:', result.messageId);
    }
    return true;
  } catch (error) {
    console.error('❌ Error in email service:', error.message);
    console.log('🔄 Continuing without email...');
    // Don't fail the registration if email fails
    return true;
  }
};

// Send booking confirmation email with QR code
export const sendBookingConfirmation = async (booking, user, room) => {
  const qrData = `ROOMBOOK:${booking._id}:${room.name}:${booking.bookingDate}:${booking.startTime}-${booking.endTime}:${user.email}`;
  const qrCodeBuffer = generateQRCode(qrData);
  
  let transporter;
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.log('📧 Using development email mode for booking confirmation');
      transporter = createTestTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RoomBook <noreply@roombook.com>',
      to: user.email,
      subject: `Booking Confirmed - ${room.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-row:last-child { border-bottom: none; }
            .qr-section { text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 5px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed! ✅</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>Your room booking has been confirmed. Here are your booking details:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <strong>Room:</strong>
                  <span>${room.name} (${room.type})</span>
                </div>
                <div class="detail-row">
                  <strong>Date:</strong>
                  <span>${new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Time:</strong>
                  <span>${booking.startTime} - ${booking.endTime}</span>
                </div>
                <div class="detail-row">
                  <strong>Duration:</strong>
                  <span>${booking.totalHours} hour(s)</span>
                </div>
                <div class="detail-row">
                  <strong>Location:</strong>
                  <span>${room.location}</span>
                </div>
                <div class="detail-row">
                  <strong>Total Amount:</strong>
                  <span>₹${booking.totalAmount}</span>
                </div>
              </div>

              <div class="qr-section">
                <h3>QR Code for Check-in</h3>
                <p>Show this QR code at the reception for quick check-in:</p>
                ${qrCodeBuffer ? 
                  '<div style="background: #f3f4f6; padding: 20px; border-radius: 10px; display: inline-block;">[QR Code Image]</div>' 
                  : '<p>QR Code would be generated here</p>'
                }
                <p><small>Booking ID: ${booking._id}</small></p>
                <p><small>QR Data: ${qrData}</small></p>
              </div>

              <p><strong>Important Notes:</strong></p>
              <ul style="color: #6b7280;">
                <li>Please arrive 15 minutes before your booking time</li>
                <li>Bring a valid ID for verification</li>
                <li>Cancellations must be made at least 2 hours in advance</li>
                <li>Late arrival may result in booking cancellation</li>
              </ul>
              
              <p><em>This is a development environment - in production, you would receive a real email with QR code.</em></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 RoomBook. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email processed for: ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error.message);
    console.log('🔄 Continuing without email...');
    return true;
  }
};

// Send cancellation email
export const sendCancellationEmail = async (booking, user, room) => {
  let transporter;
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.log('📧 Using development email mode for cancellation');
      transporter = createTestTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RoomBook <noreply@roombook.com>',
      to: user.email,
      subject: `Booking Cancelled - ${room.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-row:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>Your booking has been cancelled as requested. Here are the details of the cancelled booking:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <strong>Room:</strong>
                  <span>${room.name} (${room.type})</span>
                </div>
                <div class="detail-row">
                  <strong>Date:</strong>
                  <span>${new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Time:</strong>
                  <span>${booking.startTime} - ${booking.endTime}</span>
                </div>
                <div class="detail-row">
                  <strong>Refund Amount:</strong>
                  <span>₹${booking.totalAmount}</span>
                </div>
              </div>

              <p>The refund has been processed and will reflect in your account within 5-7 business days.</p>
              <p>We hope to see you again soon!</p>
              
              <p><em>This is a development environment - in production, you would receive a real cancellation email.</em></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 RoomBook. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email processed for: ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error.message);
    console.log('🔄 Continuing without email...');
    return true;
  }
};

// Send login notification email
export const sendLoginNotification = async (user, loginTime) => {
  let transporter;
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.log('📧 Using development email mode for login notification');
      transporter = createTestTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RoomBook <noreply@roombook.com>',
      to: user.email,
      subject: 'Successful Login - RoomBook',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Login Successful</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>You have successfully logged into your RoomBook account.</p>
              <p><strong>Login Time:</strong> ${loginTime}</p>
              <p>If this was not you, please contact our support team immediately.</p>
              
              <p><em>This is a development environment - in production, you would receive a real login notification.</em></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 RoomBook. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Login notification processed for: ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending login notification:', error.message);
    console.log('🔄 Continuing without email...');
    return true;
  }
};