'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PlayerSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the player'
    },
    points: {
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

const TeamSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the team'
    },
    status: {
        type: [{
            type: String,
            enum: ['playing', 'not playing']
        }],
        default: ['not playing']
    }
});

module.exports = mongoose.model('Players', PlayerSchema);
module.exports = mongoose.model('Teams', TeamSchema);