const request = require('request');
const Game = require('../models/game');
const Team = require('../models/team');
const League = require('../models/league');

//https://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2017-18&TeamID=1610612738

exports.updateTeams = function() {
    const currentYear = new Date().getYear();
    League.findOne({ leagueName: 'NBA'}, (err, league)=> {
        if(err) {
            console.error(err);
        }
        else {
            request('http://stats.nba.com/stats/commonteamyears?LeagueID=' + league.leagueID, (error, response, body)=> {
                if(error) {
                    console.error('team poll error:', error); 
                    console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                }
                else {
                    const responseJson = JSON.parse(body);
                    for(let i = 0; i < responseJson.resultSets.rowSet.length; ++i) {
                        const row  = responseJson.resultSets.rowSet[i];
                        if(row['3'] == currentYear) {
                            const id = new mongoose.mongo.ObjectId(row['1']);
                            Team.findById(id, (err, team)=> {
                                if(err) {
                                    console.log('found new team, must create ' + row['4']);
                                    //TODO
                                }
                                else {
                                    console.log(row['4'] + ' already in DB');
                                }
                            });
                        }
                    }
                }
            });
        }
    });    
}

exports.createGame = function(homeTeamName, awayTeamName) {
    Team.findOne({ name: homeTeamName }, function (err, homeTeam) {
        if(err) {
            console.error(err);
        }
        else {
            Team.findOne({ name: awayTeamName }, function (err, awayTeam) {
                if(err) {
                    console.error(err);
                }
                else {
                    const game = new Game({ homeTeam: homeTeam, awayTeam: awayTeam });

                }
            });
        }
    });
};
