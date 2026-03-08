const Item = require("../models/Item");
const parseVErr = require("../util/parseValidationErrs");

const listItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    return res.render("items/index", { items });
  } catch (e) {
    return next(e);
  }
};

const newItemShow = (req, res) => {
  return res.render("items/new");
};

const newItemDo = async (req, res, next) => {
  try {
    await Item.create({
      owner: req.user._id,
      name: req.body.name,
      quantity: req.body.quantity,
      bought: req.body.bought === "on",
      category: req.body.category,
      notes: req.body.notes,
      plannedFor: req.body.plannedFor || undefined,
    });

    req.flash("info", "Item added.");
    return res.redirect("/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
      return res.render("items/new", { errors: req.flash("error") });
    }
    return next(e);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    await Item.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    req.flash("info", "Item deleted.");
    return res.redirect("/items");
  } catch (e) {
    return next(e);
  }
};

const editItemShow = async (req, res, next) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!item) {
      req.flash("error", "Item not found.");
      return res.redirect("/items");
    }

    return res.render("items/edit", { item });
  } catch (e) {
    return next(e);
  }
};

const editItemDo = async (req, res, next) => {
  try {
    const updated = await Item.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        name: req.body.name,
        quantity: req.body.quantity,
        bought: req.body.bought === "on",
        category: req.body.category,
        notes: req.body.notes,
        plannedFor: req.body.plannedFor || undefined,
      },
      { runValidators: true },
    );

    if (!updated) {
      req.flash("error", "Item not found.");
      return res.redirect("/items");
    }

    req.flash("info", "Item updated.");
    return res.redirect("/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
      return res.render("items/edit", {
        item: { _id: req.params.id, ...req.body },
        errors: req.flash("error"),
      });
    }
    return next(e);
  }
};

module.exports = {
  listItems,
  newItemShow,
  newItemDo,
  deleteItem,
  editItemShow,
  editItemDo,
};
