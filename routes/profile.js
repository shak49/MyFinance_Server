//
//
//
import express, { response } from 'express';
import { current_user } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/profile/current-user', current_user);

export default router;