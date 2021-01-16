'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _http = require('http');
var _http2 = _interopRequireDefault(_http);
var _express = require('express');
var _express2 = _interopRequireDefault(_express);
var _cors = require('cors');
var _cors2 = _interopRequireDefault(_cors);
var _morgan = require('morgan');
var _morgan2 = _interopRequireDefault(_morgan);
var _bodyParser = require('body-parser');
var _bodyParser2 = _interopRequireDefault(_bodyParser);
var _db = require('./db');
var _db2 = _interopRequireDefault(_db);
var _middleware = require('./middleware');
var _middleware2 = _interopRequireDefault(_middleware);
var _public = require('./api/public');
var _public2 = _interopRequireDefault(_public);
var _api = require('./api');
var _api2 = _interopRequireDefault(_api);
var _env = require('./env');
var _env2 = _interopRequireDefault(_env);
var _socket = require('socket.io');
var _socket2 = _interopRequireDefault(_socket);



function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	};
}

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
var io = (0, _socket2.default)(app.server);

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)({
	exposedHeaders: _env2.default.corsHeaders
}));

app.use(_bodyParser2.default.json({
	limit: _env2.default.bodyLimit
}));

// connect to db
(0, _db2.default)(function (db) {

	// internal middleware
	app.use((0, _middleware2.default)({
		env: _env2.default,
		db: db
	}));

	// public router
	app.use('/', (0, _public2.default)({
		env: _env2.default,
		db: db
	}));

	// api router
	app.use('/api', (0, _api2.default)({
		env: _env2.default,
		db: db
	}));

	app.server.listen(process.env.PORT || _env2.default.port, function () {
		console.log('Started on port ' + app.server.address().port);
	});
});

var users = [];
io.on('connection', function (socket) {
	var user = {};
	io.emit("connected");
	io.emit("usersConnected", {
		users: users
	});


	socket.on('is-online', (user) => {
		console.log('is_online', user)
		io.emit('online',{
			online: true,
			user: user
		})
	});

	socket.on('lat-long', (latlong) => {
		console.log('lat long', latlong)
		io.emit('get-latlong', latlong);
		
	});


});

exports.default = app;
//# sourceMappingURL=index.js.map