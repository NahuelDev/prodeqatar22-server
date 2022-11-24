import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    MatchNumber: Number,
    RoundNumber: Number,
    DateUtc: String,
    Location: String,
    HomeTeam: String,
    AwayTeam: String,
    Group: String,
    HomeTeamScore: Number,
    AwayTeamScore: Number
});

export const Match = mongoose.model('Match', matchSchema);