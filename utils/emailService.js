// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Use Google App Password
//   },
// });

// const sendEmail = async (to, subject, html) => {
//   await transporter.sendMail({
//     from: `"Lexa Admin" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

// 1. Create Transporter with Explicit Settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Explicitly connecting to Gmail
  port: 465,              // Port 465 is for Secure SSL (More reliable on Cloud)
  secure: true,           // Must be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 2. Add Timeouts to prevent hanging
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 10000,     // 10 seconds
});

// 3. Send Email Function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Lexa Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Rethrow so the controller knows it failed
    throw error; 
  }
};

module.exports = sendEmail;