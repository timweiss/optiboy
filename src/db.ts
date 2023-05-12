import pool from './util/pool';

export interface EmailEntry {
  id: number;
  email: string;
  source: string;
  confirmed: boolean;
  confirmationKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const rowToEntry = (row: any): EmailEntry => {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    confirmed: row.confirmed,
    confirmationKey: row.confirmation_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  } as EmailEntry;
};

export const getEntryForEmail = async (email: string): Promise<EmailEntry | null> => {
  const result = await pool.query('SELECT * FROM entries WHERE email ilike ($1)', [email]);
  if (result.rows.length === 0) {
    return null;
  }

  return rowToEntry(result.rows[0]);
};

export const getEntryForConfirmationKey = async (confirmationKey: string): Promise<EmailEntry | null> => {
  const result = await pool.query('SELECT * FROM entries WHERE confirmation_key = ($1)', [confirmationKey]);
  if (result.rows.length === 0) {
    return null;
  }

  return rowToEntry(result.rows[0]);
};

export const updateEntry = async (entry: EmailEntry) => {
  await pool.query('UPDATE entries SET confirmed = ($1), confirmation_key = ($2) WHERE id = ($3)', [entry.confirmed, entry.confirmationKey, entry.id]);
};

export const createEntry = async (entry: Partial<EmailEntry>) => {
  const result = await pool.query('INSERT INTO entries (email, source, confirmation_key) VALUES ($1, $2, $3) RETURNING *', [entry.email, entry.source, entry.confirmationKey]);
  return rowToEntry(result.rows[0]);
};