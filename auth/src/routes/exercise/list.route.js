import logger from '../../utils/logger';
import ExerciseModel from '../../models/exercise.model';
import formatResponse from '../../utils/formatResponse';

const listRoute = (req, res) => {
  ExerciseModel.find()
    .then((exercises) => {
      const response = formatResponse({ data: exercises });
      res.status(200).json(response);
    })
    .catch(() => {
      const response = formatResponse({
        message: ['Error finding the exercises'],
      });
      res.status(500).json(response);
    });
};

export default listRoute;
