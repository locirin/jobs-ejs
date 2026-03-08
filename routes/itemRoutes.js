const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  listItems,
  newItemShow,
  newItemDo,
  deleteItem,
  editItemShow,
  editItemDo,
} = require("../controllers/itemController");

router.get("/", auth, listItems);
router.get("/new", auth, newItemShow);
router.post("/", auth, newItemDo);
router.post("/:id/delete", auth, deleteItem);
router.get("/:id/edit", auth, editItemShow);
router.post("/:id/update", auth, editItemDo);

module.exports = router;
