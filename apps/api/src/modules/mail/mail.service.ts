import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    if (process.env.MAIL_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT) || 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    } else {
      // Create a test account for local development
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log('Ethereal mock email transport created.');
    }
  }

  async sendOrderStatusUpdate(email: string, orderNumber: string, status: string, trackingNumber?: string, carrier?: string) {
    const subject = `Order ${orderNumber} Status Update: ${status}`;
    let html = `<h1>Your Order ${orderNumber}</h1>`;
    html += `<p>Your order status is now: <strong>${status}</strong></p>`;

    if (trackingNumber) {
      html += `<p>Tracking Number: <strong>${trackingNumber}</strong></p>`;
      if (carrier) {
        html += `<p>Carrier: <strong>${carrier}</strong></p>`;
      }
    }

    html += `<p>Thank you for shopping with Noeve!</p>`;

    await this.sendMail(email, subject, html);
  }

  async sendOrderConfirmation(email: string, orderNumber: string, totalAmount: string) {
    const subject = `Order Confirmation: ${orderNumber}`;
    const html = `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>${orderNumber}</strong> has been successfully placed.</p>
      <p>Total amount: <strong>${totalAmount}</strong></p>
      <p>We will notify you once it ships.</p>
      <p>Thank you for shopping with Noeve!</p>
    `;

    await this.sendMail(email, subject, html);
  }

  async sendNewsletterWelcome(email: string) {
    const subject = `Welcome to the Noeve Journal`;
    const html = `
      <h1>Welcome to Noeve!</h1>
      <p>Thank you for subscribing to our journal.</p>
      <p>You'll now receive first access to new drops, early entry to sales, and a short note from our studio.</p>
      <p>We are excited to have you with us.</p>
      <br>
      <p>Best regards,</p>
      <p><strong>The Noeve Studio</strong></p>
    `;

    await this.sendMail(email, subject, html);
  }

  async sendMarketingCampaign(emails: string[], subject: string, html: string) {
    if (!this.transporter && process.env.NODE_ENV !== 'test') {
      this.logger.warn('Transporter not initialized yet. Skipping campaign email.');
      return;
    }

    const from = process.env.MAIL_FROM || '"Noeve Store" <noreply@noeve.store>';

    // Send emails concurrently or in batches.
    // For a real production app, we would use a queue system (BullMQ) or a transactional email API (SendGrid, Postmark).
    // Here we use Promise.all for simplicity.
    await Promise.all(
      emails.map(async (email) => {
        try {
          if (process.env.NODE_ENV === 'test') {
            this.logger.log(`[Mock Campaign Email] To: ${email} | Subject: ${subject}`);
            return;
          }
          
          const info = await this.transporter!.sendMail({
            from,
            to: email,
            subject,
            html,
          });
          
          this.logger.log(`Campaign email sent to ${email}: ${info.messageId}`);
        } catch (error) {
          this.logger.error(`Failed to send campaign email to ${email}:`, error);
        }
      })
    );
  }

  private async sendMail(to: string, subject: string, html: string) {
    try {
      if (process.env.NODE_ENV === 'test') {
        this.logger.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
        return;
      }
      
      if (!this.transporter) {
        this.logger.warn('Transporter not initialized yet. Skipping email.');
        return;
      }

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Noeve Store" <noreply@noeve.store>',
        to,
        subject,
        html,
      });
      
      this.logger.log(`Email sent: ${info.messageId}`);
      if (!process.env.MAIL_HOST) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
    }
  }
}
