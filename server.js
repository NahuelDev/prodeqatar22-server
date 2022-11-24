import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import matchRouter from './routes/matchRouter.js';
import leaderboardRouter from "./routes/leaderboardRouter.js";
import cors from 'cors';

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

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log('Server on port ', port);
},);