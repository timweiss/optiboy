import ksuid from 'ksuid';
import nodemailer from 'nodemailer';
import {createEntry, EmailEntry, getEntryForConfirmationKey, getEntryForEmail, updateEntry} from './db';
import config from './util/config';

export const submitEmail = async (email: string, referrer: string) => {
  // check if the email already exists, do nothing then
  const existing = await getEntryForEmail(email);
  if (existing) { return; }

  // generate confirmation key
  const key = await ksuid.random();
  // create a new entry
  const entry: Partial<EmailEntry> = {
    email,
    source: referrer,
    confirmed: false,
    confirmationKey: key.string,
  };

  const newEntry = await createEntry(entry);

  await sendConfirmationMail(newEntry.email, newEntry.confirmationKey!);
};

export const confirmEmail = async (confirmationKey: string) => {
  const entry = await getEntryForConfirmationKey(confirmationKey);
  if (!entry) {
    throw new Error('No such key');
  }

  entry.confirmed = true;
  entry.confirmationKey = null;
  entry.updatedAt = new Date();

  await updateEntry(entry);

  return entry;
};



const sendConfirmationMail = async (email: string, confirmationKey: string) => {
  const url = `${config.hostname}/confirm/${confirmationKey}`;

  const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    auth: {
      user: config.email.smtp.user,
      pass: config.email.smtp.password
    }
  });

  const html = `
    <style>
     h1 {
        font-size: 1.5rem;
     }
    </style>
    <h1>Please confirm your email</h1>
    <p>Click <a href="${url}">here</a> to confirm your email address.</p>
    <p>If you cannot click this link, you can copy and paste <pre>${url}</pre> into your browser.</p>
  `;

  await transporter.sendMail({
    from: {
      name: config.email.sender.name,
      address: config.email.sender.email
    },
    to: email,
    subject: 'Confirm your email address',
    html
  });
};