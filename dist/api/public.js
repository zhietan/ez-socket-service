"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var router = (0, _express.Router)();

    // perhaps expose some API metadata at the root
    router.get('/', function (req, res) {
        res.sendFile(_path2.default.resolve('./src/public/index.html'));
    });

    return router;
};
//# sourceMappingURL=public.js.map