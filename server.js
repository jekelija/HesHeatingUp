const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port);

const request = require('request');

const pollGame = (url)=> {
    request(url, function (error, response, body) {
        if(error) {
            console.error('game poll error:', error); 
            console.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        else {
            console.log(body);
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
                //TODO cant just set interval, otherwise we compound. need to store in DB
                const url = baseGameUrlPrefix + games[i].gid + baseGameUrlSuffix;
                pollGame(url);
            }
        }    
            
    });

    
};

setInterval(pollNba, 15000); //poll every 15 seconds

console.log('todo list RESTful API server started on: ' + port);