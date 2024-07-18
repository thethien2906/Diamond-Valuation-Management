const mongoose = require('mongoose');
const Booking = require('./Booking'); // Adjust the path if needed

// MongoDB connection string
const mongoURI = 'mongodb+srv://admin:TNsb5tyrOvEJbKW5@backenddb.c619lfz.mongodb.net/DB?retryWrites=true&w=majority&appName=BackendDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');

    // Example data to insert
    const bookings = [
      {
        "_id": "6690ded6e97898fa2d428da5",
        "name": "ewqeqw",
        "email": "concaycaycon@gmail.com",
        "phoneNumber": "123132131212",
        "identityCard": "12323213",
        "address": "12312312",
        "date": "2024-07-13",
        "time": "15:44",
        "status": "pending",
        "consultantId": "666e458f4b273b452b32ab03",
        "customerId": "668f9717f98593e415ac8e0a",
        "serviceId": "6678c297f2e64a9322bce444",
        "paymentStatus": "Paid",
        "createdAt": "2024-07-12T07:44:22.857Z",
        "__v": 0,
        "paymentIntentId": "pi_3Pbe96Rx0XBTHEAY02lbkQ6p"
      },
      
    ];

    // Insert sample data
    Booking.insertMany(bookings)
      .then(() => {
        console.log('Sample data inserted successfully');
      })
      .catch((err) => {
        console.error('Error inserting sample data:', err);
      })
      .finally(() => {
        mongoose.connection.close(); // Close the connection after inserting data
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
