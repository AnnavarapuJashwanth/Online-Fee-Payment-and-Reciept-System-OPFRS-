// ✅ EmailJS Service - Works in ALL production environments
// No SMTP blocking issues, perfect for hackathons!

import fetch from 'node-fetch';

// EmailJS Configuration (Free service, no blocking)
const EMAILJS_CONFIG = {
  serviceId: 'service_hackathon', // You'll get this from EmailJS
  templateId: 'template_otp',     // You'll create this template
  publicKey: 'your_public_key',   // From EmailJS dashboard
  privateKey: 'your_private_key', // From EmailJS dashboard
};

// ✅ Send OTP using EmailJS (bypasses all SMTP blocks)
export const sendOtpViaEmailJS = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP via EmailJS to ${email}...`);
    
    const emailData = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      accessToken: EMAILJS_CONFIG.privateKey,
      template_params: {
        to_email: email,
        otp_code: otp,
        app_name: 'OFPRS',
        message: `Your OTP for OFPRS login is: ${otp}. Valid for 5 minutes.`
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log(`✅ OTP sent successfully via EmailJS to ${email}`);
      return { success: true, service: 'EmailJS' };
    } else {
      throw new Error(`EmailJS failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ EmailJS failed:', error.message);
    throw error;
  }
};

// ✅ Alternative: Use Brevo (formerly SendinBlue) - Free tier
export const sendOtpViaBrevo = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP via Brevo to ${email}...`);
    
    const brevoData = {
      sender: { email: 'noreply@ofprs.com', name: 'OFPRS Portal' },
      to: [{ email: email }],
      subject: '🔐 Your OTP Code - OFPRS Login',
      htmlContent: `
        <div style="font-family:Arial;padding:20px;max-width:600px;">
          <h2 style="color:#1976d2;">🔐 OFPRS Login Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <div style="background:#f0f8ff;padding:20px;text-align:center;border-radius:8px;margin:20px 0;">
            <h1 style="color:#1976d2;font-size:36px;margin:0;">${otp}</h1>
          </div>
          <p><strong>This OTP is valid for 5 minutes only.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color:#666;font-size:12px;">OFPRS - Online Fee Payment System</p>
        </div>
      `
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || 'your-brevo-api-key'
      },
      body: JSON.stringify(brevoData)
    });

    if (response.ok) {
      console.log(`✅ OTP sent successfully via Brevo to ${email}`);
      return { success: true, service: 'Brevo' };
    } else {
      throw new Error(`Brevo failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Brevo failed:', error.message);
    throw error;
  }
};

// ✅ Alternative: Use Resend (Modern email API)
export const sendOtpViaResend = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP via Resend to ${email}...`);
    
    const resendData = {
      from: 'OFPRS Portal <noreply@yourdomain.com>',
      to: [email],
      subject: '🔐 Your OTP Code - OFPRS Login',
      html: `
        <div style="font-family:Arial;padding:20px;max-width:600px;">
          <h2 style="color:#1976d2;">🔐 OFPRS Login Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <div style="background:#f0f8ff;padding:20px;text-align:center;border-radius:8px;margin:20px 0;">
            <h1 style="color:#1976d2;font-size:36px;margin:0;">${otp}</h1>
          </div>
          <p><strong>This OTP is valid for 5 minutes only.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color:#666;font-size:12px;">OFPRS - Online Fee Payment System</p>
        </div>
      `
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 'your-resend-api-key'}`
      },
      body: JSON.stringify(resendData)
    });

    if (response.ok) {
      console.log(`✅ OTP sent successfully via Resend to ${email}`);
      return { success: true, service: 'Resend' };
    } else {
      throw new Error(`Resend failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Resend failed:', error.message);
    throw error;
  }
};
