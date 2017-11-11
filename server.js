const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const League = require('./api/models/league');
const Game = require('./api/models/game');

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
                
    }
};

//set up polling
const pollGame = (url)=> {
    request(url, function (error, response, body) {
        if(error) {
            console.error('game poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        else {
            const jsonBody = JSON.parse(body);
            
            //does this game already exist?
            Game.find({gameId: jsonBody.g.gid}, (err, game)=> {
                if(err) {
                    console.error(err);
                }
                else if(!game) {
                    //new game needs to be created
                    const newGame = new Game({
                        gameId : json.g.gid,
                        gameDate : json.g.gid,
                        
                        
                        //TODO look up teams
                    });
                    newGame.save(function(err, task) {
                        if (err) {
                            console.error('error saving game');
                        }
                        else {
                            console.log('saved game');
                            logPlayerStats(newGame, jsonBody.g.vls);
                            logPlayerStats(newGame, jsonBody.g.hls);
                        }
                    });
                }
                else {
                    logPlayerStats(game, jsonBody.g.vls);
                    logPlayerStats(game, jsonBody.g.hls);
                }
            });
            
            
            
        }
    });
};

const pollNba = ()=> {
    const todaysGamesUrl = 'https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json';
    
    const baseGameUrlPrefix = 'https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/';
    const baseGameUrlSuffix = '_gamedetail.json';
    
    //get all games, then query each game     
    request(todaysGamesUrl, function (error, response, body) {
        if(error) {
            console.error('nba poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        else {            
            const responseJson = JSON.parse(body);
            const games = responseJson.gs.g;
            for(let i = 0; i < games.length; ++i) {
                //TODO set teams in DB, set them to playing/not playing, figure out where in response it designates if game has started
                const url = baseGameUrlPrefix + games[i].gid + baseGameUrlSuffix;
                pollGame(url);
            }
        }    
            
    });

    
};

setInterval(pollNba, 5000); //poll every 5 seconds
