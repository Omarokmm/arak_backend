const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CaseSchema = new Schema(
  {
    caseNumber: {
      type: String,
    },
    name: {
      type: String,
    },
    caseType: {
      type: String,
    },
    dateIn: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dentistObj: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    patientName: {
      type: String,
      required: true,
    },
    gender: {
      type: String
    },
    age: {
      type: String,
    },
    patientPhone: {
      type: String,
    },
    shadeCase: {
      shade: { type: String },
      stumpShade: { type: String },
      gingShade: { type: String },
    },
    occlusalStaining: {
      type: String,
    },
    texture: {
      type: String,
    },
    translucency: {
      type: String,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    teethNumbers: {
      type: Array,
      required: true,
    },
    naturalOfWorks: {
      type: Array,
      required: true,
    },
    isInvoice: {
      type: Boolean,
      default: true,
    },
    isHold: {
      type: Boolean,
      default: false,
    },
    isApprove: {
      type: Boolean,
      default: false,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    isStudy: {
      type: Boolean,
      default: false,
    },
    isRedo: {
      type: Boolean,
      default: false,
    },
    oldCaseIds: {
      type: Array,
      default: [],
    },
    redoReason:{
      type: String
    },
    isEmail: {
      type: Boolean,
      default: true,
    },
    isPhoto: {
      type: Boolean,
      default: true,
    },
    photos: {
      type: Array,
      default: [],
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    dateReceived: {
      type: Date,
      default: Date.now,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dateReceivedInEmail: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: Array,
      default: [],
    },
    cadCam: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    fitting: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    plaster: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
        obj: {},
      },
      obj: Object,
    },
    ceramic: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    designing: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    qualityControl: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    delivering: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
      },
      obj: Object,
    },
    receptionPacking: {
      namePhase: String,
      actions: Array,
      status: {
        isStart: { type: Boolean, default: true },
        isPause: { type: Boolean, default: false },
        isEnd: { type: Boolean, default: false },
        obj: Object,
      },
      obj: Object,
    },
    logs: {
      type: Array,
      default: [],
    },
    historyHolding: {
      type: Array,
      default: [],
    },
    historyApproving: {
      type: Array,
      default: [],
    },
    historyUrgent: {
      type: Array,
      default: [],
    },
    assignmentHistory: {
      type: Array,
      default: [],
    },
    isAssignedCadCam: {
      type: Boolean,
      default: false,
    },
    isAssignedFitting: {
      type: Boolean,
      default: false,
    },
    isAssignedCeramic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
CaseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Case", CaseSchema);
