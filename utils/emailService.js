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

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,              // CHANGE TO 587
  secure: false,          // MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // This helps bypass some strict SSL checks on Render
  },
  connectionTimeout: 10000, 
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Lexa Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;