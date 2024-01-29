import { Router } from 'express';
import { handleCompileProblrm } from '../controllers/compile-problem.controller.js';

const router = Router();

/** Declaring user routes */
router.route('/compile-problem').post(handleCompileProblrm);

export default router;
