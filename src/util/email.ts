import config from './config';
import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, content: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    auth: {
      user: config.email.smtp.user,
      pass: config.email.smtp.password
    }
  });

  await transporter.sendMail({
    from: {
      name: config.email.sender.name,
      address: config.email.sender.email
    },
    to: to,
    subject,
    html: content
  });
};