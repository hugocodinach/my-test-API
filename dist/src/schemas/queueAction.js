"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueActionModel = void 0;
var _data = require("./../utils/data");
var queueActionSchema = new _data.dbQueue.Schema({
  name: String,
  launchDate: String
});
var queueActionModel = _data.dbQueue.model('queue', queueActionSchema);
exports.queueActionModel = queueActionModel;