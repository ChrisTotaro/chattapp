if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const { Server } = require('socket.io');

// Controllers
const user = require('./controllers/user');
const room = require('./controllers/room');
const messageDB = require('./controllers/message');
const chat = require('./controllers/chat');

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

// Routes
const userRoutes = require('./routes/routes');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();

// Create HTTP server using the Express app
const server = http.createServer(app);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse urlencoded request bodies
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Enable flash messages
app.use(flash());

// Enable sessions
const sessionStore = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

// Initialize Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Enable method override for PUT and DELETE requests
app.use(methodOverride('_method'));

// Use routes defined in './routes/routes.js'
app.use('/', userRoutes);
app.use('/admin', adminRoutes);



// Initialize Socket.IO server using the HTTP server
const io = new Server(server);

// Authenticate Socket.IO connections using Passport
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'express.sid',
  secret: process.env.SESSION_SECRET,
  store: sessionStore
}));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('User connected!');

  // Join a chat room
  socket.on('joinRoom', async (roomName, username) => {
    console.log(`User ${username} joined room ${roomName}`);
    socket.join(roomName);
    socket.currentRoom = roomName;
    //socket.username = username;
  });

  // Get previous messages for the current room
  socket.on('get-prev-messages', async () => {
    console.log('Get the previous messages from', socket.currentRoom);
    let prevMessages = await messageDB.getPrevMessages(socket.currentRoom);
    //prevMessages = [];
    socket.emit('prevMessages', prevMessages);
  });

  // Handle new chat messages
  socket.on('message', async (data) => {
    const time_stamp = new Date().toLocaleString('en-US', timeOptions).replace(' ', '');
    const userId = await user.getUserByUsername(data.username);
    const roomId = await room.getRoomByName(data.room);

    messageDB.upload(data.message, userId, roomId, time_stamp);

    socket.broadcast.to(socket.currentRoom).emit('message', {
      username: data.username,
      message: data.message,
      time_stamp: time_stamp,
    });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected.', socket.id)
  });
});

// Start the server and listen on port 9000.
server.listen(9000, () => {
  console.log('Server listening on port 9000');
});
