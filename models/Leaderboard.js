import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    uid: String,
    displayName: String,
    points: Number,
    x3: Number,
    x1: Number
});

export const RowLeaderboard = mongoose.model('Leaderboard', leaderboardSchema);