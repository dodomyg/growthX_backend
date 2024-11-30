const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {getAllAdmins, uploadAssignment} = require("../controller/userController");

const router = express.Router();

router.get('/admins',verifyToken,getAllAdmins);
router.post('/upload',verifyToken,uploadAssignment);

module.exports = router;
