const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const counterCaseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      default:"1"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", counterCaseSchema);
