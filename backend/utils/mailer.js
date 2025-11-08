import nodemailer from "nodemailer";
import { generateReceiptPDF } from "./pdfGenerator.js";

// ✅ Get email configuration (will be validated when first used)
const getEmailConfig = () => {
  const emailUser = process.env.EMAIL_HOST_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_HOST_PASSWORD || process.env.SMTP_PASS;
  
  if (!emailUser || !emailPass) {
    throw new Error("❌ Email configuration missing! Please set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env file");
  }
  
  return { emailUser, emailPass };
};

// ✅ Create transporter with lazy configuration and timeout
const createTransporter = () => {
  const { emailUser, emailPass } = getEmailConfig();
  
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP host
    port: 587,              // TLS port (STARTTLS)
    secure: false,          // false for TLS
    connectionTimeout: 10000, // 10 seconds connection timeout
    greetingTimeout: 5000,    // 5 seconds greeting timeout
    socketTimeout: 10000,     // 10 seconds socket timeout
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ✅ Send OTP Email with timeout (used in authController)
export const sendOtpEmail = async (email, otp) => {
  try {
    console.log(`📧 Creating email transporter for ${email}...`);
    const transporter = createTransporter();
    const { emailUser } = getEmailConfig();
    
    const html = `
      <div style="font-family:Arial;padding:20px;">
        <h2>Login OTP Verification</h2>
        <p>Your one-time password (OTP) for login is:</p>
        <h1 style="color:#1976d2;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `;

    console.log(`📧 Sending email to ${email}...`);
    
    // Add timeout wrapper for email sending
    const emailPromise = transporter.sendMail({
      from: `"OFPRS Portal" <${emailUser}>`,
      to: email,
      subject: "Your OTP Code - OFPRS",
      html,
    });

    // Race between email sending and timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout after 15 seconds')), 15000);
    });

    await Promise.race([emailPromise, timeoutPromise]);

    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    console.error("❌ Full error details:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// ✅ Send Payment Receipt with PDF Attachment (used in paymentController)
export const sendReceipt = async (payment) => {
  try {
    const transporter = createTransporter();
    const { emailUser } = getEmailConfig();
    
    // Generate PDF receipt
    console.log("📄 Generating PDF receipt for email...");
    const pdfBuffer = await generateReceiptPDF(payment);
    console.log("✅ PDF generated successfully");
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful! ✅</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Dear ${payment.name},</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We have received your payment successfully. Your fee payment has been processed and confirmed.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Payment Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0; color: #333; text-align: right; font-size: 18px; font-weight: bold;">₹${payment.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment ID:</td>
                <td style="padding: 8px 0; color: #333; text-align: right; font-family: monospace;">${payment.paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Order ID:</td>
                <td style="padding: 8px 0; color: #333; text-align: right; font-family: monospace;">${payment.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; text-align: right;">
                  <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                    ${payment.status.toUpperCase()}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333; text-align: right;">${new Date(payment.createdAt).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>📎 Receipt Attached:</strong> Your official fee payment receipt is attached to this email as a PDF file. 
              Please download and save it for your records.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Thank you for using the <strong>Online Fee Payment & Receipt System (OFPRS)</strong>. 
            If you have any questions or concerns, please contact us at 
            <a href="mailto:accounts@vignan.ac.in" style="color: #667eea; text-decoration: none;">accounts@vignan.ac.in</a>
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              This is an automated email. Please do not reply to this message.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              © ${new Date().getFullYear()} Vignan's Foundation for Science, Technology & Research
            </p>
          </div>
        </div>
      </div>
    `;

    const fileName = `FeeReceipt_${payment.regno}_${payment.paymentId}_${Date.now()}.pdf`;

    await transporter.sendMail({
      from: `"OFPRS Payments" <${emailUser}>`,
      to: payment.email,
      subject: `✅ Payment Receipt - ₹${payment.amount.toLocaleString()} | OFPRS`,
      html,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log(`✅ Receipt email with PDF attachment sent to ${payment.email}`);
  } catch (error) {
    console.error("❌ Error sending receipt email:", error);
    throw error;
  }
};

// ✅ Generic send email function
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const { emailUser } = getEmailConfig();

    await transporter.sendMail({
      from: `"OFPRS Portal" <${emailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
