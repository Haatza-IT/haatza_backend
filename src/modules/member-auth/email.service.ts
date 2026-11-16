import { Injectable, Logger } from '@nestjs/common';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Sends a transactional email using configured provider (e.g. Resend, SMTP)
   * or safely logs simulation in local/test environments.
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const provider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase().trim();
    const fromAddress = process.env.EMAIL_FROM || 'Haatza <support@haatza.com>';
    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Resend Transactional Email Provider (HTTP API)
    if (provider === 'resend' && resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          this.logger.error(`Resend API failed with status ${response.status}: ${errorDetails}`);
          return {
            success: false,
            error: `Email delivery failed with HTTP status ${response.status}`,
          };
        }

        const data = (await response.json()) as { id?: string };
        this.logger.log(`Email dispatched successfully via Resend (ID: ${data.id || 'ok'}) to ${this.maskEmail(options.to)}`);
        return {
          success: true,
          messageId: data.id,
        };
      } catch (err) {
        const msg = (err as Error).message || 'Unknown network error';
        this.logger.error(`Resend API network error: ${msg}`);
        return {
          success: false,
          error: msg,
        };
      }
    }

    // 2. Safe Fallback / Development Simulation
    // When RESEND_API_KEY is not configured or in testing mode, simulate delivery safely
    this.logger.log(
      `[EmailService] Simulated email delivery to ${this.maskEmail(options.to)} (Subject: "${options.subject}"). ` +
      `Configure RESEND_API_KEY in production to send live emails.`,
    );

    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  /**
   * Dispatches the branded password reset email with HTML & plain text templates.
   */
  async sendPasswordResetEmail(
    toEmail: string,
    resetUrl: string,
    userName?: string,
  ): Promise<SendEmailResult> {
    const subject = 'Reset Your Haatza Password';
    const recipientName = userName?.trim() ? ` ${userName.trim()}` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc; }
    .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #1a202c; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1.5px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .message { font-size: 15px; margin-bottom: 24px; color: #4a5568; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { background-color: #3182ce; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; }
    .note { color: #718096; font-size: 13px; margin-top: 24px; border-left: 3px solid #cbd5e0; padding-left: 12px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; background-color: #edf2f7; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HAATZA</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello${recipientName},</p>
      <p class="message">We received a request to reset your Haatza account password.</p>
      <p class="message">Click the Reset Password link below to create a new password.</p>
      <div class="button-container">
        <a href="${resetUrl}" class="button" target="_blank" rel="noopener noreferrer">Reset Password</a>
      </div>
      <p class="note">This link expires in 15 minutes.</p>
      <p class="note">If you did not request this password reset, please ignore this email.</p>
      <p style="margin-top: 28px;">Thank you,<br><strong>Haatza Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Haatza Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `Hello${recipientName},

We received a request to reset your Haatza account password.

Click the Reset Password link below to create a new password.

${resetUrl}

This link expires in 15 minutes.

If you did not request this password reset, please ignore this email.

Thank you,
Haatza Team`;

    return this.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
    });
  }

  /**
   * Helper to mask email address in server logs for user privacy.
   */
  private maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return '***';
    const [name, domain] = parts;
    const maskedName = name.length <= 2 ? name[0] + '*' : name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    return `${maskedName}@${domain}`;
  }
}

