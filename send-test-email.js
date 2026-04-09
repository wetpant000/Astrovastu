require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Sample booking data
const bookingData = {
  name: 'Test User',
  email: process.env.EMAIL_USER,
  phone: '+91-9876543210',
  service: 'Vastu Consultation'
};

// Send confirmation email
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Consultation Booking Confirmation',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Thank you for booking a consultation!</h2>
      <p>Dear ${bookingData.name},</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #8b7355; margin: 20px 0;">
        <h3 style="color: #8b7355; margin-top: 0;">Booking Confirmation Details</h3>
        <p><strong>Service:</strong> ${bookingData.service}</p>
        <p><strong>Contact Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Contact Email:</strong> ${bookingData.email}</p>
        <p><strong>Booking Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p>Your booking for <strong>${bookingData.service}</strong> has been confirmed. We will contact you soon to schedule your consultation at your preferred time.</p>
      
      <p style="margin-top: 30px; color: #666;">Best regards,<br><strong>Pritha Ghosh Pramanik</strong><br>Astrovastu Consultant</p>
    </div>
  `
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error(' Email sending failed:', err);
    process.exit(1);
  } else {
    console.log(' Email sent successfully!');
    console.log(' Message ID:', info.messageId);
    process.exit(0);
  }
});
