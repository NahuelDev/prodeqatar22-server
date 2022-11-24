import { Router } from "express";
import { User } from "../models/User.js";

const userRouter = Router();

userRouter.post('/', (req, res) => {
    const { uid, displayName, email, photoURL } = req.body;
    const user = new User({
        uid,
        displayName,
        email,
        photoURL
    });
    let error = false;

    user.save().then(() => {

        console.log('User created');
    }, err => {
        console.log(err);
        error = true;
    });

    res.json({
        error: error
    }).end();

});

userRouter.get('/:userID', async (req, res) => {
    const userID = req.params.userID;

    const existsUser = Boolean(await User.findOne({ uid: userID }).exec());

    res.json({
        exists: existsUser
    }).end();
});

userRouter.get('/:userID/results', async (req, res) => {
    const userID = req.params.userID;

    const results = (await User.findOne({ uid: userID }).select('results')).results;
    console.log(`Predictions for user ${userID}`);
    res.json({
        results
    });
});

userRouter.put('/:userID', async (req, res) => {
    const match = req.body.match;

    const doc = await User.findOne({ uid: req.params.userID });

    const alreadyExists = doc.results.some(m => m.MatchNumber === match.MatchNumber);

    if (alreadyExists) {
        doc.results = doc.results.map(m =>
            m.MatchNumber === match.MatchNumber ? match : m
        );
    } else {
        doc.results.push(match);

    }

    doc.save()
        .then(() => {
            console.log(`Match ${match.MatchNumber} updated for user ${doc.displayName}`);
        }, err => {

        });

    res.json({
        error: 'No errors'
    });

});

export default userRouter;