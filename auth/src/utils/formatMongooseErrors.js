import logger from './logger';

class FormatMongooseErrors {
  static validation(mongoErros) {
    const errorFields = Object.keys(mongoErros);
    logger.debug('Mongo validation errors', errorFields);

    const formatedErrors = errorFields.map((field) => {
      return {
        field: mongoErros[field].path || mongoErros[field].properties.path,
        message: mongoErros[field].message || mongoErros[field].properties.message,
      };
    });

    return formatedErrors;
  }

  static duplicateKey(error) {
    logger.error(error);
    const errorFields = Object.keys(error.keyPattern);
    logger.debug('Mongo duplicate fields error', errorFields);

    const formatedErrors = errorFields.map((field) => {
      return {
        field,
        message: `This ${field} already exists, try another`,
      };
    });

    return formatedErrors;
  }

  static castError(error) {
    // não satisfatório
    let modelName = /"([\w-/\\\._]*?)"$/g.exec(error.message)[1];
    logger.debug(`${error.value} not found on ${modelName} collection`);

    logger.info(error.message);
    logger.info(error);

    return [
      {
        message: `${modelName} not found`,
      },
    ];
  }
}

export default FormatMongooseErrors;
