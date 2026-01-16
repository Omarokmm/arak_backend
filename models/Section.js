const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department", // Reference to the Department model
    },
    // Add other properties specific to the section
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
