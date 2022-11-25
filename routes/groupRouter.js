import { Router } from "express";
import { Group } from "../models/Group.js";

const groupRouter = Router();

groupRouter.get('/', async (req, res) => {
    const groups = await Group.find({}).select('-_id');
    console.log('Groups requested.');
    res.json(groups);
});

export default groupRouter;