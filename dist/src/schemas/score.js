"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scoreModel = void 0;
var _data = require("./../utils/data");
var scoreSchema = new _data.dbGame.Schema({
  playerScore: Number,
  computerScore: Number
});
var scoreModel = _data.dbGame.model('score', scoreSchema);
exports.scoreModel = scoreModel;