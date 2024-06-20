const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const valuationRecordRoutes = require('./routes/valuationRecordRoutes');
const commitRoutes = require('./routes/commitRoutes');
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', receiptRoutes); 
app.use('/api', valuationRecordRoutes)
app.use('/api', commitRoutes);
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
