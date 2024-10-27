import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

import { env } from "../config/environment";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || "587"),
    auth: {
      user: env.SMTP_AUTH_USER,
      pass: env.SMTP_AUTH_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../mails", template);

  // Render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: env.SMTP_AUTH_USER,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
