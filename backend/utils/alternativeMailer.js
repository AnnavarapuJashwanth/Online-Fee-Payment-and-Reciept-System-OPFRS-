import nodemailer from "nodemailer";

// ✅ Alternative email service using Ethereal (for testing) or other SMTP
const createAlternativeTransporter = () => {
  // You can replace this with SendGrid, Mailgun, or other service
  return nodemailer.createTransporter({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "ethereal.user@ethereal.email", // Replace with actual credentials
      pass: "ethereal.pass"
    },
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });
};

// ✅ Send email using alternative service
export const sendEmailAlternative = async (to, subject, html) => {
  try {
    console.log(`📧 Using alternative email service for ${to}...`);
    const transporter = createAlternativeTransporter();
    
    await transporter.verify();
    console.log(`✅ Alternative SMTP connection verified`);
    
    const result = await transporter.sendMail({
      from: '"OFPRS Portal" <noreply@ofprs.com>',
      to: to,
      subject: subject,
      html: html,
    });
    
    console.log(`✅ Alternative email sent successfully to ${to}`);
    console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(result)}`);
    return result;
  } catch (error) {
    console.error("❌ Alternative email service failed:", error.message);
    throw error;
  }
};

// ✅ Create a simple SMTP test service (works in most environments)
export const createSimpleTransporter = () => {
  return nodemailer.createTransporter({
    host: "smtp.gmail.com",
    port: 465,  // SSL port
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_HOST_USER || process.env.SMTP_USER,
      pass: process.env.EMAIL_HOST_PASSWORD || process.env.SMTP_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
  });
};
