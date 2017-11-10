const mongoose = require('mongoose');
const request = require('request');
const Game = require('../models/game');
const Team = require('../models/team');
const Player = require('../models/player');

exports.updateRosters = function(req, res) {
    //TODO purge all players NOT updated
    
    const url = 'http://www.nba.com/players/active_players.json';
    request(url, function(error, response, body) {
        if(error) {
            console.error('player poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            res.send(error);
        }
        else {
            const promises = [];
            const responseJson = JSON.parse(body);
            console.log('numPlayers: ' + responseJson.length);
            for(let i = 0; i < responseJson.length; ++i) {
                const player  = responseJson[i];
                console.log(player);
                const p = new Promise((resolve, reject) => {
                    Team.findOne({abbreviation:player.teamData.tricode}, function(err, team) {
                        if(err || !team) {
                            console.error('CANNOT FIND TEAM ' + row.tricode);
                            reject('CANNOT FIND TEAM ' + row.tricode + ' FOR PLAYER ' + player.displayName);
                        }
                        else {
                            //does the player exist?
                            Player.findOne({playerID:player.personId}, function(err, existingPlayer) {
                                if(err || !existingPlayer) {
                                    console.log('Creating new player');
                                    const newPlayer = new Player({
                                        'teamObjectID' : team._id,
                                        'name' : player.displayName,
                                        'playerID' : player.personId
                                    });
                                    newPlayer.save(function(err, task) {
                                        if (err) {
                                            console.error('error saving player ' + player.displayName);
                                            reject(err);
                                        }
                                        else {
                                            console.log('saved player ' + player.displayName);
                                            resolve();
                                        }
                                    });
                                }
                                else {
                                    console.log('Updating ' + player.displayName);
                                    //TODO
                                }
                            });
                        }
                    });
                }); 
                promises.push(p);
            }

            Promise.all(promises).then(values => { 
                console.log('success');
                res.send('Success');
            }, reason => {
                console.error(reason);
                res.status(500).send(reason.message)
            });
        }
    });  
}

exports.updateTeams = function(req, res) {
    
    const url = 'http://data.nba.net/prod/v1/2017/teams.json';

    request(url, function(error, response, body) {
        if(error) {
            console.error('team poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            res.send(error);
        }
        else {
            const promises = [];
            const responseJson = JSON.parse(body);
            console.log('numteams: ' + responseJson.league.standard.length);
            for(let i = 0; i < responseJson.league.standard.length; ++i) {
                const row  = responseJson.league.standard[i];
                if(row.isNBAFranchise == true) {
                    const p = new Promise((resolve, reject) => {
                        Team.findOne({teamID:row.teamId}, function(err, team) {
                            if(err || !team) {
                                console.log('found new team, must create ' + row.tricode);
                                const newTeam = new Team({
                                    'teamID' : row.teamId,
                                    'abbreviation' : row.tricode
                                });
                                newTeam.save(function(err, task) {
                                    if (err) {
                                        console.error('error saving team ' + row.tricode);
                                        reject(err);
                                    }
                                    else {
                                        console.log('saved team ' + row.tricode);
                                        resolve();
                                    }
                                });
                            }
                            else {
                                console.log(row.tricode + ' already in DB');
                                resolve();
                            }
                        });
                    }); 
                    promises.push(p);
                }
            }

            Promise.all(promises).then(values => { 
                console.log('success');
                res.send('Success');
            }, reason => {
                console.error(reason);
                res.status(500).send(reason.message)
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
