'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
    leagueName: {
        type: String,
        default: 'NBA'
    },
    leagueID: {
        type: String,
        default: '00'
    }
});

module.exports = mongoose.model('League', LeagueSchema);
