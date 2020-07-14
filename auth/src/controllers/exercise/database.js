import logger from '../../utils/logger';
import PostgreSQL from '../../evaluation/postgres';
import { baseConnectionString } from '../../utils/helpers';

const removeCommets = (query) => {
  const rgRemoveComments = /(\/\*[^*]*\*\/)|(\/\/[^*]*)|(--[^.].*)/gm;

  return query.replace(rgRemoveComments, '');
};

class Database {
  static create(databaseName) {
    logger.debug(`Creating the database ${databaseName}`);
    const db = new PostgreSQL(baseConnectionString);
    db.query(`CREATE DATABASE ${databaseName}`)
      .catch((error) => {
        logger.debug(error.stack);
        logger.debug(`error creating the database ${databaseName}`);
      })
      .finally(() => {
        db.end();
      });
  }

  static populate(databaseName, populationScript) {
    logger.debug(`populating the database ${databaseName}`);
    const db = new PostgreSQL(`${baseConnectionString}/${databaseName}`);

    return db.query('BEGIN;')
      .then(() => {
        populationScript = removeCommets(populationScript)
          .split(';')
          .filter((item) => item.length > 0);

        return populationScript.reduce(
          (promise, query) => promise.then(() => db.query(query)),
          Promise.resolve()
        );
      })
      .then(() => {
        return db.query('COMMIT;');
      })
      .then(() => {
        logger.debug('successfully populate the database');
        return {
          message: 'Database populated successfully'
        }
      })
      .catch((error) => {
        console.trace()
        logger.debug('error on script');
        return db.query('ROLLBACK;').finally(() => {
          throw new Error('Error on script')
        })
      })
      .finally(() => {
        db.end();
      });
  }

  static query(databaseName, query) {
    logger.debug(`Querying on database ${databaseName}`);
    const db = new PostgreSQL(`${baseConnectionString}/${databaseName}`);
    return db.query(removeCommets(query))
      .catch((error) => {
        console.trace()
        logger.debug('error on query');
        throw new Error('Error on query')
      })
      .finally(() => {
        db.end();
      });
  }
}

export default Database;
