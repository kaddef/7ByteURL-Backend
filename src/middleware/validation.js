import { body, param } from "express-validator";
import CustomError from "../error/CustomError.js";
import { validationResult } from "express-validator";

export const destinationValidator = [
    body('destination')
        .not().isEmpty().withMessage("Destination alanı boş olmamalı.")
        .bail()
        .isURL().withMessage("Geçerli bir URL girilmeli.")
        .bail()
        .isLength({ max: 2048 }).withMessage("URL 2048 karakterden uzun olmamalı.")
]

export const shortIdValidator = [
    param('shortId')
        .notEmpty().withMessage("ShortId boş olmamalı.")
        .bail()
        .isAlphanumeric().withMessage("ShortId yalnızca harf ve rakam içermeli.")
        .bail()
        .isLength({ min: 7, max:7 }).withMessage("ShortId 7 karakter olmalı.")
]

export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new CustomError(errors.errors[0].msg, 400);
        return next(error);
    }
    next();
}