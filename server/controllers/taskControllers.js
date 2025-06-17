import taskModel from "../models/Task.js";

// CREATE A NEW TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new taskModel({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user.id,
    });
    const saved = await task.save();
    res.status(201).json({ success: true, task: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET ALL TASK FOR LOGGED - IN USER
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find({
        owner: req.user.id,
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TASK BTID (MUST BELONG TO THAT PARTICULAR USER)
export const getTasksById = async (req, res) => {
  try {
    const tasks = await taskModel.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!tasks)
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found" });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//UPDATE A TASK
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed =
        data.completed === "yes" ||
        data.completed === true ||
        data.completed === "Yes";
    }
    const updated = await taskModel.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found or Not Yours" });
    res.json({ success: true, task: updated });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//DELETE A TASK
export const deletTask = async (req, res) => {
  try {
    const deleted = await taskModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found or Not Yours" });
    res.json({ success: true, task: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
