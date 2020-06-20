import userModel from '../models/user.model';

const listUsers = () => {
  userModel
    .find()
    .populate(['fullname', 'username', 'email', 'role'])
    .then((users) => {
      logger.debug(`Found ${users.length} users successfully`);
    })
    .catch((error) => {
      logger.error('Error finding the users', error);
    });
};

export default {
  listUsers,
};
