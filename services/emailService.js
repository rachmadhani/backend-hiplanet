const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration on startup
transporter.verify((error) => {
  if (error) {
    console.warn('⚠ SMTP not verified:', error.message);
  } else {
    console.log('✓ SMTP ready');
  }
});

class EmailService {
  async sendWelcomeEmail(toEmail, toName) {
    const subject = `You're in - ${process.env.GAME_NAME || 'Hi Planet'} Closed Beta Build`;

    // Plain text version (fallback)
    const textBody =
      `Hi ${toName},

You're approved for ${process.env.GAME_NAME || 'Hi Planet'}'s closed beta. Welcome aboard.

==============================
DOWNLOAD THE BUILD
==============================
${process.env.DOWNLOAD_URL || ''}

(Windows 10+ / macOS 12+)

==============================
WHAT TO DO
==============================
1. Download & install
2. Play for ~2-4 hours
3. Send feedback - just reply to this email with any bugs, thoughts, or moments that surprised you

==============================
REMINDERS
==============================
- No public videos/screenshots until the ${process.env.LAUNCH_DATE || ''} launch
- New builds every 2-3 weeks - we'll email you when ready
- Active testers get a free Steam key at launch
- Questions? Just reply to this email

Thanks for helping shape ${process.env.GAME_NAME || 'Hi Planet'}.

- Sean Beck
  Writer / Creator
  Ecosoft Interactive
  ${process.env.SITE_URL || ''}
`;

    // HTML version (premium style with inline embedded bottom banner)
    const htmlBody = `
<div style="font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">Hi ${toName},</p>
  
  <p style="font-size: 15px; margin-bottom: 20px;">You're approved for <strong>${process.env.GAME_NAME || 'Hi Planet'}</strong>'s closed beta. Welcome aboard!</p>
  
  <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #ff6b35; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">Download the Build</h3>
    <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">(Available for Windows 10+ / macOS 12+)</p>
    <a href="${process.env.DOWNLOAD_URL || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #ff6b35; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(255, 107, 53, 0.2);">▶ Download Closed Beta Build</a>
  </div>
  
  <div style="margin-bottom: 25px;">
    <h3 style="color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; margin-top: 0;">What To Do</h3>
    <ol style="padding-left: 20px; font-size: 14px; margin: 0;">
      <li style="margin-bottom: 8px;">Download and install the game.</li>
      <li style="margin-bottom: 8px;">Play for roughly 2-4 hours.</li>
      <li style="margin-bottom: 8px;">Send feedback - just reply to this email with any bugs, thoughts, or moments that surprised you!</li>
    </ol>
  </div>
  
  <div style="margin-bottom: 30px;">
    <h3 style="color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; margin-top: 0;">Reminders</h3>
    <ul style="padding-left: 20px; font-size: 14px; margin: 0; list-style-type: square;">
      <li style="margin-bottom: 6px;">No public videos, screenshots, or streams until the <strong>${process.env.LAUNCH_DATE || ''}</strong> launch.</li>
      <li style="margin-bottom: 6px;">New builds are pushed every 2-3 weeks. We'll email you when they're ready.</li>
      <li style="margin-bottom: 6px;">Active testers will receive a free Steam key at launch!</li>
      <li style="margin-bottom: 6px;">Have questions? Simply reply directly to this email.</li>
    </ul>
  </div>
  
  <p style="font-size: 14px; margin-bottom: 25px;">Thanks for helping shape <strong>${process.env.GAME_NAME || 'Hi Planet'}</strong>.</p>
  
  <div style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-bottom: 25px;">
    <strong>Sean Beck</strong><br />
    Writer / Creator<br />
    Ecosoft Interactive<br />
    <a href="${process.env.SITE_URL || '#'}" style="color: #3b82f6; text-decoration: none;">${process.env.SITE_URL || ''}</a>
  </div>
  
  <div style="text-align: center; margin-top: 25px;">
    <img src="cid:email_banner_bottom" alt="Hi Planet Banner" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;" />
  </div>
</div>
`;

    try {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Sean Beck'}" <${process.env.FROM_EMAIL || 'hello@ecosoftgame.com'}>`,
        to: `"${toName}" <${toEmail}>`,
        replyTo: process.env.REPLY_TO || 'hello@ecosoftgame.com',
        subject,
        text: textBody,
        html: htmlBody,
        attachments: [
          {
            filename: 'email_banner_bottom.png',
            path: path.join(__dirname, '../public/email/email_banner_bottom.png'),
            cid: 'email_banner_bottom'
          }
        ]
      });
      console.log(`✓ Welcome email sent successfully to ${toEmail}`);
      return true;
    } catch (err) {
      console.error('Mail send failed:', err.message);
      return false;
    }
  }
}

module.exports = new EmailService();
