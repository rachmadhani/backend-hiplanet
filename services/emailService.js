const nodemailer = require('nodemailer');

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

    const body =
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

    try {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Sean Beck'}" <${process.env.FROM_EMAIL || 'hello@ecosoftgame.com'}>`,
        to: `"${toName}" <${toEmail}>`,
        replyTo: process.env.REPLY_TO || 'hello@ecosoftgame.com',
        subject,
        text: body
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
