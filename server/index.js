const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
const cors = require('cors');

const allowedOrigins = [
  "http://localhost:5173",
  "https://engineering-management-system.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true)
      };
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/engineers', require('./routes/engineers'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/assignments', require('./routes/assignments'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
