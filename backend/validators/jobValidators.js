import { body } from "express-validator";

export const createJobValidator = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company is required"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required"),

  body("jobDescription")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
];
 
export const updateJobValidator = [
  body("status")
    .optional()
    .isIn([
      "saved",
      "applied",
      "interviewing",
      "offered",
      "rejected",
    ])
    .withMessage("Invalid status"),
];