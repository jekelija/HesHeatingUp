'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Enter username',
        tags: { type: [String], index: true }
    },
    email: {
        type: String,
        unique: true,
        required: 'Enter email',
        tags: { type: [String], index: true },
        validate: {
            validator: function(v) {
                return validator.isEmail(v);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: 'Enter password',
        minLength: 7,
        validate: {
            validator: function(v) {
                return isEmail(v);
            },
            message: '{VALUE} is not a valid email'
        }
    }
});

UserSchema.set('autoIndex', false);
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);
