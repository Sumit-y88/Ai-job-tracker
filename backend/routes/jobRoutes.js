import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import validateMiddleware from "../middleware/validateMiddleware.js";

import {
  createJobValidator,
  updateJobValidator,
} from "../validators/jobValidators.js";

import {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();


// All routes protected
router.use(authMiddleware);


// GET ALL JOBS
router.get("/", getJobs);


// CREATE JOB
router.post(
  "/",
  createJobValidator,
  validateMiddleware,
  createJob
);


// GET SINGLE JOB
router.get("/:id", getJobById);


// UPDATE JOB
router.patch(
  "/:id",
  updateJobValidator,
  validateMiddleware,
  updateJob
);


// DELETE JOB
router.delete("/:id", deleteJob);

export default router;