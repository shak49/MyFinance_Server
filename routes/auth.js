//
//
//
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt, { decode } from 'jsonwebtoken';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import randomColor from 'randomcolor';
import User from '../models/User.js';
import { validateSignUp, validateSignIn } from '../validation.js';

const router = express.Router();
const env = process.env;
// Create User
router.post('/auth/sign-up', async (req, res) => {
    // User exist validation
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(401).send({ message: 'Email already exists.' });
    // Sign up validation
    const error = validateSignUp(req.body).error;
    if (error) return res.status(402).send({ message: 'Unable to validate fields!' });
    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    // User object creation
    const user = new User({
        _id: uuidv4(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: encryptedPassword,
        avator_color: randomColor({
            luminosity: 'random',
            hue: 'random'
        })
    });
    try {
        const savedUser = await user.save();
        const token = jwt.sign({ email: savedUser.email }, 'secret');
        res.cookie('token', token).status(200).json({ access_token: token });
    } catch(error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});
// Sign In
router.post('/auth/sign-in', async (req, res) => {
    // User exist validation
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(403).send({ message: `This user with id: ${req.body.id} is not exist.` });
    // Sign in validation
    const error = validateSignIn(req.body).error;
    if (error) return res.status(402).send({ message: 'Unable to validate fields!' });
    // Password match
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) return res.status(404).send({ message: 'Invalid credentials.' });
    try {
        // Generating JWT
        const token = jwt.sign({ email: user.email }, 'secret');
        res.cookie('token', token).status(200).json({ access_token: token });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});
// Google sign in request
router.get('/auth/google', async (req, res) => {
    const id_token = req.headers.authorization;
    try {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdTokenAsync({
            idToken: id_token,
            audience: env.CLIENT_ID
        });
        const response = ticket.getPayload();
        const user = await User.findOne({ email: response.email });
        // Password encryption
        //const salt = await bcrypt.genSalt(10);
        //const encryptedPassword = await bcrypt.hash(response.password, salt);
        const newUser = new User({
            _id: uuidv4(),
            firstname: response.given_name,
            lastname: response.family_name,
            email: response.email,
            //password: encryptedPassword,
            avator_color: randomColor({
                luminosity: 'random',
                hue: 'random'
            })
        });
        if (user) {
            User.updateOne(newUser);
            // Generating JWT
            const token = jwt.sign({ email: newUser.email }, 'secret');
            res.cookie('token', token).status(200).json({ access_token: token });
        } else {
            const savedUser = await newUser.save();
            // Generating JWT
            const token = jwt.sign({ email: savedUser.email }, 'secret');
            res.cookie('token', token).status(200).json({ access_token: token });
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});
// Apple authentication
router.get('/auth/apple', async (req, res) => {
    const id_token = req.headers.authorization;
    try {
        const response = jwt.decode(id_token);
        if (!response) return res.status(400).send({ message: 'Unable to decode.' });
        // Generating JWT
        const token = jwt.sign({ email: response.email }, 'secret');
        res.cookie('token', token).status(200).json({ access_token: token });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});
// Sign Out
router.get('/auth/sign-out', (req, res) => {
    res.cookie('cookie', '', {
        expireIn: new Date(Date.now())
    })
    res.status(200).json({ message: 'User Logout Successfully' });
});

export default router;