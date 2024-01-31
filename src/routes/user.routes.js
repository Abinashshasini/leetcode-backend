import { Router } from 'express';
import {
  handleLoginUser,
  handleLogoutUser,
  handleRegisterUser,
  handleRefreshAccessToken,
} from '../controllers/user.controller.js';
import { handleVerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/** Declaring user routes */
router.route('/register').post(handleRegisterUser);
router.route('/login').post(handleLoginUser);

/** Declaring secured routes */
router.route('/logout').post(handleVerifyJWT, handleLogoutUser);
router.route('/refresh-token').post(handleRefreshAccessToken);

export default router;
