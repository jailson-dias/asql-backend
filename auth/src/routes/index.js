import express from 'express';
import user from './user';
import exercise from './exercise';

const router = express.Router();

router.use('/user', user);
router.use('/exercise', exercise);

export default router;
