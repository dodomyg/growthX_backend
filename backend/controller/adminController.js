const TASK = require("../model/TASK");

const getTaggedAssignments = async (req, resp) => {
  if (!req.user) {
    return resp.status(401).json({ error: "Un authorized user" });
  }
  try {
    const taggedAssaignment = await TASK.find({
      admin: req.user._id,
      status: "Pending",
    })
      .populate("userId", "name email")
      .select("-password");
    if (taggedAssaignment.length === 0) {
      return resp.status(404).json({ error: "No tagged Assaignments found" });
    } else {
      return resp.status(200).json(taggedAssaignment);
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

const getSingle = async (req, resp) => {
  try {
    if (!req.user)
      return resp.status(401).json({ error: "Un authorized user" });

    const { id } = req.params;
    const singleAssignment = await TASK.findById(id)
      .populate("admin", "name email")
      .populate("userId", "name email");
    return resp.status(200).json(singleAssignment);
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

const acceptAssignment = async (req, resp) => {
  try {
    if (!req.user) {
      return resp.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.params;

    const task = await TASK.findById(id);
    if (!task) {
      return resp.status(404).json({ error: "Assignment not found" });
    }

    if (!task.admin.equals(req.user._id)) {
      return resp
        .status(403)
        .json({ error: "You are not authorized to accept this assignment" });
    }

    if (task.status !== "Pending" && task.status !== "Rejected") {
      return resp
        .status(400)
        .json({ error: "Assignment already accepted or rejected" });
    }

    const updatedTask = await TASK.findByIdAndUpdate(
      id,
      { status: "Accepted" },
      { new: true }
    );
    return resp.status(200).json({
      message: "Assignment accepted successfully",
      assignment: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

const rejectAssignment = async (req, resp) => {
  try {
    if (!req.user) {
      return resp.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.params;

    const task = await TASK.findById(id);
    if (!task) {
      return resp.status(404).json({ error: "Assignment not found" });
    }

    if (!task.admin.equals(req.user._id)) {
      return resp
        .status(403)
        .json({ error: "You are not authorized to reject this assignment" });
    }

    if (task.status !== "Pending") {
      return resp
        .status(400)
        .json({ error: "Assignment already processed (accepted or rejected)" });
    }

    const updated = await TASK.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );

    return resp
      .status(200)
      .json({
        message: "Assignment rejected successfully",
        assignment: updated,
      });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTaggedAssignments,
  getSingle,
  acceptAssignment,
  rejectAssignment,
};
