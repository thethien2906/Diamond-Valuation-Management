const Booking = require('../models/Booking');
const User = require('../models/User');
const transporter = require('../config/nodemailer');
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const consultant = await User.findOne({ userID: bookingData.consultantId });
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found." });
    }
    const newBooking = new Booking({
      ...bookingData,
      status: "pending",
      consultantId: consultant._id,
    });
    await newBooking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: 'pending' });
    res.json(pendingBookings);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPendingBookingsByConsultant = async (req, res) => {
  try {
    const consultantId = req.params.consultantId;
    const consultant = await User.findOne({ userID: consultantId });
    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }
    const pendingBookings = await Booking.find({ consultantId: consultant._id, status: 'pending' });
    res.json(pendingBookings);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Send email if the booking is approved
    if (status === 'approved') {
      const consultant = await User.findById(updatedBooking.consultantId);

      if (!consultant) {
        return res.status(404).json({ error: 'Consultant not found.' });
      }

      const meetingDetails = {
        date: updatedBooking.date, // assuming the booking has a date field
        time: updatedBooking.time, // assuming the booking has a time field
        address: 'Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh 700000', // replace with actual meeting address
      };

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: updatedBooking.email,
        subject: 'Booking Approved - Meeting Details',
        text: `Dear ${updatedBooking.name},\n\nYour booking has been approved. Here are the meeting details:\n\nDate: ${meetingDetails.date}\nTime: ${meetingDetails.time}\nMeeting Address: ${meetingDetails.address}\n\nBest regards,\n${consultant.name}`
      };

      await transporter.sendMail(mailOptions, (error, info) => { 
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getApprovedAppointments = async (req, res) => {
  try {
    const approvedBookings = await Booking.find({ status: "approved" });
    res.json(approvedBookings);
  } catch (error) {
    console.error("Error fetching approved appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getConsultantAppointments = async (req, res) => {
  try {
    const consultantId = req.params.consultantId;
    const consultant = await User.findOne({ userID: consultantId });
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found." });
    }
    const approvedAppointments = await Booking.find({
      consultantId: consultant._id,
      status: "approved",
    });
    res.json(approvedAppointments);
  } catch (error) {
    console.error("Error fetching approved appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getPendingBookings,
  getPendingBookingsByConsultant,
  updateBooking,
  deleteBooking,
  getApprovedAppointments,
  getConsultantAppointments,
  getAllBookings,
};
