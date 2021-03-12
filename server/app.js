const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Initiate app
const app = express();
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is connected...'))
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

// Set app port
app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
