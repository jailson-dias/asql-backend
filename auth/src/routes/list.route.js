import logger from '../utils/logger';
import userModel from '../models/user.model';
import formatResponse from '../utils/formatResponse';

const findUsers = () => {
  return userModel
    .find()
    .populate(['fullname', 'username', 'email', 'role'])
    .then((users) => {
      logger.debug(`Found ${users.length} users successfully`);
      return users;
    })
    .catch((error) => {
      logger.error('Error finding the users', error);
      throw error;
    });
};

const listRoute = (req, res) => {
  findUsers()
    .then((users) => {
      const response = formatResponse({ data: users });
      logger.info(response);
      res.status(200).json(response);
    })
    .catch(() => {
      const response = formatResponse({
        message: ['Error finding the users'],
      });
      res.status(500).json(response);
    });
};

export default listRoute;
