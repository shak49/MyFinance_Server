//
//
//
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const env = process.env;
// Current User
router.get('/profile/current-user', (req, res, next) => {
    const access_token = req.header("access_token");
    if (!access_token) return res.status(401).json({ error: 'Invalid token.' });
    try {
        const decoded = jwt.verify(access_token, 'secret');
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
});

export default router;