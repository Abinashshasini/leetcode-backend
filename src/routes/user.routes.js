import { Router } from 'express';
import {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
} from '../controllers/user.controller.js';
import { handleVerifyJWT } from '../middlewares/auth.middleware';

const router = Router();

/** Declaring user routes */
router.route('/register').post(handleRegisterUser);
router.route('/login').post(handleLoginUser);

/** Declaring secured routes */
router.route('/logout').post(handleVerifyJWT, handleLogoutUser);

export default router;
