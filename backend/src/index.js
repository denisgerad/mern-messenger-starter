const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { port, mongoUri, clientOrigin } = require('./config');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const initSocket = require('./socket');


const app = express();
const server = http.createServer(app);


app.use(cors({ origin: clientOrigin }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo connected'))
.catch(err => console.error(err));


const io = initSocket(server, { clientOrigin });


server.listen(port, () => {
console.log(`Server running on port ${port}`);
});