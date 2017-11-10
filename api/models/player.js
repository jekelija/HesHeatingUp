'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the player'
    },
    playerID: {
        type: String,
        required: 'Enter player id',
        tags: { type: [String], index: true }
    },
    teamObjectID : {
        type: Schema.ObjectId,
        required: 'Kindly enter the mongoose id of the team this player is on'
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

module.exports = mongoose.model('Player', PlayerSchema);
