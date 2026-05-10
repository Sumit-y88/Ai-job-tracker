import rateLimit from "express-rate-limit";

import CoverLetter from "../models/CoverLetter.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
    generateCoverLetter,
} from "../services/geminiService.js";


// Generate Cover Letter
export const generateLetter = asyncHandler(
    async (req, res) => {
        const { jobId, tone = "formal" } = req.body;

        // Find job
        const job = await Job.findById(jobId);

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

        // Find user
        const user = await User.findById(req.userId).lean();

        if (!user?.resumeText?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Please add your resume text in your profile first",
            });
        }

        // Generate AI cover letter
        const content = await generateCoverLetter(
            user.resumeText,
            job.jobDescription,
            job.role,
            job.company,
            tone
        );

        // Upsert cover letter
        const coverLetter =
            await CoverLetter.findOneAndUpdate(
                { jobId: job._id },
                {
                    content,
                    tone,
                    generatedAt: new Date(),
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            data: coverLetter,
        });
    }
);


// Get Cover Letter By Job ID
export const getCoverLetterByJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    // First verify the job belongs to this user
    const job = await Job.findOne({
        _id: jobId,
        userId: req.userId
    }).lean();

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job not found",
        });
    }

    // Find the cover letter for this job
    const coverLetter = await CoverLetter.findOne({ jobId }).lean();

    if (!coverLetter) {
        return res.status(404).json({
            success: false,
            message: "No cover letter found for this job",
        });
    }

    return res.status(200).json({
        success: true,
        data: coverLetter,
    });
});


// Finalize Cover Letter
export const finalizeCoverLetter =
    asyncHandler(async (req, res) => {
        const coverLetter =
            await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({
                success: false,
                message: "Cover letter not found",
            });
        }

        // Verify ownership through job
        const job = await Job.findById(
            coverLetter.jobId
        ).lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Associated job not found",
            });
        }

        if (job.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        coverLetter.isFinal = true;

        await coverLetter.save();

        return res.status(200).json({
            success: true,
            data: coverLetter,
        });
    });


// Delete Cover Letter
export const deleteCoverLetter =
    asyncHandler(async (req, res) => {
        const coverLetter =
            await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({
                success: false,
                message: "Cover letter not found",
            });
        }

        // Verify ownership
        const job = await Job.findById(
            coverLetter.jobId
        ).lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Associated job not found",
            });
        }

        if (job.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        await coverLetter.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Cover letter deleted successfully",
        });
    });


// AI Rate Limiter
export const coverLetterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,

    message: {
        success: false,
        message:
            "Too many AI requests. Try again later.",
    },
});