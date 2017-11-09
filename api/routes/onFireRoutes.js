'use strict';
module.exports = function(app) {
    const controller = require('../controllers/onFireController');
    app.route('/updateTeams')
    .post(controller.updateTeams);
    app.route('/updateRosters')
    .post(controller.updateRosters);
};