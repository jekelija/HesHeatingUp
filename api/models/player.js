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
        unique: true,
        required: 'Enter player id',
        tags: { type: [String], index: true }
    },
    teamObjectID : {
        type: Schema.ObjectId,
        ref: 'Team',
        required: 'Kindly enter the mongoose id of the team this player is on'
    }
});

PlayerSchema.set('autoIndex', false);

module.exports = mongoose.model('Player', PlayerSchema);
