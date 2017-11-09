const request = require('request');
const Game = require('../models/game');
const Team = require('../models/team');
const League = require('../models/league');

function getCurrentSeason() {
    const d = new Date();
    if(d.getMonth >= 8) {
        let nextYear = d.getYear() + 1;
        nextYear = nextYear % 1000; //cut off the first 2 digits
        return d.getYear() + '-' + nextYear;
    }
    else {
        const lastYear = d.getYear() - 1;
        const thisYear = d.getYear() % 1000; //cut off the first 2 digits
        return lastYear + '-' + thisYear;
    }
}

exports.updateRosters = function(req, res) {
    const season = getCurrentSeason();
    League.findOne({ leagueName: 'NBA'}, (err, league)=> {
        if(err) {
            console.error(err);
            res.send(err);
        }
        else {
            Team.find((err, team)=> {
                if(err) {
                    console.error(err);
                    res.send(err);
                }
                else {
                    request('https://stats.nba.com/stats/commonteamroster?LeagueID=' + league.leagueID + '&Season=' + season + '&TeamID=' + team._id.toString(), (error, response, body)=> {
                        if(err) {
                            console.error(err);
                            res.send(err);
                        }
                        else {
                            console.log(body);
                        }
                    });
                }
            });
        }
    });             
            
}

exports.updateTeams = function(req, res) {
    const currentYear = new Date().getYear();
    League.findOne({ leagueName: 'NBA'}, (err, league)=> {
        if(err) {
            console.error(err);
            res.send(err);
        }
        else {
            const url = 'https://stats.nba.com/stats/commonteamyears?LeagueID=' + league.leagueID;
            console.log('query: ' + url);
            request(url, function(error, response, body) {
                //TODO THIS NEVER RETURNS?! WHAT THE HECK?! IT RETURNS IN POSTMAN... find another endpoint.
                console.log('QUERY RETURNED');
                if(error) {
                    console.error('team poll error:', error); 
                    console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    res.send(error);
                }
                else {
                    const promises = [];
                    const responseJson = JSON.parse(body);
                    console.log('responseJson: ' + body);
                    for(let i = 0; i < responseJson.resultSets.rowSet.length; ++i) {
                        const row  = responseJson.resultSets.rowSet[i];
                        if(row['3'] == currentYear) {
                            const p = new Promise((resolve, reject) => {
                                const id = new mongoose.mongo.ObjectId(row['1']);
                                Team.findById(id, (err, team)=> {
                                    if(err || !team) {
                                        console.log('found new team, must create ' + row['4']);
                                        const newTeam = new Team({
                                            '_id' : id,
                                            'abbreviation' : row['4']
                                        });
                                        newTeam.save(function(err, task) {
                                            if (err) {
                                                console.error('error saving team ' + row['4']);
                                                reject(err);
                                            }
                                            else {
                                                console.log('saved team ' + row['4']);
                                                resolve();
                                            }
                                        });
                                    }
                                    else {
                                        console.log(row['4'] + ' already in DB');
                                        resolve();
                                    }
                                });
                            }); 
                            promises.push(p);
                        }
                    }
                    
                    Promise.all(promises).then(values => { 
                        res.send('Success');
                    }, reason => {
                        res.send(reason)
                    });
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
