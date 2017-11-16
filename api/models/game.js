'use strict';
const mongoose = require('mongoose');
const Team = require('./team');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    gameID: {
        type: String,
        unique: true,
        required : 'Game ID',
        tags: { type: [String], index: true }
    },
    gameDate : {
        type: Date,
        required: 'Data required'
    },
    homeTeam: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter a team'
    },
    awayTeam: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter a team'
    },
    currentPeriod: {
        type: Number,
        default: 0
    },
    homeQ1: {
        type: Number,
        default: 0
    },
    homeQ2: {
        type: Number,
        default: 0
    },
    homeQ3: {
        type: Number,
        default: 0
    },
    homeQ4: {
        type: Number,
        default: 0
    },
    homeO1: {
        type: Number,
        default: 0
    },
    homeO2: {
        type: Number,
        default: 0
    },
    homeO3: {
        type: Number,
        default: 0
    },
    homeO4: {
        type: Number,
        default: 0
    },
    homeO5: {
        type: Number,
        default: 0
    },
    homeO6: {
        type: Number,
        default: 0
    },
    homeO7: {
        type: Number,
        default: 0
    },
    homeO8: {
        type: Number,
        default: 0
    },
    awayQ1: {
        type: Number,
        default: 0
    },
    awayQ2: {
        type: Number,
        default: 0
    },
    awayQ3: {
        type: Number,
        default: 0
    },
    awayQ4: {
        type: Number,
        default: 0
    },
    awayO1: {
        type: Number,
        default: 0
    },
    awayO2: {
        type: Number,
        default: 0
    },
    awayO3: {
        type: Number,
        default: 0
    },
    awayO4: {
        type: Number,
        default: 0
    },
    awayO5: {
        type: Number,
        default: 0
    },
    awayO6: {
        type: Number,
        default: 0
    },
    awayO7: {
        type: Number,
        default: 0
    },
    awayO8: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Game', GameSchema);
