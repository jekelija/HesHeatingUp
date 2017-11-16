'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    teamID: {
        type: String,
        unique: true,
        required: 'Enter team id',
        tags: { type: [String], index: true }
    },
    abbreviation: {
        type: String,
        unique: true,
        required: 'Kindly enter the abbreviation of the team',
        tags: { type: [String], index: true }
    },
    status: {
        type: [{
            type: String,
            enum: ['playing', 'not playing']
        }],
        default: ['not playing']
    }
});

TeamSchema.set('autoIndex', false);

module.exports = mongoose.model('Team', TeamSchema);
