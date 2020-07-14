import logger from '../../utils/logger';
import ExerciseModel from '../../models/exercise.model';
import NotFound from '../../errors/notFound';
import moment from 'moment';
import Database from './database';

class Exercise {
  static formatExercise(exercise) {
    if (!exercise) {
      throw new NotFound('Exercise not found');
    }

    if (exercise.dateLimit) {
      exercise._doc.dateLimit = moment(exercise.dateLimit).format('DD/MM/YYYY');
    }

    return exercise;
  }

  static create({ title, description, dateLimit }) {
    logger.debug('Creating the exercise')
    const exercise = new ExerciseModel({
      title,
      description,
      dateLimit,
    });
    return exercise
      .save()
      .then(Exercise.formatExercise)
      .then((exercise) => {
        Database.create(exercise.code);
        return exercise;
      });
  }

  static populate(exerciseId, { populationScript }) {
    // logger.debug('Populating the database')
    return ExerciseModel.findOne({_id: exerciseId})
      .then(exercise => {
        return Database.populate(exercise.code, populationScript)
      })
  }

  static getById(exerciseId) {
    logger.debug(`getting exercise ${exerciseId}`);

    return ExerciseModel.findOne({ _id: exerciseId })
      .then(Exercise.formatExercise)
      .then((exercise) => {
        Database.query(exercise.code, 'SELECT * FROM Pessoa').then(suc => {
          logger.debug(suc)
        }).catch(err => {
          logger.debug(err)
        })
        return exercise;
      });
  }

  static list() {
    logger.debug('getting all exercises');

    return ExerciseModel.find().then((exercises) => {
      return exercises.map(Exercise.formatExercise);
    });
  }

  static edit(exerciseId, { title, description, dateLimit, populationScript }) {
    let fieldsToUpdate = {};
    if (title) {
      fieldsToUpdate['title'] = title;
    }

    if (description) {
      fieldsToUpdate['description'] = description;
    }

    if (dateLimit) {
      fieldsToUpdate['dateLimit'] = moment(dateLimit, 'DD/MM/YYYY');
    }

    if (populationScript) {
      fieldsToUpdate['populationScript'] = populationScript;
    }

    logger.debug(`editing exercise ${exerciseId}`);

    return ExerciseModel.findOneAndUpdate(
      {
        _id: exerciseId,
      },
      {
        $set: fieldsToUpdate,
      },
      { new: true }
    ).then(Exercise.formatExercise);
  }

  static delete(exerciseId) {
    logger.debug(`removing exercise ${exerciseId}`);

    return ExerciseModel.findOneAndRemove(
      {
        _id: exerciseId,
      },
      { new: true }
    ).then(Exercise.formatExercise);
  }
}

export default Exercise;
