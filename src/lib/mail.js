import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

/**
 * Returns a nodemailer transport if SMTP config is present,
 * otherwise returns null for mock fallback.
 */
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Renders the HTML email template.
 */
function renderOrderEmailHtml({
  userName,
  displayId,
  product,
  customization,
  sizing,
  pricing,
  paymentMethod,
  paymentDivision,
  orderUrl,
}) {
  // Sizing Breakdown HTML
  let sizingRowsHtml = '';
  if (sizing && sizing.breakdown) {
    if (sizing.mode === 'standard') {
      Object.entries(sizing.breakdown).forEach(([size, qty]) => {
        if (qty > 0) {
          sizingRowsHtml += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: 600; color: #334155; font-size: 14px;">${size}</td>
              <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #0f172a; font-size: 14px;">${qty}</td>
            </tr>
          `;
        }
      });
    } else if (Array.isArray(sizing.breakdown)) {
      sizing.breakdown.forEach((item) => {
        if (item.qty > 0) {
          sizingRowsHtml += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: 600; color: #334155; font-size: 14px;">${item.name || 'Custom'}</td>
              <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #0f172a; font-size: 14px;">${item.qty}</td>
            </tr>
          `;
        }
      });
    }
  }

  // Branding Customization HTML
  let brandingHtml = '';
  if (customization && customization.enabled) {
    brandingHtml = `
      <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Branding & Customization</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #475569; font-weight: 500;">Branding Method:</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${customization.format || 'N/A'}</td>
          </tr>
          ${customization.notes ? `
          <tr>
            <td colspan="2" style="padding: 8px 0 0 0; border-top: 1px dashed #e2e8f0; font-size: 12px; color: #475569; line-height: 1.5;">
              <strong style="color: #334155;">Design/Production Notes:</strong><br/>
              ${customization.notes}
            </td>
          </tr>
          ` : ''}
        </table>
      </div>
    `;
  }

  // Pricing calculations
  const totalAmount = pricing?.totalWithFees || pricing?.subtotal || 0;
  let amountDueNow = totalAmount;
  let divisionLabel = 'Full Payment';
  
  if (paymentDivision === 'split') {
    amountDueNow = totalAmount * 0.5;
    divisionLabel = '50/50 Split Deposit (50% Due Now)';
  } else if (paymentDivision === 'split_30_40_30') {
    amountDueNow = totalAmount * 0.3;
    divisionLabel = '30% Deposit / 40% Mid / 30% Completion';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${displayId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table style="width: 100%; border-collapse: collapse; background-color: #f1f5f9; padding: 40px 0;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em; text-transform: uppercase;">FactoryFlow</h1>
              <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 600; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em;">Order Confirmation</p>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Hi ${userName},</h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Your manufacturing request has been successfully initialized. Below you'll find the detailed breakdown of your order configurations and pricing schedule. Our design team will begin preparing your Tech Pack shortly.
              </p>
              
              <!-- Order Info Badge -->
              <div style="display: inline-block; padding: 8px 14px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9999px; font-size: 13px; font-weight: 700; color: #2563eb; margin-bottom: 24px;">
                Order Ref: ${displayId}
              </div>

              <!-- Product Details Card -->
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Product Configuration</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #fafafa; border-bottom: 1px solid #e2e8f0;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        ${product.image ? `
                        <td style="width: 80px; padding-right: 16px;" valign="top">
                          <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;" />
                        </td>
                        ` : ''}
                        <td valign="middle">
                          <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #0f172a;">${product.name}</h4>
                          <p style="margin: 0 0 6px 0; font-size: 12px; font-family: monospace; color: #64748b;">SKU: ${product.sku || 'N/A'}</p>
                          <span style="display: inline-block; padding: 2px 8px; background-color: #f1f5f9; border-radius: 4px; font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase;">
                            Color: ${product.color || 'Custom'}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Sizing Table -->
              ${sizingRowsHtml ? `
              <h3 style="margin: 24px 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Size Breakdown (${sizing.totalUnits || 0} Total Units)</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Size / Fit</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  ${sizingRowsHtml}
                </tbody>
              </table>
              ` : ''}

              <!-- Branding Customization -->
              ${brandingHtml}

              <!-- Pricing & Payment Schedule -->
              <h3 style="margin: 32px 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Pricing & Payment Schedule</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; color: #475569;">Unit Price:</td>
                  <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #0f172a;">$${pricing?.unitPrice?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; color: #475569;">Subtotal (${sizing?.totalUnits || 0} units):</td>
                  <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #0f172a;">$${pricing?.subtotal?.toFixed(2) || '0.00'}</td>
                </tr>
                ${pricing?.transferFee > 0 ? `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; color: #475569;">Payment Transfer Fees:</td>
                  <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #0f172a;">$${pricing.transferFee.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr style="background-color: #fafafa; border-bottom: 2px solid #e2e8f0;">
                  <td style="padding: 14px 16px; font-weight: 700; color: #0f172a;">Grand Total:</td>
                  <td style="padding: 14px 16px; text-align: right; font-weight: 800; color: #0f172a; font-size: 16px;">$${totalAmount.toFixed(2)}</td>
                </tr>
              </table>

              <!-- Payment Milestones -->
              <div style="margin-bottom: 32px; padding: 16px; border: 1px solid #bfdbfe; background-color: #eff6ff; border-radius: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 4px 0; color: #1e40af; font-weight: 600;">Payment Method:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #1e3a8a;">${paymentMethod || 'Wire Transfer'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #1e40af; font-weight: 600;">Schedule:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #1e3a8a;">${divisionLabel}</td>
                  </tr>
                  <tr style="border-top: 1px solid #bfdbfe; margin-top: 8px;">
                    <td style="padding: 12px 0 0 0; color: #1e40af; font-weight: 800; font-size: 16px;">Amount Due Now:</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-weight: 900; color: #1d4ed8; font-size: 18px;">$${amountDueNow.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              ${orderUrl ? `
              <div style="text-align: center; margin: 36px 0 16px 0;">
                <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); font-size: 14px; text-transform: uppercase; letter-spacing: 0.025em;">
                  Track Order Status
                </a>
              </div>
              ` : ''}

            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f1f5f9; padding: 32px 40px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">FactoryFlow Manufacturing Portal</p>
              <p style="margin: 0 0 16px 0;">This email is an automated confirmation of your order configurations. If you have any customization changes, please contact your account representative immediately.</p>
              <p style="margin: 0;">&copy; 2026 FactoryFlow. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Main email sending function.
 */
export async function sendOrderConfirmationEmail({
  recipientEmail,
  userName,
  displayId,
  product,
  customization,
  sizing,
  pricing,
  paymentMethod,
  paymentDivision,
  orderUrl,
}) {
  const to = recipientEmail;
  const subject = `Order Confirmed: ${displayId} - ${product?.name || ''}`;
  const htmlContent = renderOrderEmailHtml({
    userName: userName || 'Customer',
    displayId,
    product: product || {},
    customization: customization || {},
    sizing: sizing || {},
    pricing: pricing || {},
    paymentMethod,
    paymentDivision,
    orderUrl,
  });

  const transporter = getMailTransporter();
  const from = process.env.SMTP_FROM || 'FactoryFlow Orders <orders@factoryflow.com>';

  if (!transporter) {
    // FALLBACK LOGGING FOR LOCAL DEVELOPMENT
    const logDir = path.join(process.cwd(), 'src', 'app', 'api', 'orders');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFilePath = path.join(logDir, 'mock-emails.log');
    const logMessage = `
========================================
[MOCK EMAIL SENT]
Timestamp: ${new Date().toISOString()}
To: ${to}
From: ${from}
Subject: ${subject}
Order Link: ${orderUrl || 'N/A'}
HTML Snippet: See below or render in browser
========================================
${htmlContent}
\n\n`;

    fs.appendFileSync(logFilePath, logMessage, 'utf8');

    console.log('\n--------------------------------------------------------------');
    console.log(`[MAIL MOCK] SMTP configuration not set in .env.local.`);
    console.log(`Email details for ${displayId} logged to: src/app/api/orders/mock-emails.log`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('--------------------------------------------------------------\n');

    return {
      success: true,
      messageId: `mock-id-${Date.now()}`,
      mocked: true,
    };
  }

  // Actual SMTP sending
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`[MAIL SUCCESS] Order email sent to ${to}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      mocked: false,
    };
  } catch (err) {
    console.error(`[MAIL ERROR] Failed to send order email to ${to}:`, err);
    throw err;
  }
}
