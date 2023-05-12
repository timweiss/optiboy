import express from 'express';
import config from './util/config';
import {confirmEmail, submitEmail} from './service';
import {emailConfirmationErrorHtml, emailConfirmedHtml} from './html';
import pool from './util/pool';
import {createServer} from 'http';

console.log('optiboy is starting up');

const app = express();
const httpServer = createServer(app);

httpServer.listen(config.port, () => {
  console.log(`optiboy running on ${config.hostname}`);
});

app.use(express.json());

const shutdown = async () => {
  console.log('Shutting down');
  httpServer.close();
  await pool.end();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.get('/', (req, res) => {
  res.send('hello from optiboy!');
});

app.post('/', async (req, res) => {
  const referrer = req.get('Referrer') || '';
  const email = req.body.email;

  try {
    const result = await submitEmail(email, referrer);
    console.log('email submitted: ' + email);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
});

app.get('/confirm/:key', async (req, res) => {
  try {
    const entry = await confirmEmail(req.params.key);
    console.log('email confirmed: ' + entry.email);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(emailConfirmedHtml());
  } catch (error) {
    console.error(error);
    res.setHeader("Content-Type", "text/html");
    res.status(404).send(emailConfirmationErrorHtml());
  }
});