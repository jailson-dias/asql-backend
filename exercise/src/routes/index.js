import express from 'express';
import listRoute from './list.route';
// import getByIdRoute from './getById.route';
import CreateExercise from './create.route';
// import signin from './signin.route';
// import {verifyJWT} from '../utils/jwt'

const router = express.Router();

router.get('/', listRoute);
// router.get('/:id', verifyJWT, getByIdRoute);
router.post('/', CreateExercise.route);
// router.post('/signin', signin);

export default router;
