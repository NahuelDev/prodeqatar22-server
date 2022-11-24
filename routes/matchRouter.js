import { Router } from "express";
import { Match } from "../models/Match.js";

const matchRouter = Router();

matchRouter.get('/', async (req, res) => {
    const matches = await Match.find({}).select('-_id');
    console.log('Matches requested.');
    res.json(matches);
});

export default matchRouter;