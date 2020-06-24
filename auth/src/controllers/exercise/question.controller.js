import logger from '../../utils/logger';
import ExerciseModel from '../../models/exercise.model';
import NotFound from '../../errors/notFound';

class Question {
  static create(
    exerciseId,
    { description, teacherSolution, databaseLocation }
  ) {
    const question = {
      description,
      teacherSolution,
      databaseLocation,
    };

    logger.debug('adding a question on', exerciseId);

    return ExerciseModel.findByIdAndUpdate(
      exerciseId,
      {
        $push: {
          questions: question,
        },
      },
      { new: true }
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise not found');
      }
      return exercise;
    });
  }

  static getById(exerciseId, questionId) {
    logger.debug(`getting question ${questionId} from ${exerciseId}`);

    return ExerciseModel.findOne(
      { _id: exerciseId, 'questions._id': questionId },
      { 'questions.$': 1 }
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise or question not found');
      }
      return exercise.questions[0];
    });
  }

  static edit(
    exerciseId,
    questionId,
    { description, teacherSolution, databaseLocation }
  ) {
    let questionFieldsToUpdate = {};
    if (description) {
      questionFieldsToUpdate['questions.$.description'] = description;
    }

    if (teacherSolution) {
      questionFieldsToUpdate['questions.$.teacherSolution'] = teacherSolution;
    }

    if (databaseLocation) {
      questionFieldsToUpdate['questions.$.databaseLocation'] = databaseLocation;
    }

    logger.debug(`editing question ${questionId} on ${exerciseId}`);

    return ExerciseModel.findOneAndUpdate(
      {
        _id: exerciseId,
        'questions._id': questionId,
      },
      {
        $set: questionFieldsToUpdate,
      },
      { new: true }
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise or question not found');
      }
      return exercise;
    });
  }

  static delete(exerciseId, questionId) {
    logger.debug(`removing question ${questionId} from ${exerciseId}`);

    return ExerciseModel.findOneAndUpdate(
      {
        _id: exerciseId,
        'questions._id': questionId,
      },
      {
        $pull: { questions: { _id: questionId } },
      },
      { new: true }
    ).then((exercise) => {
      if (!exercise) {
        throw new NotFound('Exercise or question not found');
      }
      return exercise;
    });
  }
}

export default Question;
