const Stripe = require('stripe');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      cancel_url: `http://localhost:5173/payment/cancel`,
      metadata: {
        bookingId: bookingId, // Add bookingId to metadata
        UserId: booking.userId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { createCheckoutSession};
