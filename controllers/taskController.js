const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  const currentFamilyCode = req.user.familyCode || "default-family";

  const tasks = await Task.find({
    familyCode: currentFamilyCode,
  });

  res.render("tasks/index", {
    tasks,
    currentFamilyCode,
  });
};

// Controller func to show new task page
const showNewTask = (req, res) => {
  res.render("tasks/new");
};

// Controller func for creating a new task
const createTask = async (req, res) => {
  const userId = req.user._id;
  const currentFamilyCode = req.user.familyCode || "default-family";

  let title = "";

  if (req.body.title) {
    title = req.body.title.trim();
  }

  if (!title) {
    return res.send("Title is required");
  }

  await Task.create({
    owner: userId,
    familyCode: currentFamilyCode,
    title: title,
    createdByName: req.user.name,
    assignedToName: req.body.assignedToName,
    status: req.body.status,
    notes: req.body.notes,
    dueDate: req.body.dueDate || undefined,
  });

  res.redirect("/tasks");
};

// Controller func to show edit task page
const showEditTask = async (req, res) => {
  const currentFamilyCode = req.user.familyCode || "default-family";

  const task = await Task.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!task) {
    req.flash("error", "You can only edit your own tasks.");
    return res.redirect("/tasks");
  }
  res.render("tasks/edit", { task });
};

// Controller func to update a single task
const updateTask = async (req, res) => {
  const currentFamilyCode = req.user.familyCode || "default-family";

  let title = "";

  if (req.body.title) {
    title = req.body.title.trim();
  }

  if (!title) {
    return res.send("Title is required");
  }

  await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
    },
    {
      familyCode: currentFamilyCode,
      title: title,
      assignedToName: req.body.assignedToName,
      status: req.body.status,
      notes: req.body.notes,
      dueDate: req.body.dueDate || undefined,
    },
    {
      runValidators: true,
    },
  );

  res.redirect("/tasks");
};

// Controller func to delete a single task
const deleteTask = async (req, res) => {
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!deletedTask) {
    req.flash("error", "You can only delete your own tasks.");
    return res.redirect("/tasks");
  }

  req.flash("info", "Task deleted.");
  res.redirect("/tasks");
};

// Controller func to update Task status
const updateTaskStatus = async (req, res) => {
  const currentFamilyCode = req.user.familyCode || "default-family";

  const task = await Task.findOne({
    _id: req.params.id,
    familyCode: currentFamilyCode,
  });

  if (!task) {
    req.flash("error", "Task not found.");
    return res.redirect("/tasks");
  }

  const isOwner = task.owner.toString() === req.user._id.toString();

  if (!isOwner) {
    req.flash("error", "You can only change the status of your own tasks.");
    return res.redirect("/tasks");
  }

  task.status = req.body.status;
  await task.save();

  req.flash("info", "Task status updated.");
  res.redirect("/tasks");
};

module.exports = {
  getAllTasks,
  showNewTask,
  createTask,
  showEditTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
