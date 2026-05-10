import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    unique: true,
  },

  content: {
    type: String,
    required: true,
  },

  tone: {
    type: String,
    enum: ["formal", "friendly", "assertive"],
    default: "formal",
  },

  generatedAt: {
    type: Date,
    default: Date.now,
  },

  isFinal: {
    type: Boolean,
    default: false,
  },
});

const CoverLetter = mongoose.model(
  "CoverLetter",
  coverLetterSchema
);

export default CoverLetter;