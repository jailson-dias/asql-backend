import express from 'express';
import bodyParser from 'body-parser';

import logger from './src/utils/logger';
import connectToDatabase from './src/database/mongo';
import routes from './src/routes';

connectToDatabase('mongodb://mongo:27017/database');
const server = express();

server.use(bodyParser.json());

server.use('/', routes);

server.get('/url', (req, res) => {
  res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
});

server.listen(3000, () => {
  logger.debug('Server running on port 3000');
});
