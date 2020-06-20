import express from 'express';
import listRoute from './list.route';
import createRoute from './create.route';

const router = express.Router();

router.get('/', listRoute);
router.post('/', createRoute);

export default router;
