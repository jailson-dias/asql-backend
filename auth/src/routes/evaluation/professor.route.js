import logger from '../../utils/logger';
import formatResponse from '../../utils/formatResponse';
import Exercise from '../../controllers/exercise/exercise.controller';
import FormatMongooseErrors from '../../utils/formatMongooseErrors';
import NotFound from '../../errors/notFound';

class Route {
  constructor() {
    this.exerciseErrorResponse = this.exerciseErrorResponse.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.getById = this.getById.bind(this);
  }

  exerciseErrorResponse(error) {
    let message = [];
    let statusCode = 500;
    if (error.name == 'ValidationError') {
      statusCode = 400;
      message = FormatMongooseErrors.validation(error.errors);
    } else if (error.name == 'MongoError') {
      statusCode = 400;
      message = FormatMongooseErrors.duplicateKey(error);
    } else if (error.name == 'CastError') {
      statusCode = 404;
      message = [{ message: 'Exercise not found' }];
    } else if (error instanceof NotFound) {
      logger.debug(error.message);

      statusCode = 404;
      message = [{ message: error.message }];
    } else {
      logger.error('Unidentified error on exercise');
      logger.debug(error.stack);

      message = [{ message: 'Unidentified error on exercise' }];
    }
    return { statusCode, message };
  }

  create(req, res) {
    const body = req.body || {};
    return Exercise.create(body)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Exercise created successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.exerciseErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  getById(req, res) {
    const { exerciseId } = req.params;
    return Exercise.getById(exerciseId)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Exercise found successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.exerciseErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  edit(req, res) {
    const body = req.body || {};
    const { exerciseId } = req.params;
    return Exercise.edit(exerciseId, body)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Exercise edited successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.exerciseErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  delete(req, res) {
    const { exerciseId } = req.params;
    return Exercise.delete(exerciseId)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Exercise deleted successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.exerciseErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }
}

export default new Route();
