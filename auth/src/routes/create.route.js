import logger from '../utils/logger';
import UserModel from '../models/user.model';
import formatResponse from '../utils/formatResponse';
import { Error,  } from 'mongoose';

const createUser = ({ fullname, email, username, password }) => {
  const user = new UserModel({
    fullname,
    email,
    username,
    password,
  });

  return user.save();
};

const createRoute = (req, res) => {
  const userFieldValues = req.body || {};
  createUser(userFieldValues)
    .then((user) => {
      const response = formatResponse({ data: user });
      logger.debug('User created successfully');
      res.status(200).json(response);
    })
    .catch((error) => {
      let response = formatResponse({});
      let statusCode = 500;
      if (error instanceof Error.ValidationError) {
        const mongoErros = error.errors;
        const errorFields = Object.keys(mongoErros);
        logger.debug('Mongo validation errors', errorFields);
        const formatedErrors = errorFields.map((field) => {
          return {
            field: mongoErros[field].properties.path,
            message: mongoErros[field].properties.message,
          };
        });
        statusCode = 400;
        response = formatResponse({
          message: formatedErrors,
        });
      } else if error instanceof Error
      else {
        logger.error('Error creating user', error);
      }
      res.status(statusCode).json(response);
    });
};

export default createRoute;
