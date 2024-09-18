/**
* @swagger
* components:
*   schemas:
*     Booking:
*       type: object
*       required:
*         - bookingDate
*         - numOfRooms
*         - user
*         - coworkingspace
*       properties:
*         bookingDate:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Booking Date
*         numOfRooms:
*           type: number
*           description: number of guests for the booking
*         user:
*           type: string
*           description: ID of the user making the booking
*         coworkingspace:
*           type: string
*           description: ID of the coworkingspace being booked
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
*/

/**
* @swagger
* components:
*   requestBodies:
*     BookingBody:
*       type: object
*       required:
*         - bookingDate
*         - numOfRooms
*       properties:
*         bookingDate:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Booking Date
*         numOfRooms:
*           type: number
*           description: number of guests for the booking
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
*/

const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

/**
* @swagger
* tags:
*   name: Bookings
*   description: The booking managing API
*/

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

/**
* @swagger
* /bookings:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Returns the list of all the bookings
*     tags: [Bookings]
*     parameters:
*       - in: query
*         name: coworkingspaceId
*         schema:
*           type: string
*         required: false
*         description: The coworkingspace id (Optional)
*     responses:
*       200:
*         description: The list of the bookings
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/Booking'
*/

/**
* @swagger
* /coworkingspaces/{coworkingspaceId}/bookings:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new Booking for the coworkingspace specified by coworkingspace id
*     tags: [Bookings]
*     parameters:
*       - in: path
*         name: coworkingspaceId
*         schema:
*           type: string
*         required: true
*         description: The coworkingspace id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/requestBodies/BookingBody'
*     responses:
*       201:
*         description: The booking was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       500:
*         description: Some server error
*/

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking);

/**
* @swagger
* /bookings/{id}:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Get the booking by id
*     tags: [Bookings]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The booking id
*     responses:
*       200:
*         description: The booking information by booking id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       404:
*         description: The booking was not found
*/


/**
* @swagger
* /bookings/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update the booking by id
*     tags: [Bookings]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The booking id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/requestBodies/BookingBody'
*     responses:
*       200:
*         description: The booking was successfully updated
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       404:
*         description: The booking was not found
*/

/**
* @swagger
* /bookings/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete the booking by id
*     tags: [Bookings]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The booking id
*     responses:
*       200:
*         description: The booking was successfully deleted
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Booking'
*       404:
*         description: The booking was not found
*/

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
