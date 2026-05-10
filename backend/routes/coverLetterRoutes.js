import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  generateLetter,
  getCoverLetterByJob,
  finalizeCoverLetter,
  deleteCoverLetter,
  coverLetterLimiter,
} from "../controllers/coverLetterController.js";

const router = express.Router();


// All routes protected
router.use(authMiddleware);


// Generate Cover Letter
router.post(
  "/generate",
  coverLetterLimiter,
  generateLetter
);


// Get Cover Letter By Job
router.get(
  "/job/:jobId",
  getCoverLetterByJob
);


// Finalize Cover Letter
router.patch(
  "/:id/finalize",
  finalizeCoverLetter
);


// Delete Cover Letter
router.delete(
  "/:id",
  deleteCoverLetter
);

export default router;