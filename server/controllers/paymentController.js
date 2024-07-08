const Stripe = require('stripe');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { sendEmail } = require('../config/emailService');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const createCheckoutSession = async (req, res) => {
  const { bookingId } = req.body;

  try {
    // Find the booking and service details
    const booking = await Booking.findById(bookingId).populate('serviceId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.serviceId.name,
            },
            unit_amount: Math.round(booking.serviceId.price * 100), // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment/success`,
      cancel_url: `http://localhost:5173/payment/cancel?bookingId=${bookingId}`,
      metadata: {
        bookingId: bookingId, // Add bookingId to metadata
        // UserId: booking.customerId,
      },
    });
    
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const rejectBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be rejected' });
    }

    // Process the refund
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
    });

    // Update the booking status to 'rejected' and payment status to 'Refunded'
    booking.status = 'rejected';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    // Send email
    await sendEmail(
      booking.email,
      'Booking Rejected and Refunded',
      `Your booking for ${booking.serviceId.name} has been rejected and your payment has been refunded. If you have any questions, please contact us.`
    );
    res.json({ message: 'Booking rejected and payment refunded', refund });
  } catch (error) {
    console.error('Error rejecting booking and processing refund:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { createCheckoutSession, rejectBooking, cancelBooking };
