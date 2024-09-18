/**
* @swagger
* components:
*   schemas:
*     Coworkingspace:
*       type: object
*       required:
*         - name
*         - address
*         - operatingHours
*         - province
*         - postalcode
*         - picture
*       properties:
*         name:
*           type: string
*           description: Name of the co-working space
*         address:
*           type: string
*           description: House No., Street, Road
*         operatingHours:
*           type: string
*           description: Operating Hours
*         province:
*           type: string
*           description: province
*         postalcode:
*           type: string
*           description: 5-digit postal code 
*         tel:
*           type: string
*           description: telephone number
*         picture:
*           type: string
*           description: picture
*/

const express = require("express");
const {
  getCoworkingspaces,
  getCoworkingspace,
  createCoworkingspace,
  updateCoworkingspace,
  deleteCoworkingspace,
} = require("../controllers/coworkingspaces");

/**
* @swagger
* tags:
*   name: Coworkingspaces
*   description: The co-working space managing API
*/

// Include other resource routers
const bookingRouter = require("./bookings");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers

/**
* @swagger
* /coworkingspaces:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new co-working space
*     tags: [Coworkingspaces]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Coworkingspace'
*     responses:
*       201:
*         description: The co-working space was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Coworkingspace'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /coworkingspaces:
*   get:
*     summary: Returns the list of all the co-working spaces
*     tags: [Coworkingspaces]
*     responses:
*       200:
*         description: The list of the co-working spaces
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/Coworkingspace'
*/
router.use("/:coworkingspaceId/bookings", bookingRouter);
router
  .route("/")
  .get(getCoworkingspaces)
  .post(protect, authorize("admin"), createCoworkingspace);

/**
* @swagger
* /coworkingspaces/{id}:
*   get:
*     summary: Get the co-working space by id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The co-working space id
*     responses:
*       200:
*         description: The co-working space description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Coworkingspace'
*       404:
*         description: The co-working space was not found
*/

/**
* @swagger
* /coworkingspaces/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update the co-working space by id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The co-working space id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Coworkingspace'
*     responses:
*       200:
*         description: The co-working space was successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Coworkingspace'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /coworkingspaces/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete the co-working space by id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The co-working space id
*     responses:
*       200:
*         description: The co-working space was successfully deleted
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Coworkingspace'
*       404:
*         description: The co-working space was not found
*/
router
  .route("/:id")
  .get(getCoworkingspace)
  .put(protect, authorize("admin"), updateCoworkingspace)
  .delete(protect, authorize("admin"), deleteCoworkingspace);

module.exports = router;
