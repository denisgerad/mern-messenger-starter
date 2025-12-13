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

// Health check endpoint for cron jobs (e.g., ping from Render)
app.get('/cron/health', (req, res) => {
	res.status(200).send('Cron job OK');
});


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo connected'))
.catch(err => console.error(err));


const io = initSocket(server, { clientOrigin });


server.listen(port, () => {
console.log(`Server running on port ${port}`);
});