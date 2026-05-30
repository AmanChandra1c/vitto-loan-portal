require('dotenv').config();
const express = require('express');
const cors = require('cors');
const applicationsRouter = require('./routes/applications');
const usersRouter = require('./routes/users');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', applicationsRouter);
app.use('/api', usersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
