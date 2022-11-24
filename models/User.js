import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: String,
    displayName: String,
    email: String,
    photoURL: String,
    results: []
});

export const User = mongoose.model('User', userSchema);