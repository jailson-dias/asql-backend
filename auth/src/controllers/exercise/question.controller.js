import logger from '../../utils/logger';
import ExerciseModel from '../../models/exercise.model';
import NotFound from '../../errors/notFound';
import Database from './database';

class Question {
  static queryOnDatabase(exerciseId, query) {
    logger.debug('querying solution on database');
    return ExerciseModel.findOne({ _id: exerciseId }).then((exercise) => {
      return Database.query(exercise.code, query);
    });
  }

  static create(exerciseId, { description, teacherSolution }) {
    const question = {
      description,
      teacherSolution,
    };

    logger.debug('adding a question on', exerciseId);

    return new Promise(async (resolve, reject) => {
      let solution = [];
      let exercise = null;
      try {
        if (teacherSolution) {
          solution = await Question.queryOnDatabase(exerciseId, teacherSolution);
          solution = solution.rows
        }

        exercise = await ExerciseModel.findByIdAndUpdate(
          exerciseId,
          {
            $push: {
              questions: question,
            },
          },
          { new: true }
        );
      } catch (err) {
        logger.debug('teste');
        reject(err);
      }

      if (!exercise) {
        reject(new NotFound('Exercise not found'));
      }
      resolve({
        exercise,
        solution,
      });
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

  static edit(exerciseId, questionId, { description, teacherSolution }) {
    let questionFieldsToUpdate = {};
    if (description) {
      questionFieldsToUpdate['questions.$.description'] = description;
    }

    if (teacherSolution) {
      questionFieldsToUpdate['questions.$.teacherSolution'] = teacherSolution;
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
