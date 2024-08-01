const Booking = require('../models/Booking');
const User = require('../models/User');
const transporter = require('../config/nodemailer');
const Service = require('../models/Service');
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Fetch all consultants
    const consultants = await User.find({ role: 'consultant' });

    if (!consultants || consultants.length === 0) {
      return res.status(404).json({ error: "No consultants found." });
    }

    // Get the pending bookings for each consultant
    const consultantsWithPendingBookings = await Promise.all(
      consultants.map(async (consultant) => {
        const pendingBookingsCount = await Booking.countDocuments({
          consultantId: consultant._id,
          status: "pending",
          paymentStatus: "Paid"
        });
        return {
          consultant,
          pendingBookingsCount
        };
      })
    );

    // Find the consultant with the least pending bookings
    let leastPendingConsultants = [];
    let minPendingCount = Infinity;

    for (const consultantData of consultantsWithPendingBookings) {
      if (consultantData.pendingBookingsCount < minPendingCount) {
        leastPendingConsultants = [consultantData.consultant];
        minPendingCount = consultantData.pendingBookingsCount;
      } else if (consultantData.pendingBookingsCount === minPendingCount) {
        leastPendingConsultants.push(consultantData.consultant);
      }
    }

    // Randomly select one of the consultants if there is a tie
    const selectedConsultant = leastPendingConsultants[Math.floor(Math.random() * leastPendingConsultants.length)];

    // Get the service
    const service = await Service.findById(bookingData.serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    // Create the new booking
    const newBooking = new Booking({
      ...bookingData,
      status: "pending",
      consultantId: selectedConsultant._id,
      customerId: bookingData.customerId,
      serviceId: service._id,
    });

    // Save the new booking
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
    // const booking = await Booking.findById(bookingId);
    const booking = await Booking.findById(bookingId).populate('consultantId');

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
    const consultant = await User.findById(consultantId); // Changed to findById

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    const pendingBookings = await Booking.find({
      consultantId: consultant._id, 
      status: 'pending',
      paymentStatus: 'Paid'
    });

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
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56);">
          <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56); text-align: center;">
            <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" alt="Company Logo" style="width: 100px; border: 5px solid #fff;"/>
          </div>
          <h2 style="color: #fff;">Booking Approved - Meeting Details</h2>
          <p style="color: #fff; font-size: 18px;">Dear ${updatedBooking.name},</p>
          <p style="color: #fff; font-size: 18px;">Your booking has been approved. Here are the meeting details:</p>
          <p style="color: #fff; font-size: 18px;"><strong>Date:</strong> ${meetingDetails.date}</p>
          <p style="color: #fff; font-size: 18px;"><strong>Time:</strong> ${meetingDetails.time}</p>
          <p style="color: #fff; font-size: 18px;"><strong>Meeting Address:</strong> ${meetingDetails.address}</p>
          <p style="color: #fff; font-size: 18px;">Best regards,</p>
          <p style="color: #fff; font-size: 18px;">${consultant.name}</p>
        </div>
      `,
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

    // Check if the consultant exists using findById
    const consultant = await User.findById(consultantId);
    if (!consultant) {
        return res.status(404).json({ error: "Consultant not found." });
    }

    // Find approved appointments (query by consultant._id)
    const approvedAppointments = await Booking.find({
      consultantId: consultant._id,  // Corrected to use consultant._id
      status: "approved",
    });

    res.json(approvedAppointments);
  } catch (error) {
    console.error("Error fetching approved appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const countPendingBookings = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const count = await Booking.countDocuments({ status });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while counting bookings' });
  }
};

const getBookingIdByUserId = async (req, res) => {
  
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ customerId: userId }).populate('serviceId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }}
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
  countPendingBookings,
  getBookingIdByUserId
};
