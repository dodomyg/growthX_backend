const { isValidObjectId } = require("mongoose");
const USER = require("../model/USER");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    if (role !== "user" && role !== "admin") {
      return res.status(422).json({ error: "Role should be user or admin" });
    }

    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User already exists, please try to login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const newUser = new USER({
      name,
      email,
      password: hashedPw,
      role,
    });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "Account Created Successfully", newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginController = async (req, resp) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return resp.status(422).json({ error: "please add all the fields" });
    }
    if (role !== "user" && role !== "admin") {
      return resp.status(422).json({ error: "Role should be user or admin" });
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return resp
        .status(422)
        .json({ error: "No account found with this email, please register" });
    }

    if (user.role !== role) {
      return resp.status(403).json({
        error: `Unauthorized: This account does not have ${role} access.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return resp.status(422).json({ error: "Password is incorrect" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "2h",
    });
    resp.cookie("jwtToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expiresIn: new Date().getHours() + 2,
    });
    return resp
      .status(200)
      .json({ message: "user logged in successfully", user, token });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "internal server error" });
  }
};

const logoutController = async (req, resp) => {
  try {
    if (req.user) {
      resp.clearCookie("jwtToken", {
        path: "/",
      });
      return resp.status(200).json({ message: "user logged out successfully" });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "internal server error" });
  }
};

module.exports = { registerController, loginController, logoutController };
