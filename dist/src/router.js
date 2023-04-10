"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;
var _express = _interopRequireDefault(require("express"));
var _queue = require("./routes/queue");
var _score = require("./routes/score");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//Imports

var router = _express["default"].Router();
exports.router = router;
router.route('/queue').get(_queue.getQueue);
router.route('/queue/action').post(_queue.postQueueAction);
router.route('/queue/action/:id')["delete"](_queue.deleteQueueAction);
router.route('/score').get(_score.getScore);
router.route('/score').put(_score.putScore);
router.route('*').all(function (req, res) {
  return res.status(404).json({
    'error': 'API route not found'
  });
});