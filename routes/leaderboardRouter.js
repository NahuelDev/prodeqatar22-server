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

leaderboardRouter.get('/matches', async (req, res) => {
    let resMatches = [];
    const matches = await Match.find().select('-_id');
    const dateMatchFinished = new Date(new Date().setUTCHours(new Date().getUTCHours() + 2));
    const matchesNotFinished = matches.filter(m => {
        if (m.AwayTeamScore === null && m.HomeTeamScore === null) return (new Date(m.DateUtc) <= Date.now() && new Date(m.DateUtc) <= dateMatchFinished);
        return new Date(m.DateUtc) < dateMatchFinished;
    });

    const usersDB = await User.find({}).select('-_id uid results displayName');

    matchesNotFinished.forEach(m => {
        let users = [];
        usersDB.forEach(u => {
            const prediction = u.results.find(result => result.MatchNumber === m.MatchNumber);

            const user = {
                ...prediction,
                uid: u.uid,
                displayName: u.displayName
            }
            users.push(user);
        });

        resMatches.push({
            ...m._doc,
            users
        });
    });

    res.json(resMatches);
});
export default leaderboardRouter;