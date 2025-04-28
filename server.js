const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const notesRoutes = require('./routes/notes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


db.connectDB();

app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Notes API is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
