'use strict';
const mongoose = require('mongoose');
const Team = require('./team');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    homeTeam: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter a team'
    },
    awayTeam: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter a team'
    }
});

module.exports = mongoose.model('Game', GameSchema);
