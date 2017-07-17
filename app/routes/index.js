'use strict';

let raceController = require('../controllers/controller.times');

module.exports = function(router) {
    router.get('/tempo', raceController.getAll);
    router.post('/tempo/:raceId', raceController.insert);

    return router;
};