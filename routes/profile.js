//
//
//
import express, { response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const env = process.env;
// Current User
router.get('/profile/current-user', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Invalid token.' });
    try {
        const decoded = jwt.verify(token, 'secret');
        const user = decoded.user;
        res.status(200).json(user);
    } catch (error) {
        return res.status(401).json(error);
    }
});

export default router;