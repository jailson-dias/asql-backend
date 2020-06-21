import express from 'express';
import listRoute from './list.route';
import getByIdRoute from './getById.route';
import {
    createStudentRoute,
    createTeacherRoute
} from './create.route';
import signin from './signin.route';
import {verifyJWT} from '../utils/jwt'

const router = express.Router();

router.get('/', verifyJWT, listRoute);
router.get('/:id', verifyJWT, getByIdRoute);
router.post('/student', createStudentRoute);
router.post('/teacher', createTeacherRoute);
router.post('/signin', signin);

export default router;
