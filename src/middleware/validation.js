import { body, param } from "express-validator";
import CustomError from "../error/CustomError.js";
import { validationResult } from "express-validator";

export const destinationValidator = [
    body('destination')
        .not().isEmpty().withMessage("Destination field must not be empty.")
        .bail()
        .isURL().withMessage("A valid URL must be provided.")
        .bail()
        .isLength({ max: 2048 }).withMessage("URL must not be longer than 2048 characters.")
]

export const shortIdValidator = [
    param('shortId')
        .notEmpty().withMessage("ShortId must not be empty.")
        .bail()
        .isAlphanumeric().withMessage("ShortId must only contain letters and numbers.")
        .bail()
        .isLength({ min: 7, max:7 }).withMessage("ShortId must be exactly 7 characters long.")
]

export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new CustomError(errors.errors[0].msg, 400);
        return next(error);
    }
    next();
}