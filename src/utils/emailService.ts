import emailjs from '@emailjs/browser';
import { StoreSettings } from '../types';

export interface SendOtpParams {
  toEmail: string;
  toName: string;
  otpCode: string;
  settings: StoreSettings;
}

/**
 * Sends OTP verification code directly to user's real email inbox using EmailJS.
 */
export const sendVerificationEmail = async ({
  toEmail,
  toName,
  otpCode,
  settings,
}: SendOtpParams): Promise<{ success: boolean; message: string; isSimulated?: boolean }> => {
  const serviceId = settings.emailJsServiceId?.trim();
  const templateId = settings.emailJsTemplateId?.trim();
  const publicKey = settings.emailJsPublicKey?.trim();

  // If EmailJS credentials are provided, send real live email via Gmail service
  if (serviceId && templateId && publicKey) {
    try {
      const templateParams = {
        to_email: toEmail,
        to_name: toName || 'Valued Customer',
        otp_code: otpCode,
        store_name: settings.storeName || 'Royal Stepz Zone Qatar',
        support_email: settings.supportEmail || 'support@royalstepz-zone.qa',
        whatsapp_hotline: settings.whatsappNumber || '+974 5555 1234',
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      if (response.status === 200) {
        return {
          success: true,
          message: `Verification code sent to ${toEmail}!`,
        };
      } else {
        return {
          success: false,
          message: `EmailJS responded with status: ${response.status}`,
        };
      }
    } catch (err: any) {
      console.error('EmailJS direct send error:', err);
      return {
        success: false,
        message: err?.text || err?.message || 'Failed to dispatch email via EmailJS.',
      };
    }
  }

  // Fallback if keys are not configured yet
  return {
    success: false,
    isSimulated: true,
    message: `ইমেইল সার্ভিস এখনও যুক্ত করা হয়নি। অনুগ্রহ করে এডমিন ড্যাশবোর্ডে EmailJS Keys সেভ করুন।`,
  };
};
