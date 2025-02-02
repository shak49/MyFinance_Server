//
//
//
import express from 'express';
import { 
    sign_up, sign_in, 
    google, apple, sign_out, 
    recover_password 
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/sign-up', sign_up);
router.post('/auth/sign-in', sign_in);
router.get('/auth/google', google);
router.get('/auth/apple', apple);
router.get('/auth/sign-out', sign_out);
router.post('/auth/recover-password', recover_password);

export default router;