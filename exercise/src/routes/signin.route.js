import logger from '../utils/logger';
import userModel from '../models/exercise.model';
import formatResponse from '../utils/formatResponse';
import { filterKeysInObject } from '../utils/helpers';
import { generateToken } from '../utils/jwt';

const keysToReturn = ['fullname', 'username', 'email', 'role', '_id'];

const authenticate = ({ username, email, password = '' }) => {
  let userQuery = {};
  if (username) {
    userQuery = { username };
  }
  if (email) {
    userQuery = { ...userQuery, email };
  }
  return userModel
    .findOne(userQuery)
    .then((user) => {
      if (user) {
        logger.debug('user found');
        return user.comparePassword(password);
      }
      logger.debug('user not found');
      throw new NotFound();
    })
    .then((user) => {
      return filterKeysInObject(user, keysToReturn);
    });
};

const listRoute = (req, res) => {
  const body = req.body || {};
  authenticate(body)
    .then((user) => {
      const token = generateToken(user);
      const response = formatResponse({ data: { user, token } });
      res.status(200).json(response);
    })
    .catch((error) => {
      let response = formatResponse({});
      let statusCode = 500;

      if (error instanceof NotFound || error instanceof InvalidPassword) {
        response = formatResponse({
          message: [
            {
              message: 'Invalid credentials',
            },
          ],
        });
        statusCode = 400;
      } else {
        logger.error(error);
      }
      res.status(statusCode).json(response);
    });
};

export default listRoute;
