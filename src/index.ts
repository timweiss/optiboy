import express, {Router} from 'express';
import cors from 'cors';
import config from './util/config';
import {confirmEmail, submitEmail} from './service';
import {emailConfirmationErrorHtml, emailConfirmedHtml} from './html';
import pool from './util/pool';
import {createServer} from 'http';
import {useAdminRoutes} from "./admin";

console.log('optiboy is starting up');

const app = express();
const httpServer = createServer(app);

httpServer.listen(config.port, () => {
  console.log(`optiboy running on ${config.hostname}`);
});

app.use(express.json());
app.use(cors({ origin: '*' }));

const shutdown = async () => {
  console.log('Shutting down');
  httpServer.close();
  await pool.end();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.use('/', useAppRoutes());

if (config.admin.enabled && config.admin.secret) {
  app.use('/admin', useAdminRoutes());
}

function useAppRoutes() {
  const router = express.Router();
  router.get('/', (req, res) => {
    res.send('hello from optiboy!');
  });

  router.post('/', async (req, res) => {
    const referrer = req.get('Referrer') || '';
    const email = req.body.email;

    try {
      const result = await submitEmail(email, referrer);
      console.log('email submitted: ' + email);
      res.status(200).send({});
    } catch (error) {
      console.error(error);
      res.status(400).send({});
    }
  });

  router.get('/confirm/:key', async (req, res) => {
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

  return router;
}