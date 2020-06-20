import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectToDatabase = (databaseURI) => {
  mongoose
    .connect(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      logger.debug('Connected to database successfully');
    })
    .catch((err) => {
      logger.error('error connecting to database', err);
    });
};

export default connectToDatabase;
