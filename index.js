//
//
//
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';

const app = express();
const PORT = 4000;

dotenv.config();
mongoose.connect(process.env.DB_CONNECT).then(() => {
    console.log("Successfully connected ");
}).catch((error) => {
    console.log(`Can not connect to database, ${error}`);
});

app.use(bodyParser.json());
app.use(authRoute);
app.use(profileRoute);
app.get('/', (req, res) => {
    res.send('Welcome to myFinance!');
});
app.listen(PORT, () => {
    console.log(`>>> SERVER RUNNING ON PORT: http://localhost:${PORT} <<<`);
});