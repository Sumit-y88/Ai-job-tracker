import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "saved",
        "applied",
        "interviewing",
        "offered",
        "rejected",
      ],
      default: "saved",
    },

    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },

    applicationUrl: {
      type: String,
      default: "",
    },

    appliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;