const nodemailer = require('nodemailer');

// Create the transporter using the settings that worked for you
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY, // Your Resend API key
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