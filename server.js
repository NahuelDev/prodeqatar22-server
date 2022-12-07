import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';

import userRouter from "./routes/userRouter.js";
import matchRouter from './routes/matchRouter.js';
import leaderboardRouter from "./routes/leaderboardRouter.js";
import groupRouter from "./routes/groupRouter.js";
import { getLiveMatches } from "./utils/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//Config
app.use(cors());
app.use(express.json());

//Routers
app.use('/api/users', userRouter);
app.use('/api/matches', matchRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/groups', groupRouter);

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log('Server on port ', port);
    setInterval(() => {
        getLiveMatches();
    }, 45000);
},);