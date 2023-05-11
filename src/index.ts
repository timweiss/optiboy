import express from 'express';
import config from './util/config';

console.log('optiboy is starting up');

const app = express();

app.listen(config.port, () => {
  console.log(`optiboy running on http://localhost:${config.port}`);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from optiboy!');
});