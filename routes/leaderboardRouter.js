import { Router } from "express";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
import { RowLeaderboard } from "../models/Leaderboard.js";

const leaderboardRouter = Router();

const getResultPrediction = (match) => {
    const { HomeTeamScore, AwayTeamScore } = match;

    if (HomeTeamScore > AwayTeamScore) return "team1";
    else if (HomeTeamScore < AwayTeamScore) return "team2";
    return "draw";
}

leaderboardRouter.get('/update', async (req, res) => {
    const matches = await Match.find({ HomeTeamScore: { $ne: null }, AwayTeamScore: { $ne: null } }).select('-_id');
    const users = await User.find({}).select('-_id uid results displayName');

    users.map(async (user) => {
        let points = 0;
        user.results.forEach(res => {

            const match = matches.find(m => m.MatchNumber === res.MatchNumber);
            if (!match) return;
            const matchResult = getResultPrediction(match);
            console.log(`${matchResult} - ${res.result}`);
            if (match.HomeTeamScore === res.HomeTeamScore && match.AwayTeamScore === res.AwayTeamScore) points += 3;
            else if (matchResult === res.result) points += 1;
        });
        await RowLeaderboard.findOneAndUpdate({ uid: user.uid }, {
            displayName: user.displayName,
            uid: user.uid,
            points
        }, { upsert: true });

    });

    res.json({
        status: 'Updated!'
    });

});

leaderboardRouter.get('/', async (req, res) => {
    const leaderboard = (await RowLeaderboard.find({}).select('-__v -_id')).sort((a, b) => b.points - a.points);
    console.log('Leaderboard requested!');
    res.json(leaderboard);
});

export default leaderboardRouter;