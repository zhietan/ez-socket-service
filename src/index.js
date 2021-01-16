import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import publicRoute from './api/public'
import api from './api';
import env from './env';
import socketio from 'socket.io';


let app = express();
app.server = http.createServer(app);
let io = socketio(app.server);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: env.corsHeaders
}));

app.use(bodyParser.json({
	limit : env.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ env, db }));

	// public router
	app.use('/', publicRoute({ env, db }));

	// api router
	app.use('/api', api({ env, db }));

	app.server.listen(process.env.PORT || env.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});



var users = []
io.on('connection', function (socket) {
	var user = {}
	io.emit("connected")
	io.emit("usersConnected", {users:users})


	socket.on('disconnect', ()=>{
		userDisconnect()
	})
	socket.on("userDisconnect", ()=>{
		userDisconnect()
	})
	var userDisconnect = ()=>{
		if(user.u_id){
			// console.log("disconnect :"+user.u_id)
			users.forEach((v,k)=>{
				if(v.u_id == user.u_id) users.splice(k,1)
			})
			io.emit('userDisconnected', user);
			io.emit("usersConnected", {users:users})
		}
	}
});

export default app;
