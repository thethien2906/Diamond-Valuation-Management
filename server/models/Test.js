// Assuming you have already set up Mongoose connection
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); // Path to your Transaction model file
// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:TNsb5tyrOvEJbKW5@backenddb.c619lfz.mongodb.net/DB?retryWrites=true&w=majority&appName=BackendDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
// Function to insert a transaction
async function insertTransaction() {
  try {
    // Create a new transaction instance
    const newTransaction = new Transaction({
      time: '2024-07-02T11:42:08.000Z',
      amount: 100,
      currency: 'USD',
      customerEmail: 'john.doe@example.com',
      customerName: 'John Doe',
      paymentMethod: 'Credit Card',
      isLiveMode: true,
    });

    // Save the transaction to the database
    const savedTransaction = await newTransaction.save();
    console.log('Transaction saved successfully:', savedTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
  } finally {
    // Close the connection after saving
    mongoose.disconnect();
  }
}

// Call the insertTransaction function to insert a transaction
insertTransaction();
