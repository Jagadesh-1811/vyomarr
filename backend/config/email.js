const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email skipped (credentials not configured):', { to, subject });
      return false;
    }
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('📧 Email sent to:', to);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Email templates
const emailTemplates = {
  theoryApproved: (theory) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; color: #f8f9f9; padding: 30px; border-radius: 10px;">
      <h1 style="color: #fc4c00;">🎉 Your Theory Has Been Approved!</h1>
      <p>Hello ${theory.authorName || 'Space Explorer'},</p>
      <p>Great news! Your "What If" scenario has been reviewed and <strong style="color: #22c55e;">approved</strong> by our cosmic team.</p>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #fc4c00;">${theory.title}</h3>
        <p style="margin: 0; color: #bfc3c6;">${theory.description.substring(0, 200)}...</p>
      </div>
      <p>Your theory is now live on Vyomarr and visible to our entire community!</p>
      <p style="color: #bfc3c6; font-size: 14px;">Thank you for contributing to our space exploration community.</p>
      <p>- The Vyomarr Team 🚀</p>
    </div>
  `,

  theoryRejected: (theory) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; color: #f8f9f9; padding: 30px; border-radius: 10px;">
      <h1 style="color: #fc4c00;">Theory Review Update</h1>
      <p>Hello ${theory.authorName || 'Space Explorer'},</p>
      <p>Thank you for submitting your "What If" scenario to Vyomarr. After careful review, we were unable to approve your submission at this time.</p>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #fc4c00;">${theory.title}</h3>
        <p style="margin: 0 0 15px 0; color: #bfc3c6;">${theory.description.substring(0, 150)}...</p>
        <p style="margin: 0; color: #ef4444;"><strong>Reason:</strong> ${theory.rejectionReason}</p>
      </div>
      <p>Don't be discouraged! We encourage you to revise your theory and submit again. Here are some tips:</p>
      <ul style="color: #bfc3c6;">
        <li>Ensure your scenario has a scientific basis</li>
        <li>Provide clear and detailed explanations</li>
        <li>Check for factual accuracy</li>
      </ul>
      <p style="color: #bfc3c6; font-size: 14px;">If you have questions, feel free to reach out to our team.</p>
      <p>- The Vyomarr Team 🚀</p>
    </div>
  `
};

module.exports = { sendEmail, emailTemplates };
