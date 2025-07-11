import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  from?: string;
  subject: string;
  html: string;
}

export const emailService = {
  send: async ({
    to,
    from = "Marketplace <noreply@marketplace.com>",
    subject,
    html,
  }: SendEmailParams) => {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        console.error("Email error:", error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Failed to send email:", err);
      throw err;
    }
  },
};
