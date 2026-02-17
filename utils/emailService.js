const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lexa Admin <no-reply@lexatechnologies.com>',  // Recommended: Use this or admin@lexatechnologies.com
      to: [to],  // Can be a string or array
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Email Error:', error);
      throw error;
    }

    console.log('Email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

module.exports = sendEmail;