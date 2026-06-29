import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  // 🔑 Pull your credentials dynamically when called
  const smtpEmail = process.env.SMTP_EMAIL;     // Your analyticscircleindia@gmail.com
  const smtpPassword = process.env.SMTP_PASSWORD;  // Your 16-character Google App Password

  if (!smtpEmail || !smtpPassword) {
    throw new Error("Missing SMTP_EMAIL or SMTP_PASSWORD in your environment configuration.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const mailOptions = {
    // 🎯 This safely satisfies Gmail's DMARC policy because it runs through official Google SMTP servers
    from: `"AnalyticsCircle" <${smtpEmail}>`,
    to: email,
    subject: "Your Login OTP - AnalyticsCircle",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a;">AnalyticsCircle Verification</h2>
        <p style="color: #475569; font-size: 16px;">To complete your login, please use the One-Time Password (OTP) below:</p>
        <div style="margin: 24px 0; padding: 20px; text-align: center; background-color: #f8fafc; border: 2px dashed #3b82f6; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email dispatched successfully via Gmail SMTP: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Gmail SMTP sending execution failure:", error);
    throw error;
  }
};