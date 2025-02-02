//
//
//
import express from 'express';
import { generateLinkToken } from '../controllers/account.controller.js';

const router = express.Router();

router.post('/account/generate-plaid-token', generateLinkToken);

export default router;