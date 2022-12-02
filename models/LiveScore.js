import mongoose from "mongoose";

const liveScoreSchema = new mongoose.Schema({
    matchID: String,
    homeTeam: String,
    awayTeam: String,
    homeTeamScore: Number,
    awayTeamScore: Number,
    matchTime: String
});

export const LiveScore = mongoose.model('LiveScore', liveScoreSchema);