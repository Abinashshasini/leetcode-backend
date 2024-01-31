import { Router } from 'express';
import {
  handleAddProblem,
  handleFetchAllProblems,
} from '../controllers/problems.controller.js';
import { handleVerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/** Declaring problems routes */
router.route('/get-all-problems').get(handleFetchAllProblems);

/** Declaring secured problems routes */
router.route('/add-problem').post(handleVerifyJWT, handleAddProblem);

export default router;
