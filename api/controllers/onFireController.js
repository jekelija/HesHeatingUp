const mongoose = require('mongoose');
const request = require('request');
const Game = require('../models/game');
const Team = require('../models/team');
const Player = require('../models/player');
const PlayerGame = require('../models/playerGame');

const findTeamById = (teamId)=> {
    const promise = new Promise((resolve, reject)=> {
        Team.findOne({teamID:teamId}, function(err, team) {
            if(err) {
                reject(err.message);
            }
            else if(!team) {
                reject("Cannot find team " + teamId);
            }
            else {
                resolve(team);
            }
        });
    });
    return promise;
};

exports.deleteGames = function(req, res) {
    if(Game.collection) {
        Game.collection.drop((err, dropped)=> {
            //error code 26 just means nothing to delete
            if(err && err.code != 26){
                res.status(500).send(err.message);
            }
            else {
                if(PlayerGame.collection) {
                    PlayerGame.collection.drop((err, dropped)=> {
                        //error code 26 just means nothing to delete
                        if(err && err.code != 26){
                            res.status(500).send(err.message);
                        }
                        else {
                            res.send("success");
                        }
                    });
                }
            }
        });
    }
        
}

exports.updateGames = function(req, res) {
    const todaysGamesUrl = 'https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json';
    
    //get all games, then query each game     
    request(todaysGamesUrl, function (error, response, body) {
        if(error) {
            console.error('nba poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            res.send(error);
        }
        else {        
            const promises = [];
            const responseJson = JSON.parse(body);
            const games = responseJson.gs.g;
            for(let i = 0; i < games.length; ++i) {
                const game = games[i];
                
                const p = new Promise((resolve, reject) => {
                    //does this game already exist?
                    Game.findOne({gameID: game.gid}, (err, existingGame)=> {
                        if(err) {
                            console.error(err);
                            reject(err);
                        }
                        else if(!existingGame) {
                            findTeamById(game.h.tid).then(homeTeam=> {
                                findTeamById(game.v.tid).then(visitorTeam=> {
                                    //new game needs to be created
                                    const newGame = new Game({
                                        gameID : game.gid,
                                        gameDate : responseJson.gs.gdte,
                                        homeTeam : homeTeam._id,
                                        awayTeam : visitorTeam._id
                                    });
                                    newGame.save(function(err, task) {
                                        if (err) {
                                            console.error('error saving game');
                                            reject(err);
                                        }
                                        else {
                                            console.log('saved game ' + game.gcode);
                                            resolve();
                                        }
                                    });
                                });
                            });
                        }
                        else {
                            console.log('Game already exists: ' + existingGame.gameID);
                            resolve();
                        }
                    });    
                });
                                
            }
            
            Promise.all(promises).then(
                ()=> {
                    res.send('success');
                },
                (reason)=> {
                    res.status(500).send(reason.message)
                }
            );
        }    
            
    });
}

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
                res.send('success');
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
