import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'

import logger from './src/utils/logger';
import connectToDatabase from './src/database/mongo';
import routes from './src/routes';

connectToDatabase('mongodb://mongo:27017/database');
const server = express();

server.use(bodyParser.json());

server.use(morgan('[:method] - :url - :status in :response-time ms'))

server.use('/', routes);

server.listen(3000, () => {
  logger.debug('Server running on port 3000');
});
