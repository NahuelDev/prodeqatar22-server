import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: String,
    teams: []
});

export const Group = mongoose.model('Group', groupSchema);