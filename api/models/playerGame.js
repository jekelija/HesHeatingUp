'use strict';
const mongoose = require('mongoose');
const Game = require('./game');
const Schema = mongoose.Schema;

const PlayerGameSchema = new Schema({
    gameID: {
        type: Schema.ObjectId,
        ref: 'Game',
        required: 'Kindly enter a game'
    },
    playerID: {
        type: Schema.ObjectId,
        ref: 'Player',
        required: 'Kindly enter a player'
    },
    currentPeriod: {
        type: Number,
        default: 0
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
    o1_points: {
        type: Number,
        default: 0
    },
    o2_points: {
        type: Number,
        default: 0
    },
    o3_points: {
        type: Number,
        default: 0
    },
    o4_points: {
        type: Number,
        default: 0
    },
    o5_points: {
        type: Number,
        default: 0
    },
    o6_points: {
        type: Number,
        default: 0
    },
    o7_points: {
        type: Number,
        default: 0
    },
    o8_points: {
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
    o1_tpm: {
        type: Number,
        default: 0
    },
    o2_tpm: {
        type: Number,
        default: 0
    },
    o3_tpm: {
        type: Number,
        default: 0
    },
    o4_tpm: {
        type: Number,
        default: 0
    },
    o5_tpm: {
        type: Number,
        default: 0
    },
    o6_tpm: {
        type: Number,
        default: 0
    },
    o7_tpm: {
        type: Number,
        default: 0
    },
    o8_tpm: {
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
    },
    status: {
        type: [{
            type: String,
            enum: ['playing', 'not playing']
        }],
        default: ['not playing']
    }
});

PlayerGameSchema.index({gameID: 1, playerID: 1}, {unique: true});
PlayerGameSchema.set('autoIndex', false);

module.exports = mongoose.model('PlayerGame', PlayerGameSchema);
