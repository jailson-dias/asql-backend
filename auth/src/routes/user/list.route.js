import logger from '../../utils/logger';
import userModel from '../../models/user.model';
import formatResponse from '../../utils/formatResponse';

const keysToReturn = ['fullname', 'username', 'email', 'role', '_id'];

const findUsers = () => {
  return userModel
    .find()
    .select(keysToReturn)
    .then((users) => {
      logger.debug(`Found ${users.length} users successfully`);
      return users;
    });
};

const listRoute = (req, res) => {
  findUsers()
    .then((users) => {
      const response = formatResponse({ data: users });
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
