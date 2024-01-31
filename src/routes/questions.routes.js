import { Router } from 'express';
import {
  handleAddQuestion,
  handleFetchAllQuestions,
} from '../controllers/questions.controller.js';
import { handleVerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/** Declaring questions routes */
router.route('/get-all-questions').get(handleFetchAllQuestions);

/** Declaring secured questions routes */
router.route('/add-question').post(handleVerifyJWT, handleAddQuestion);

export default router;
