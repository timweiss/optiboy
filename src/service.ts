import ksuid from 'ksuid';
import nodemailer from 'nodemailer';
import {createEntry, EmailEntry, getEntryForConfirmationKey, getEntryForEmail, updateEntry} from './db';
import config from './util/config';
import {sendMail} from './util/email';
import {emailNotification} from './html';

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

  await sendNotificationMail(entry.email, entry.source!);

  return entry;
};


const sendConfirmationMail = async (email: string, confirmationKey: string) => {
  const url = `${config.hostname}/confirm/${confirmationKey}`;
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

  await sendMail(email, 'Please confirm your email', html);
};

const sendNotificationMail = async (email: string, source: string) => {
  if (!config.email.notificationRecipient) { return }

  const html = emailNotification(email, source);
  await sendMail(config.email.notificationRecipient, 'New Email Signed Up', html);
};