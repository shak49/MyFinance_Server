//
//
//
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const env = process.env;

export const current_user = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('Invalid token.');
    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await User.findOne({ email: decoded.email });
        res.status(200).json(user);
    } catch (error) {
        return res.status(401).send(error.details[0].message);
    }
};