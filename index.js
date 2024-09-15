//
//
//
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js';

const app = express();
const PORT = 4000;

dotenv.config();

mongoose.connect(process.env.DB_CONNECT);

app.use(bodyParser.json());
app.use(authRoute);
app.get('/', (req, res) => {
    res.send('Welcome to myFinance!');
});
app.listen(PORT, () => {
    console.log(`>>> SERVER RUNNING ON PORT: http://localhost:${PORT} <<<`);
});