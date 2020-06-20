import bcrypt from 'bcrypt';
import logger from './logger';
const SALTS = 20;

const hash = (password) => {
  bcrypt.hash(password, SALTS).catch((err) => {
    logger.erro('err encrypting password', err);
  });
};

const isSamePassword = (password, passwordToCompare) => {
  bcrypt.compare(passwordToCompare, password).catch((err) => {
    logger.erro('err decrypting password', err);
  });
};

export default {
  hash,
  isSamePassword,
};
