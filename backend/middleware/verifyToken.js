const jwt = require("jsonwebtoken");
const USER = require("../model/USER");


const verifyToken = async (req, resp, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return resp.status(401).json({ error: "Un authorized user" });
    }
    const decoded = jwt.verify(token,process.env.SECRET);
    if (!decoded) {
      return resp.status(401).json({ error: "Un authorized user" });
    }
    const loggedUser = await USER.findById(decoded._id);
    req.user = loggedUser;
    next();
  } catch (error) {
    console.log(error);
  }
};

const checkRole = (req, resp, next) => {
    try {
      if(req.user.role !== "admin") {
        return resp.status(403).json({ error: "Forbidden: Only admins can access this" });
      }
      next();
    } catch (error) {
      console.log(error);
      return resp.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = {verifyToken,checkRole};
