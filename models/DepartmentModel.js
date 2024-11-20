const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    head: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }], // Array of section IDs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
