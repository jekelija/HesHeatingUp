'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt   = require('bcrypt-nodejs');

const UserSchema = new Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
//    username: {
//        type: String,
//        unique: true,
//        required: 'Enter username',
//        tags: { type: [String], index: true }
//    },
//    email: {
//        type: String,
//        unique: true,
//        required: 'Enter email',
//        tags: { type: [String], index: true },
//        validate: {
//            validator: function(v) {
//                return validator.isEmail(v);
//            },
//            message: '{VALUE} is not a valid email'
//        }
//    },
//    password: {
//        type: String,
//        required: 'Enter password',
//        minLength: 7,
//        validate: {
//            validator: function(v) {
//                return isEmail(v);
//            },
//            message: '{VALUE} is not a valid email'
//        }
//    }
});


UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

UserSchema.set('autoIndex', false);
//UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);
