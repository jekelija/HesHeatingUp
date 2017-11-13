const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const League = require('./api/models/league');
const Player = require('./api/models/player');
const PlayerGame = require('./api/models/playerGame');
const Game = require('./api/models/game');
const controller = require('./api/controllers/onFireController');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/onFireDb'); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}
function errorHandler (err, req, res, next) {
    res.status(500);
    res.send('error', { error: err });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

var routes = require('./api/routes/onFireRoutes'); //importing route
routes(app); //register the route

app.listen(port);

const request = require('request');

//make sure NBA league is set up
League.findOne({ leagueName: 'NBA'}, (err, league)=> {
    if(err) {
        console.error('league find error: ' + err);
    }
    else {
        if(!league) {
            const insert = new League();
            insert.save(function(err, task) {
                if (err) {
                    console.error('error saving league');
                }
                else {
                    console.log('saved league');
                }
            });
        }
    }
});

const logPlayerStats = (game, team)=> {
    for(let i = 0; i < team.pstsg.length; ++i) {
        const nbaPlayer = team.pstsg[i];
        //look up the player
        Player.findOne({playerID : nbaPlayer.pid}, (err, player)=> {
            if(err || !player) {
                console.error(err);
                console.error('player find error: ' + nbaPlayer);
            }
            else {
                PlayerGame.findOne({playerID : player._id, gameID: game._id}, (err, existingPG)=> {
                    if(err) {
                        console.error('player/game find error: ' + err);
                    }
                    else if(!existingPG) {
                        //create a player game
                        const newPG = new PlayerGame({
                            playerID : player._id, 
                            gameID: game._id
                        });
                        newPG.save((err, task)=> {
                            if(err) {
                                console.error('Error saving player game: ' + err);
                            }
                            else {
                                console.error('Saved player game: ' + player.name);
                            }
                        });
                    }
                    else {
                        //need to compute stats
                        let update = false;
                        if(existingPG.currentPeriod == game.currentPeriod) {
                            existingPG.currentPeriod = game.currentPeriod;
                            update = true;
                        } 
                        
                        let key = 'q' + existingPG.currentPeriod;
                        if(existingPG.currentPeriod > 4) {
                            key = 'o' + (existingPG.currentPeriod - 4);
                        }
                        //TODO some math to figure out stats based on previous periods
                        
                        
                        if(update) {
                            existingPG.save((err, task)=> {
                                if(err) {
                                    console.error('Error saving player game: ' + err);
                                }
                                else {
                                    console.error('Saved player game: ' + player.name);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};

//TODO this is giving yesterdays games?!
const baseGameUrlPrefix = 'https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/';
const baseGameUrlSuffix = '_gamedetail.json';
//set up polling
const pollGames = ()=> {
    Game.find({}, (err, games)=> {
        for(let i= 0; i < games.length; ++i) {
            const game = games[i];
            const url = baseGameUrlPrefix + game.gameID + baseGameUrlSuffix;
            request(url, function (error, response, body) {
                if(error) {
                    console.error('game poll error:', error); 
                    console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                }
                else {
//                    console.log(body);

                    const jsonBody = JSON.parse(body);
                    
                    //first update the game if necessary                    
                    const updateFunc = (type, jsonTeam)=> {
                        //regular
                        for(let i = 1; i <= 4; ++i) {
                            const key = type + 'Q' + i;
                            if(game[key] != jsonTeam['q' + i]) {
                                game[key] = jsonTeam['q' + i];
                                return true;
                            }
                        }
                        //overtime
                        for(let i = 1; i <= 8; ++i) {
                            const key = type + 'O' + i;
                            if(game[key] != jsonTeam['ot' + i]) {
                                game[key] = jsonTeam['ot' + i];
                                return true;
                            }
                        }
                        return false;
                    };
                    
                    //has the game started?
                    if(jsonBody.g.st == 1) {
                        //game has not started yet
                        console.log(jsonBody.g.gcode + ' has not started');
                    }
                    else if(jsonBody.g.st == 3) {
                        //game is over
                        console.log(jsonBody.g.gcode + ' is over');
                    }
                    else {                        
                        console.log(jsonBody.g.gcode + ' is in progress');
                        
                        let update = false;
                        if(jsonBody.g.p != game.currentPeriod) {
                            game.currentPeriod = jsonBody.g.p;
                            update = true;
                        }
                        if(updateFunc('home', jsonBody.g.hls)) {
                            update = true;
                        }
                        if(updateFunc('away', jsonBody.g.vls)) {
                            update = true;
                        }
                        if(update) {
                            console.log('updating game');
                            game.save((err, task)=> {
                                if(err) {
                                    console.error('error updating game: ' + err.message);
                                }
                            });
                        }
                        
                        logPlayerStats(game, jsonBody.g.vls);
                        logPlayerStats(game, jsonBody.g.hls);
                    }
                        
                }
            });
        }
    });
        
};

setInterval(pollGames, 10000);
