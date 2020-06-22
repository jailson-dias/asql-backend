import logger from '../utils/logger';
import userModel from '../models/exercise.model';
import formatResponse from '../utils/formatResponse';

const keysToReturn = ['fullname', 'username', 'email', 'role', '_id'];

const getById = (id) => {
  return userModel
    .findById(id)
    .select(keysToReturn)
    .then((user) => {
      logger.debug(`User found successfully`);
      return user;
    });
};

const getByIdRoute = (req, res) => {
  getById(req.params.id)
    .then((user) => {
      const response = formatResponse({ data: user });
      res.status(200).json(response);
    })
    .catch((error) => {
      let response = formatResponse({});
      let statusCode = 500;

      if (error instanceof CastError) {
        logger.debug(`User ${error.value} was not found`);
        statusCode = 404;
        response = formatResponse({
          message: [
            {
              message: 'User not found',
            },
          ],
        });
      } else {
        logger.error('Error getting user', error);
        response = formatResponse({
          message: [
            {
              message: 'Error getting user',
            },
          ],
        });
      }
      res.status(statusCode).json(response);
    });
};

export default getByIdRoute;
