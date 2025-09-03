const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/connectDB');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/user/transactions', require('./routes/transactionRoutes'));

// Serve React static files
const clientBuildPath = path.join(__dirname, './client/build');
app.use(express.static(clientBuildPath));

// Fallback for React Router (catch-all route)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT = ${PORT}`.cyan.bold);
});
