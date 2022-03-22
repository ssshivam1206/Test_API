const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Admin = require("../models/adminModel");
const AppError = require("../utils/appError");

exports.signUp = async (req, res, next) => {
  try {
    const newAdmin = await Admin.create({
      email: req.body.email,
      password: req.body.password,
    });

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
      data: newAdmin,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("provide email and password ", 400));
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return next(new AppError("incorrect email and password ", 401));
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
      data: admin,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("You are not Logged in ", 401));

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentadmin = await Admin.findById(decode.id);
    if (!currentadmin)
      return next(new AppError("this token is not belong to this user ", 401));

    req.admin = currentadmin;
    next();
  } catch (err) {
    res.send(err);
  }
};
