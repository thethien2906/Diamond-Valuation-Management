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
const sealRoutes = require('./routes/sealRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./models/Booking');
const Transaction = require('./models/Transaction');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const app = express();

// Stripe Middleware 
app.post('/api/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event checkout.session.completed to update paymentStatus to 'Paid'
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update the booking's payment status to "Paid"
      try {
        await Booking.findByIdAndUpdate(session.metadata.bookingId, { paymentStatus: 'Paid', paymentIntentId: session.payment_intent });
        console.log(`Payment status updated for booking ${session.metadata.bookingId}`);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }

      break;
      case 'charge.succeeded':
        const charge = event.data.object;
        // Create a new Transaction object
        try {
          const transaction = new Transaction({
            time: new Date(charge.created * 1000 + 7 * 60 * 60 * 1000).toISOString(),
            amount: charge.amount,
            currency: charge.currency,
            customerEmail: charge.billing_details.email,
            customerName: charge.billing_details.name,
            bookingId: charge.metadata.bookingId, // Assuming bookingId is stored in metadata
            paymentMethod: charge.payment_method_details.type,
            isLiveMode: charge.livemode,
          });
  
          await transaction.save();
          console.log(`Transaction recorded: ${transaction._id}`);
        } catch (error) {
          console.error('Error recording transaction:', error);
        }
        break;
        case 'charge.refunded':
          const refund = event.data.object;
          // Update the booking's payment status to "Refunded"
          try {
            const bookingId = refund.metadata.bookingId;
            await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Refunded' });
            await Transaction.findOneAndDelete({ bookingId: refund.metadata.bookingId });
            console.log(`Payment status updated to refunded for booking ${bookingId}`);
          } catch (error) {
            console.error('Error updating refund status:', error);
          }
          break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});





app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
app.use('/api', sealRoutes);
app.use('/api', serviceRoutes); 

app.use('/api', paymentRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
