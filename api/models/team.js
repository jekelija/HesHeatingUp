'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the team'
    },
    abbreviation: {
        type: String,
        required: 'Kindly enter the abbreviation of the team'
    },
    status: {
        type: [{
            type: String,
            enum: ['playing', 'not playing']
        }],
        default: ['not playing']
    }
});

module.exports = mongoose.model('Team', TeamSchema);