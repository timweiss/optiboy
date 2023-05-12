import { Pool } from 'pg';
import config from './config';

const pool = new Pool({
  connectionString: config.db.connectionString
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(1);
});

export default pool;