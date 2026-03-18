const express = require("express");

const router = express.Router();

const {
  getAllTasks,
  showNewTask,
  createTask,
  showEditTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/new", showNewTask);
router.post("/", createTask);
router.get("/edit/:id", showEditTask);
router.post("/update/:id", updateTask);
router.post("/delete/:id", deleteTask);
router.post("/status/:id", updateTaskStatus);

module.exports = router;
