import express from 'express';
import question from './question.route';
import exercise from './exercise.route';
// import signin from './signin.route';
// import {verifyJWT} from '../utils/jwt'

const router = express.Router();

// Exercise
router.get('/', exercise.list);
router.post('/', exercise.create);
router.get('/:exerciseId', exercise.getById);
router.put('/:exerciseId', exercise.edit);
router.delete('/:exerciseId', exercise.delete);
router.post('/:exerciseId/populate', exercise.populate);

// Question
router.post('/:exerciseId/question', question.create);
router.get('/:exerciseId/question/:questionId', question.getById);
router.put('/:exerciseId/question/:questionId', question.edit);
router.delete('/:exerciseId/question/:questionId', question.delete);

export default router;
