import { Injectable, Logger } from '@nestjs/common';

export interface Fast2SmsResponse {
  success: boolean;
  message: string;
  detail?: unknown;
}

@Injectable()
export class Fast2SmsService {
  private readonly logger = new Logger(Fast2SmsService.name);
  private readonly API_URL = 'https://www.fast2sms.com/dev/bulkV2';

  /**
   * Sends an OTP SMS using Fast2SMS DLT approved template.
   * Template: 198076
   * Sender ID: HAATZA
   *
   * @param phone 10-digit Indian phone number
   * @param otp 6-digit OTP code
   * @param mockOverride Optional flag to simulate delivery in automated tests
   */
  async sendOtpSms(phone: string, otp: string, mockOverride = false): Promise<Fast2SmsResponse> {
    const isMock = mockOverride || process.env.MOCK_SMS === 'true';

    if (isMock) {
      this.logger.log(`[Fast2SMS Mock Mode] Simulated sending OTP to phone: ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`);
      return {
        success: true,
        message: 'OTP Sent Successfully',
      };
    }

    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      this.logger.error('Fast2SMS API key (FAST2SMS_API_KEY) is missing in environment variables');
      return {
        success: false,
        message: 'SMS service configuration missing. Please configure FAST2SMS_API_KEY.',
      };
    }

    const senderId = process.env.FAST2SMS_SENDER_ID || 'HAATZA';
    const dltTemplateId = process.env.FAST2SMS_DLT_TEMPLATE_ID || '198076';
    const route = process.env.FAST2SMS_ROUTE || 'dlt';
    const flash = process.env.FAST2SMS_FLASH || '0';

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          authorization: apiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route,
          sender_id: senderId,
          message: dltTemplateId,
          variables_values: otp,
          numbers: phone,
          flash,
        }),
        signal: AbortSignal.timeout(5000), // 5s timeout prevents external API hanging
      });

      const data: any = await response.json().catch(() => ({}));

      if (response.ok && data && data.return === true) {
        this.logger.log(`OTP SMS dispatched successfully via Fast2SMS to ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`);
        return {
          success: true,
          message: 'OTP Sent Successfully',
          detail: data,
        };
      }

      this.logger.warn(`Fast2SMS rejected request: ${JSON.stringify(data?.message || data)}`);
      return {
        success: false,
        message: Array.isArray(data?.message) ? data.message[0] : (data?.message || 'Fast2SMS Error'),
        detail: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Network error connecting to Fast2SMS: ${errorMsg}`);
      return {
        success: false,
        message: 'SMS delivery failed due to network error',
      };
    }
  }
}

