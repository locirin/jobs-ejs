const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be 100 characters or less"],
    },

    status: {
      type: String,
      enum: ["open", "done"],
      default: "open",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Notes must be 200 characters or less"],
      default: "",
    },

    dueDate: {
      type: Date,
    },

    familyCode: {
      type: String,
      required: [true, "Family code is required"],
      trim: true,
    },

    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedToName: {
      type: String,
      trim: true,
      default: "",
    },

    createdByName: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", TaskSchema);
