const socket = require('socket.io'),
    express = require('express'),
    app = express();

const port = process.env.PORT || 8000;

const io = socket.listen(app.listen(port));

require('./route')(app, io);
require('./config')(app, io);

console.log('Visit localhost:' + port);


