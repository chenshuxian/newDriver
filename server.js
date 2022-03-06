// server.js
let FileStreamRotator = require('file-stream-rotator');
const express = require('express');
const next = require('next');
const fs = require('fs');
const url = require('url');
var morgan = require('morgan');
var path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const http = require('http');
const https = require('https');

const dayjs = require('dayjs');
const exp = require('constants');

// var options = {
//   key: fs.readFileSync("./ssl/old/lieyu.fantasyball.tw.key"),
//   cert: fs.readFileSync("./ssl/old/lieyu.fantasyball.tw.chained.crt"),
// };

app.prepare().then(() => {
	const app = express();

	// var logDirectory = path.join(__dirname, 'log');

	// // ensure log directory exists
	// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	// // create a rotating write stream
	// var accessLogStream = FileStreamRotator.getStream({
	// 	date_format: 'YYYYMMDD',
	// 	filename: path.join(logDirectory, 'access-%DATE%.log'),
	// 	frequency: 'daily',
	// 	verbose: false,
	// });
	// // setup the logger
	// app.use(morgan('combined', { stream: accessLogStream }));
	// create static server
	app.use(express.static(path.join(__dirname + '/static/download')));

	app.all('*', async (req, res) => {
		return handle(req, res);
	});

	var httpsServer = http.createServer(app);

	httpsServer.listen(3000, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${3000}`);
	});
});
