const Booking = require("../models/Booking");
const Coworkingspace = require("../models/Coworkingspace");
const User = require("../models/User");
const { sendMail } = require("./mails");

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Private
exports.getBookings = async (req, res, next) => {
  let query;
  let coworkingspaceId = req.query["coworkingspaceId"];
  if (req.user.role !== "admin") 
  {
    if (coworkingspaceId) {
      query = Booking.find({
        user: req.user.id,
        coworkingspace: coworkingspaceId,
      }).populate({
        path: "coworkingspace",
        select: "name address tel",
      });
    } else {
      query = Booking.find({
        user: req.user.id,
      }).populate({
        path: "coworkingspace",
        select: "name address tel",
      });
    }
  } 
  else 
  {
    if (coworkingspaceId) {
      query = Booking.find({ coworkingspace: coworkingspaceId }).populate({
        path: "coworkingspace",
        select: "name address tel",
      });
    } else {
      query = Booking.find().populate({
        path: "coworkingspace",
        select: "name address tel",
      });
    }
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Private
exports.getBooking = async (req, res, next) => {
  let booking;
  try 
  {
    booking = await Booking.findById(req.params.id).populate({
      path: "coworkingspace",
      select: "name address tel",
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view this booking`,
      });
    }

    res.status(200).json({ success: true, data: booking });
  } 
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Add booking
//@route    POST /api/v1/coworkingspaces/:coworkingspaceId/bookings
//@access   Private
exports.addBooking = async (req, res, next) => {

  if(!req.body.numOfRooms) { req.body.numOfRooms = 1};

  if((req.body.numOfRooms<1) || (req.body.numOfRooms>3)) {
    return res.status(400).json({ 
      success: false, 
      message: `User can reserve 1-3 rooms` });
  }

  try {
    req.body.coworkingspace = req.params.coworkingspaceId;
    const coworkingspace = await Coworkingspace.findById(req.params.coworkingspaceId);
    if (!coworkingspace) {
      return res.status(404).json({
        success: false,
        message: `No co-working space with the id of ${req.params.coworkingspaceId}`,
      });
    }
    req.body.user = req.user.id;

    const booking = await Booking.create(req.body);
      res.status(200).json({
        success: true,
        data: booking,
      });

      User.findById(req.user.id, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          sendMail(user, booking);
        }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Booking",
    });
  }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {

  if((req.body.numOfRooms) && (((req.body.numOfRooms<1))||((req.body.numOfRooms>3)))) {
    return res.status(400).json({ 
      success: false, 
      message: `User can reserve 1-3 rooms` });
  }

  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    if(!req.body.numOfRooms) {
      req.body.numOfRooms = booking.numOfRooms;
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Booking",
    });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }
    await booking.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Booking",
    });
  }
};
