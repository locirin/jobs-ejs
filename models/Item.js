const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name must be 80 characters or less"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    bought: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [40, "Category must be 40 characters or less"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Notes must be 200 characters or less"],
      default: "",
    },

    plannedFor: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", ItemSchema);
