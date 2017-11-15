'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TriggerSchema = new Schema({
    userID: {
        type: String,
        ref: 'User',
        required: 'Kindly enter a user'
    },
    playerID: {
        type: String,
        ref: 'Player',
        required: 'Kindly enter a player'
    }
    //TODO
});

//could have multiple triggers on one player
TriggerSchema.index({userID: 1, playerID: 1}, {unique: false});
TriggerSchema.set('autoIndex', false);


module.exports = mongoose.model('Trigger', TriggerSchema);
