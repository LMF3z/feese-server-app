const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectionDB } = require('./config/mysql');

const router = require('./routes/index');

const app = express();

const PORT = process.env.PORT || 3002;

app.set('port', PORT);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ message: 'Hello world :)' });
});
app.use('/api', router);

app.listen(app.get('port'), async () => {
  await connectionDB.connect();
  console.log(`API running on port ${app.get('port')}`);
});
