import logger from '../../utils/logger';
import formatResponse from '../../utils/formatResponse';
import Question from '../../controllers/exercise/question.controller';
import FormatMongooseErrors from '../../utils/formatMongooseErrors';
import NotFound from '../../errors/notFound';

class Route {
  constructor() {
    this.questionErrorResponse = this.questionErrorResponse.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.getById = this.getById.bind(this);
  }

  questionErrorResponse(error) {
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
      message = [{ message: 'Exercise or question not found' }];
    } else if (error instanceof NotFound) {
      logger.debug(error.message);

      statusCode = 404;
      message = [{ message: error.message }];
    } else {
      logger.error('Unidentified error on question');
      logger.debug(error.stack);

      message = [{ message: 'Unidentified error on question' }];
    }
    return { statusCode, message };
  }

  create(req, res) {
    const body = req.body || {};
    const { exerciseId } = req.params;
    return Question.create(exerciseId, body)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Question created successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.questionErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  getById(req, res) {
    const { exerciseId, questionId } = req.params;
    return Question.getById(exerciseId, questionId)
      .then((question) => {
        const response = formatResponse({ data: question });
        logger.debug('Question found successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.questionErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  edit(req, res) {
    const body = req.body || {};
    const { exerciseId, questionId } = req.params;
    return Question.edit(exerciseId, questionId, body)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Question edited successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.questionErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }

  delete(req, res) {
    const { exerciseId, questionId } = req.params;
    return Question.delete(exerciseId, questionId)
      .then((exercise) => {
        const response = formatResponse({ data: exercise });
        logger.debug('Question deleted successfully');
        res.status(201).json(response);
      })
      .catch((error) => {
        let { statusCode, message } = this.questionErrorResponse(error);
        let response = formatResponse({ message });

        res.status(statusCode).json(response);
      });
  }
}

export default new Route();
