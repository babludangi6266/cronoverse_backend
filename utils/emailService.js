const nodemailer = require('nodemailer');

// Create the transporter using the settings that worked for you
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,              // Standard TLS port
  secure: false,          // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Lexa Admin" <${process.env.EMAIL_USER}>`, // Sender address
      to: to, // Receiver address (passed as argument)
      subject: subject,
      html: html,
    });
    console.log("Email sent successfully: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error; // Rethrow so the controller knows it failed
  }
};

module.exports = sendEmail;