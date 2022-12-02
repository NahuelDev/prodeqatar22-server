import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import fetch from "node-fetch";

import userRouter from "./routes/userRouter.js";
import matchRouter from './routes/matchRouter.js';
import leaderboardRouter from "./routes/leaderboardRouter.js";
import groupRouter from "./routes/groupRouter.js";
import { LiveScore } from "./models/LiveScore.js";



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

const getLiveMatches = () => {
    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${process.env.APIFOOTBALL}&&league_id=28&match_live=1`)
        .then(res => {
            return res.arrayBuffer()
        }).then(data => {
            const enc = new TextDecoder('utf-8');

            const res = enc.decode(data);
            if (res.includes('502') || res.includes('404')) return;
            const resJSON = JSON.parse(res);
            resJSON.forEach(async (match) => {
                const { match_id, match_hometeam_name, match_hometeam_score, match_awayteam_name, match_awayteam_score, match_status } = match;

                const matchID = match_id;
                const homeTeam = match_hometeam_name;
                const awayTeam = match_awayteam_name;
                const homeTeamScore = Number(match_hometeam_score);
                const awayTeamScore = Number(match_awayteam_score);
                const matchTime = match_status;

                await LiveScore.findOneAndUpdate({ matchID: matchID }, {
                    matchID,
                    homeTeam,
                    awayTeam,
                    homeTeamScore,
                    awayTeamScore,
                    matchTime
                }, { upsert: true });
            });

        })
};



app.listen(port, () => {
    console.log('Server on port ', port);
    setInterval(() => {
        getLiveMatches();
    }, 30000);
},);