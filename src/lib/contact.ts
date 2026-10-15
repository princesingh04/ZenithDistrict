import { Resend } from 'resend';
import { ContactFormData, BrandWaitlistData } from './validations';

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  referenceId?: string;
  error?: string;
}

function isSafeWebhookUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    const isDev = process.env.NODE_ENV !== 'production';

    // Must be HTTPS in production; allow HTTP only for localhost in development
    if (url.protocol !== 'https:') {
      if (isDev && url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
        return true;
      }
      return false;
    }

    // Defense-in-depth: Block known internal/metadata domains and IP addresses
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === '169.254.169.254' || // AWS/GCP/Azure instance metadata
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname === 'metadata.google.internal'
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Pluggable contact adapter for ZenithDistrict.
 */
export async function submitContactInquiry(
  data: ContactFormData
): Promise<ContactSubmissionResult> {
  const referenceId = `ZD-${Date.now().toString(36).toUpperCase()}`;

  // Log incoming inquiry with operational metadata
  console.info(`[ZenithDistrict::ContactAdapter] New submission received:`, {
    referenceId,
    inquiryType: data.inquiryType,
    name: data.name,
    email: data.email,
    company: data.company || 'N/A',
    budget: data.budget || 'Not specified',
    messageLength: data.message.length,
    timestamp: new Date().toISOString(),
  });

  // 1. Resend email dispatch
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const toEmail = process.env.RESEND_TO_EMAIL || 'zenithdistrict14@gmail.com';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `[ZenithDistrict // ${data.inquiryType}] ${data.name} (${referenceId})`,
        text: `NEW INQUIRY DISPATCH // ${referenceId}\n\n` +
          `Category: ${data.inquiryType}\n` +
          `Sender: ${data.name} <${data.email}>\n` +
          `Company / Venture: ${data.company || 'N/A'}\n` +
          `Budget Scope: ${data.budget || 'Not specified'}\n\n` +
          `Project Brief / Message:\n${data.message}\n\n` +
          `Timestamp: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #27272a; background: #09090b; color: #f4f4f5; border-radius: 4px;">
            <div style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 20px;">
              <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.1em; color: #71717a; text-transform: uppercase;">ZENITHDISTRICT // DISPATCH ${referenceId}</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 600; color: #ffffff;">New ${data.inquiryType} Inquiry</h2>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #71717a; width: 140px; font-family: monospace; font-size: 11px;">NAME / ORG:</td>
                <td style="padding: 6px 0; color: #ffffff; font-weight: 500;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-family: monospace; font-size: 11px;">EMAIL:</td>
                <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #38bdf8; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-family: monospace; font-size: 11px;">COMPANY:</td>
                <td style="padding: 6px 0; color: #d4d4d8;">${data.company || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-family: monospace; font-size: 11px;">BUDGET SCOPE:</td>
                <td style="padding: 6px 0; color: #d4d4d8;">${data.budget || 'Not specified'}</td>
              </tr>
            </table>

            <div style="background: #18181b; border-left: 2px solid #ffffff; padding: 16px; margin-bottom: 24px; border-radius: 2px;">
              <div style="font-family: monospace; font-size: 11px; color: #71717a; margin-bottom: 8px; text-transform: uppercase;">Project Brief / Message:</div>
              <div style="margin: 0; line-height: 1.6; color: #f4f4f5; white-space: pre-wrap; font-size: 14px;">${data.message}</div>
            </div>

            <div style="border-top: 1px solid #27272a; padding-top: 16px; font-family: monospace; font-size: 11px; color: #52525b; text-align: center;">
              Hit reply directly to respond to ${data.name} (${data.email})
            </div>
          </div>
        `,
      });
      console.info(`[ZenithDistrict::ContactAdapter] Resend email dispatched for ${referenceId}`);
    } catch (err) {
      console.error('[ZenithDistrict::ContactAdapter] Resend email dispatch failed:', err);
    }
  }

  // 2. Outbound webhook dispatcher with SSRF and timeout guards
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl && isSafeWebhookUrl(webhookUrl)) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId, ...data }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error('[ZenithDistrict::ContactAdapter] Webhook dispatch failed:', err);
    }
  }

  return {
    success: true,
    message: 'Your inquiry has been logged. We review every note directly and respond within 24–48 hours.',
    referenceId,
  };
}

/**
 * Brand Waitlist submission handler
 * Records early sampling interest for Collection 01 on-demand pieces.
 */
export async function submitBrandWaitlist(
  data: BrandWaitlistData
): Promise<ContactSubmissionResult> {
  const referenceId = `WAIT-${Date.now().toString(36).toUpperCase()}`;

  console.info(`[ZenithDistrict::BrandWaitlist] New entry received:`, {
    referenceId,
    email: data.email,
    productSlug: data.productSlug || 'collection-general',
    colorway: data.colorway || 'any',
    size: data.size || 'any',
    timestamp: new Date().toISOString(),
  });

  // Resend email notification
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const toEmail = process.env.RESEND_TO_EMAIL || 'zenithdistrict14@gmail.com';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `[ZenithDistrict Waitlist] ${data.email} registered for ${data.productSlug || 'Collection 01'}`,
        text: `BRAND WAITLIST ENTRY // ${referenceId}\n\n` +
          `Email: ${data.email}\n` +
          `Product: ${data.productSlug || 'Collection 01'}\n` +
          `Colorway: ${data.colorway || 'any'}\n` +
          `Size: ${data.size || 'any'}\n` +
          `Timestamp: ${new Date().toISOString()}`,
      });
      console.info(`[ZenithDistrict::BrandWaitlist] Resend email dispatched for ${referenceId}`);
    } catch (err) {
      console.error('[ZenithDistrict::BrandWaitlist] Resend email dispatch failed:', err);
    }
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl && isSafeWebhookUrl(webhookUrl)) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brand-waitlist',
          referenceId,
          ...data,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error('[ZenithDistrict::BrandWaitlist] Webhook dispatch failed:', err);
    }
  }

  return {
    success: true,
    message: 'You have been recorded on the Collection 01 registry. We notify only when physical pieces are ready for sampling.',
    referenceId,
  };
}
