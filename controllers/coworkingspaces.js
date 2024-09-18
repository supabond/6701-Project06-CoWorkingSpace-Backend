const Coworkingspace = require("../models/Coworkingspace");

//@desc     Get all coworkingspaces
//@route    GET /api/v1/coworkingspaces
//@access   Public
exports.getCoworkingspaces = async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finding resource
  let query = Coworkingspace.find(JSON.parse(queryStr));
  // Select
  if (req.query.select) {
    query = query.select(req.query.select.split(",").join(" "));
  }
  // Sort
  query = req.query.sort
    ? query.sort(req.query.sort.split(",").join(" "))
    : query.sort("-createdAt");
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Coworkingspace.countDocuments();
  query = query.skip(startIdx).limit(limit);
  try {
    // Executing query
    const coworkingspaces = await query;
    // Pagination result
    const pagination = {};
    if (endIdx < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIdx > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({
      success: true,
      count: coworkingspaces.length,
      pagination,
      data: coworkingspaces,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single coworkingspace
//@route    GET /api/v1/coworkingspaces/:id
//@access   Public
exports.getCoworkingspace = async (req, res, next) => {
  try {
    const coworkingspace = await Coworkingspace.findById(req.params.id);
    if (!coworkingspace) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: coworkingspace });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create single coworkingspace
//@route    POST /api/v1/coworkingspaces
//@access   Private
exports.createCoworkingspace = async (req, res, next) => {
  console.log(req.body);
  try {
    const coworkingspace = await Coworkingspace.create(req.body);
    res.status(201).json({ success: true, data: coworkingspace });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Update single coworkingspace
//@route    PUT /api/v1/coworkingspaces/:id
//@access   Private
exports.updateCoworkingspace = async (req, res, next) => {
  try {
    const coworkingspace = await Coworkingspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coworkingspace) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: coworkingspace });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single coworkingspace
//@route    DELETE /api/v1/coworkingspaces/:id
//@access   Private
exports.deleteCoworkingspace = async (req, res, next) => {
  try {
    const coworkingspace = await Coworkingspace.findById(req.params.id);
    if (!coworkingspace) {
      res.status(400).json({ success: false });
    }
    coworkingspace.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
