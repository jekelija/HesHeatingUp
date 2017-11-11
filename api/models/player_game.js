'use strict';
const mongoose = require('mongoose');
const Game = require('./game');
const Schema = mongoose.Schema;

const PlayerGame = new Schema({
    gameId: {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter a game'
    },
    q1_points: {
        type: Number,
        default: 0
    },
    q2_points: {
        type: Number,
        default: 0
    },
    q3_points: {
        type: Number,
        default: 0
    },
    q4_points: {
        type: Number,
        default: 0
    },
    q1_tpm: {
        type: Number,
        default: 0
    },
    q2_tpm: {
        type: Number,
        default: 0
    },
    q3_tpm: {
        type: Number,
        default: 0
    },
    q4_tpm: {
        type: Number,
        default: 0
    },
    total_points: {
        type: Number,
        default: 0
    },
    total_tpm: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('PlayerGame', PlayerGame);
