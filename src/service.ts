import ksuid from 'ksuid';
import {
  createEntry,
  EmailEntry,
  getAllConfirmedEntries,
  getEntryForConfirmationKey,
  getEntryForEmail,
  updateEntry
} from './db';
import config from './util/config';
import {sendMail} from './util/email';
import {confirmationEmail, emailNotification} from './html';
import {NotFoundError} from "./util/errors";

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

export const upsertConfirmedEntry = async (email: string, source: string) => {
  const existing = await getEntryForEmail(email);
  if (existing) {
    existing.source = existing.source || source;
    existing.updatedAt = new Date();
    existing.confirmed = true;
    return updateEntry(existing);
  }

  const entry: Partial<EmailEntry> = {
    email,
    source,
    confirmed: true,
    confirmationKey: null,
  };

  const created = await createEntry(entry);
  entry.id = created.id;
  entry.updatedAt = new Date();

  return updateEntry(entry as EmailEntry);
};

export const confirmedEntries = async () => {
  return getAllConfirmedEntries().then(e => e.map(e => {
    return {
      email: e.email,
      source: e.source,
      createdAt: e.createdAt
    }
  }));
};

export const checkEntry = async (email: string) => {
  const entry = await getEntryForEmail(email);
  if (!entry) {
    throw new NotFoundError(email);
  }
  return {
    email: entry.email,
    source: entry.source,
    createdAt: entry.createdAt
  };
};

const sendConfirmationMail = async (email: string, confirmationKey: string) => {
  const url = `${config.hostname}/confirm/${confirmationKey}`;
  const html = await confirmationEmail(url);

  await sendMail(email, 'Please confirm your email', html);
};

const sendNotificationMail = async (email: string, source: string) => {
  if (!config.email.notificationRecipient) { return }

  const html = emailNotification(email, source);
  await sendMail(config.email.notificationRecipient, 'New Email Signed Up', html);
};