const TASK = require("../model/TASK");
const USER = require("../model/USER");

const getAllAdmins = async (req, resp) => {
  if (!req.user) {
    return resp.status(401).json({ error: "Un authorized user" });
  }
  try {
    const getAllAdmins = await USER.find({ role: "admin" }).select("-password");
    if (getAllAdmins.length === 0) {
      return resp.status(404).json({ error: "No admin found" });
    } else {
      return resp.status(200).json(getAllAdmins);
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

const uploadAssignment = async (req, resp) => {
  if(!req.user){
    return resp.status(401).json({ error: "Un authorized user" });
  }
  try {
    const {admin,task} = req.body;
    if (!task || !admin) {
      return resp.status(422).json({ error: "Please provide task and admin ID" });
    }
    const adminUser = await USER.findById(admin);
    if (!adminUser || adminUser.role !== "admin") {
      return resp.status(404).json({ error: "Admin not found" });
    }
    const newAssignment = new TASK({
      admin:admin,
      task,
      userId:req.user._id,
      status:"Pending"
    })
    await newAssignment.save();
    return resp.status(200).json({ message: "Assignment uploaded successfully to admin", newAssignment });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {getAllAdmins,uploadAssignment};
