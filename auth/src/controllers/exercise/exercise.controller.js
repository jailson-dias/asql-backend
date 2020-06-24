import logger from '../../utils/logger';
import ExerciseModel from '../../models/exercise.model';
import NotFound from '../../errors/notFound';

class Exercise {
  static create({ title, description, dateLimit }) {
    const exercise = new ExerciseModel({
      title,
      description,
      dateLimit,
    });
    return exercise.save();
  }

  static getById(exerciseId) {
    logger.debug(`getting exercise ${exerciseId}`);

    return ExerciseModel.findOne({ _id: exerciseId }).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise not found');
      }
      return exercise;
    });
  }

  static edit(exerciseId, { title, description, dateLimit }) {
    let fieldsToUpdate = {};
    if (title) {
      fieldsToUpdate['title'] = title;
    }

    if (description) {
      fieldsToUpdate['description'] = description;
    }

    if (dateLimit) {
      fieldsToUpdate['dateLimit'] = dateLimit;
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
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise not found');
      }
      return exercise;
    });
  }

  static delete(exerciseId) {
    logger.debug(`removing exercise ${exerciseId}`);

    return ExerciseModel.findOneAndRemove(
      {
        _id: exerciseId,
      },
      { new: true }
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise not found');
      }
      return exercise;
    });
  }
}

export default Exercise;
