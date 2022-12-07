import fetch from "node-fetch";
import { LiveScore } from "./models/LiveScore.js";
import { Match } from './models/Match.js';

const getLiveMatches = () => {
    fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${process.env.APIFOOTBALL}&&league_id=28&match_live=1`)
        .then(res => {
            return res.arrayBuffer()
        }).then(data => {
            const enc = new TextDecoder('utf-8');

            const res = enc.decode(data);

            if (res.includes('nginx') || res.includes('No event found')) return;

            const resJSON = JSON.parse(res);

            resJSON.forEach(async (match) => {
                const { match_id, match_hometeam_name, match_hometeam_ft_score, match_awayteam_name, match_awayteam_ft_score, match_status } = match;

                const matchID = match_id;
                const homeTeam = match_hometeam_name;
                const awayTeam = match_awayteam_name;
                const homeTeamScore = Number(match_hometeam_ft_score);
                const awayTeamScore = Number(match_awayteam_ft_score);
                const matchTime = match_status;

                if (matchTime === 'Finished') {

                    await Match.findOneAndUpdate({ HomeTeam: homeTeam, AwayTeam: awayTeam }, {
                        HomeTeamScore: homeTeamScore,
                        AwayTeamScore: awayTeamScore
                    });

                    await fetch('/api/leaderboard/update');

                } else {

                    await LiveScore.findOneAndUpdate({ matchID: matchID }, {
                        matchID,
                        homeTeam,
                        awayTeam,
                        homeTeamScore,
                        awayTeamScore,
                        matchTime
                    }, { upsert: true });

                }
            });

        }).catch(err => {
            console.log(err);
        });
};

export { getLiveMatches };