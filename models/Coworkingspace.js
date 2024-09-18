const mongoose = require("mongoose");
const CoworkingspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    operatingHours: {
      type: String,
      required: [true, "Please add operating hours"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postalcode cannot be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    picture: {
      type: String,
      required: [true, "Please add URL to coworkingspace picture"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Cascade delete bookings when a coworkingspace is deleted
CoworkingspaceSchema.pre("remove", async function (next) {
  console.log(`Booking being removed from coworkingspace ${this._id}`);
  await this.model("Booking").deleteMany({ coworkingspace: this._id });
  next();
});
// Reverse populate with virtuals
CoworkingspaceSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "coworkingspace",
  justOne: false,
});
module.exports = mongoose.model("Coworkingspace", CoworkingspaceSchema);
