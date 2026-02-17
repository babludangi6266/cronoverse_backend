const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,              
  secure: false,          
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps avoid SSL errors on some clouds
  },
  family: 4, // <--- CRITICAL FIX: Forces IPv4 connection (Fixes ENETUNREACH)
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Lexa Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error; // Rethrow so frontend sees the error
  }
};

module.exports = sendEmail;