const hapi = require('hapi');
const joi = require('joi');
const vision = require('vision');
const mysql = require('mysql');

// Configuring the server
const server = new hapi.Server();

server.connection({
	host : 'localhost',
	port : 8080
})

// Registering vision
server.register(vision, (err)=>{
	if(err) {
		console.log(err);
	}

	server.views({
		engines : {
			html : require('handlebars')
		},
		relativeTo : __dirname,
		path : 'templates'
	})

	server.route(require('./routes'));
	
	server.start((err)=>{
		if(err) {
			console.log(err);
		}
		console.log("Server running at "+server.info.uri);
	})
})

server.register(require('inert'), (err)=>{
	if(err) {
		console.log(err);
	}

	server.route({
		method : 'GET',
		path : '/css/{param*}',
		handler : {
			directory : {
				path : 'css'
			}
		}
	})

	server.route({
		method : 'GET',
		path : '/js/{param*}',
		handler : {
			directory : {
				path : 'js'
			}
		}
	})

	server.route({
		method : 'GET',
		path : '/images/{param*}',
		handler : {
			directory : {
				path : 'images'
			}
		}
	})

	server.route({
		method : 'GET',
		path : '/icomoon/{param*}',
		handler : {
			directory : {
				path : 'icomoon'
			}
		}
	})
})