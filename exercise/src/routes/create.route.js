import logger from '../utils/logger';
import ExerciseModel from '../models/exercise.model';
import formatResponse from '../utils/formatResponse';
import { Error } from 'mongoose';

class FormatErrors {
  static validation(mongoErros) {
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
  }

  static mongo(error) {
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
    return { statusCode: 400, response };
  }
}

export default class CreateExercise {
  static save({ title, description, dateLimit }) {
    const exercise = new ExerciseModel({
      title,
      description,
      dateLimit,
    });
    return exercise.save();
  }

  static route(req, res) {
    const body = req.body || {};
    return CreateExercise.save(body)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Exercise created successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let response = formatResponse({});
        let statusCode = 500;
        if (error instanceof Error.ValidationError) {
          ({ statusCode, response } = FormatErrors.validation(error.errors));
        } else if (error.name == 'MongoError') {
          ({ statusCode, response } = FormatErrors.mongo(error));
        } else {
          logger.error('Error creating exercise', error);
          response = formatResponse({
            message: [
              {
                message: 'Error creating exercise',
              },
            ],
          });
        }

        res.status(statusCode).json(response);
      });
  }
}
