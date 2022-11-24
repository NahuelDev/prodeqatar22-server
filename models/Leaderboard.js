import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    uid: String,
    displayName: String,
    points: Number
});

export const RowLeaderboard = mongoose.model('Leaderboard', leaderboardSchema);