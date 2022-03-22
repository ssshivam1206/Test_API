const User = require("../models/userModel");
const AppError = require("../utils/appError");
const multer = require("multer");
const req = require("express/lib/request");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image!! please upload image file", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadimage = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "dp", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    // pagination
    let queryStr = JSON.stringify(req.query);

    let query = User.find(JSON.parse(queryStr));

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numUser = await User.countDocuments();
      if (skip >= numUser) throw new Error("this page does not exist");
    }

    const user = await query;

    res.status(200).json({
      status: "success",
      results: user.length,
      data: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return next(
        new AppError(`user not find with this ${req.params.id}`, 401)
      );

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const reqBody = req.body;
    if (req.files) {
      reqBody.coverImage = req.files.coverImage[0].filename;
      reqBody.dp = req.files.dp[0].filename;
      reqBody.video = req.files.video[0].filename;
    }
    const user = await User.findByIdAndUpdate(req.params.id, reqBody, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(new AppError("user not found with this id", 404));

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(new AppError("user not found with this id", 404));

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.send(err);
  }
};
