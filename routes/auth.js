//
//
//
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
import { validateSignUp, validateSignIn } from '../validation.js';

const router = express.Router();
const env = process.env;
// Create User
router.post('/auth/sign-up', async (req, res) => {
    // User exist validation
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists.' });
    // Sign up validation
    const error = validateSignUp(req.body).error;
    if (error) return res.status(400).json(error.details[0]);
    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    // User object creation
    const user = new User({
        id: uuidv4(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: encryptedPassword
    });
    try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch(error) {
        res.status(500).json(error);
    }
});
// Sign In
router.post('/auth/sign-in', async (req, res) => {
    // User exist validation
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: `This user with id: ${req.body.id} is not exist.`});
    // Sign in validation
    const error = validateSignIn(req.body).error;
    if (error) return res.status(400).json(error.details[0]);
    // Password match
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials.' });
    try {
        // Generating JWT
        const token = jwt.sign({ email: user.email }, 'secret');
        res.cookie('token', token).status(200).json(token);
    } catch (error) {
        res.status(501).json({ error: 'Internal server error.'});
    }
});
// Apple authentication
router.post('/auth/apple', async (req, res) => {
    const { token, email, apple_id } = req.body;
    const registeredUser = { apple_id, email };
    const user = await User.findOne({ apple_id: apple_id });
    if (user) {
        if (email && email !== user.email) {
            User.updateOne(req.body);
            user.email = req.body.email;
        }
        res.status(200).json(user);
    } else {
        await axios.get(env.APPLE_PUBLIC_KEYS, async (error, body) => {
            if (error) {
                res.status(401).json({ error: error });
            } else {
                //const key = jwt.asKeyStore(body);
                try {
                    const verified = jwt.verify(token, 'secret');
                    if (verified) await user.save(registeredUser);
                } catch(error) {
                    res.status(500).json({ error: error });
                }
            }
        });
    }
});
// Google sign in request
// router.get('/auth/google/sign-in', (req, res) => {
//     const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.CLIENT_ID}&redirect_uri=${env.REDIRECT_URI}&response_type=code&scope=profile email`;
//     res.redirect(url);
// });
// Google sign in callback
// router.get('/auth/google/sign-in/callback', async (req, res) => {
//     const { code } = req.query;
//     try {
//         const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
//             client_id: env.CLIENT_ID,
//             client_secret: env.CLIENT_SECRET,
//             code,
//             redirect_uri: env.REDIRECT_URI,
//             grant_type: 'authorization_code',
//         });
//         const { access_token, id_token } = data;
//         const profile = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
//             headers: { Authorization: `Bearer ${access_token}` },
//         });
//         res.status(200).json(profile);
//     } catch(error) {
//         res.status(501).json({ error: 'Internal server error.'});
//         res.redirect('/login');
//     }
// });
// Sign Out
router.get('/auth/sign-out', (req, res) => {
    res.cookie('cookie', '', {
        expireIn: new Date(Date.now())
    })
    res.status(200).json({ message: 'User Logout Successfully' });
});
// Current User
// router.get('/auth/current-user', (req, res) => {
//     const token = req.cookies.jwt;
//     if (!token) return res.status(401).json({ error: 'Invalid token.' });
//     jwt.verify(token, 'secret', (error, decodedToken) => {
//         if (error) return res.status(401).json(error);
//         const user = User.findById(decodedToken.id);
//         res.status(200).json(user);
//     });
// });

export default router;