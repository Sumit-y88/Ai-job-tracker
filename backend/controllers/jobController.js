import Job from "../models/Job.js";
import CoverLetter from "../models/CoverLetter.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  scoreMatch,
} from "../services/geminiService.js";


// GET ALL JOBS
export const getJobs = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {
    userId: req.userId,
  };

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter
  if (search) {
    query.$or = [
      {
        company: {
          $regex: search,
          $options: "i",
        },
      },
      {
        role: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const jobs = await Job.find(query)
    .sort({ updatedAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    data: jobs,
  });
});


// CREATE JOB
export const createJob = asyncHandler(async (req, res) => {
  const {
    company,
    role,
    jobDescription,
    notes,
    applicationUrl,
  } = req.body;

  const job = await Job.create({
    userId: req.userId,
    company,
    role,
    jobDescription,
    notes,
    applicationUrl,
  });

  // Fetch user resume
  const User =
    (await import("../models/User.js")).default;

  const user = await User.findById(req.userId).lean();

  // AI Match Score
  if (user?.resumeText?.trim()) {
    const result = await scoreMatch(
      user.resumeText,
      jobDescription
    );

    job.matchScore = result.score;

    await job.save();
  }

  return res.status(201).json({
    success: true,
    data: job,
  });
});


// GET SINGLE JOB
export const getJobById = asyncHandler(
  async (req, res) => {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  }
);


// UPDATE JOB
export const updateJob = asyncHandler(
  async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const allowedFields = [
      "company",
      "role",
      "status",
      "notes",
      "applicationUrl",
      "appliedAt",
      "jobDescription",
    ];

    // Update fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // Recalculate match score
    if (req.body.jobDescription) {
      const User =
        (await import("../models/User.js")).default;

      const user = await User.findById(
        req.userId
      ).lean();

      if (user?.resumeText?.trim()) {
        const result = await scoreMatch(
          user.resumeText,
          req.body.jobDescription
        );

        job.matchScore = result.score;
      }
    }

    await job.save();

    return res.status(200).json({
      success: true,
      data: job,
    });
  }
);


// DELETE JOB
export const deleteJob = asyncHandler(
  async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Delete cover letter
    await CoverLetter.deleteOne({
      jobId: job._id,
    });

    // Delete job
    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  }
);