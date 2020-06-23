import logger from '../../utils/logger';
import UserModel from '../../models/user.model';
import formatResponse from '../../utils/formatResponse';
import { Error } from 'mongoose';
import { filterKeysInObject } from '../../utils/helpers';

const keysToReturn = ['fullname', 'username', 'email', 'role', '_id'];

const createUser = ({ fullname, email, username, password, role }) => {
  const user = new UserModel({
    fullname,
    email,
    username,
    password,
    role,
  });

  return user.save().then((userSaved) => {
    logger.debug('Filtering user keys to return');
    return filterKeysInObject(userSaved, keysToReturn);
  });
};

const formatValidationError = (mongoErros) => {
  const errorFields = Object.keys(mongoErros);
  logger.debug('Mongo validation errors', errorFields);
  const formatedErrors = errorFields.map((field) => {
    return {
      field: mongoErros[field].properties.path,
      message: mongoErros[field].properties.message,
    };
  });
  const response = formatResponse({
    message: formatedErrors,
  });
  return { statusCode: 400, response };
};

const formatMongoError = (error) => {
  // if (error.code == "11000") {
  const errorFields = Object.keys(error.keyPattern);
  logger.debug('Mongo duplicate fields error', errorFields);
  const formatedErrors = errorFields.map((field) => {
    return {
      field,
      message: `This ${field} already exists, try another`,
    };
  });
  const response = formatResponse({
    message: formatedErrors,
  });
  // }
  return { statusCode: 400, response };
};

const createRoute = (body) => {
  return createUser(body)
    .then((user) => {
      const response = formatResponse({ data: user });
      logger.debug('User created successfully');
      return {
        statusCode: 200,
        response,
      };
    })
    .catch((error) => {
      let response = formatResponse({});
      let statusCode = 500;
      if (error instanceof Error.ValidationError) {
        return formatValidationError(error.errors);
      } else if (error.name == 'MongoError') {
        return formatMongoError(error);
      } else {
        logger.error('Error creating user', error);
        response = formatResponse({
          message: [
            {
              message: 'Error getting user',
            },
          ],
        });
      }

      return {
        statusCode,
        response,
      };
    });
};

export const createStudentRoute = (req, res) => {
  const body = req.body || {};
  body.role = 'Student';
  createRoute(body).then(({ statusCode, response }) => {
    res.status(statusCode).json(response);
  });
};

export const createTeacherRoute = (req, res) => {
  const body = req.body || {};
  body.role = 'Teacher';
  createRoute(body).then(({ statusCode, response }) => {
    res.status(statusCode).json(response);
  });
};
