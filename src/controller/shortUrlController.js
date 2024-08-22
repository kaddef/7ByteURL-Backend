import QRCode from "qrcode"
import shortUrl from "../models/shortUrl.js";
import analytics from "../models/analytics.js";
import { validationResult } from "express-validator";
import CustomError from "../error/CustomError.js";

export async function createShortUrl(req,res,next) {
    try {
        const {destination} = req.body;
        const newUrl = await shortUrl.create({ destination: destination });
        const sanitizedUrl = newUrl.toJSON(); // Belgeyi düz bir JS objesine dönüştürür
        console.log(sanitizedUrl)
        return res.send(sanitizedUrl);
    } catch (err) {
        console.log(err)
        const error = new CustomError("Cannot able to create new URL",500)
        return next(error)
    }
}

export async function redirectToDest(req,res,next) {
    try {
        const { shortId } = req.params
        const findUrl = await shortUrl.findOne({shortId: shortId}).lean()
        if(!findUrl) {
            const error = new CustomError("Short URL not found",404)
            return next(error)
        }
        await analytics.create({ shortUrl: findUrl._id })
        return res.redirect(findUrl.destination)
    } catch (err) {
        const error = new CustomError("Error occurred while redirecting",500)
        return next(error)
    }
}

export async function getShortUrl(req,res,next) {
    console.log("GEDDING URL")
    try {
        const { shortId } = req.params;
        const findUrl = await shortUrl.findOne({shortId: shortId}).select('-__v').lean()
        if (!findUrl) {
            const error = new CustomError("Short URL not found",404)
            return next(error)
        }
        const urlId = findUrl._id;
        delete findUrl._id;
        await analytics.create({ shortUrl: urlId })
        return res.json(findUrl);
    } catch (err) {
        const error = new CustomError("Error occurred while fetching short URL data",500)
        return next(error)
    }
}

export async function getQRCode(req,res,next) {
    try {
        const { shortId } = req.params;
        const findUrl = await shortUrl.findOne({ shortId }).lean();

        if (!findUrl) {
            const error = new CustomError("Short URL not found",404)
            return next(error)
        }

        const qrCodeData = await QRCode.toDataURL(`${process.env.FEORIGIN}/${shortId}`);//ORIGIN ENV HERE

        // Tarayıcıya indirme başlığını gönder
        res.setHeader('Content-Disposition', `attachment; filename=${shortId}.png`);
        res.setHeader('Content-Type', 'image/png');

        // QR kodunu base64 olarak gönder
        const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');

        return res.send(imgBuffer);
    } catch (err) {
        const error = new CustomError("Error occurred while creating QR Code",500)
        return next(error)
    }
}

export async function getClickStats(req, res, next) {
    try {
        const { shortId } = req.params;
        
        const findUrl = await shortUrl.findOne({ shortId }, '_id').lean();
        if(!findUrl) {
            const error = new CustomError("Short URL not found", 404);
            return next(error);
        }
        
        const totalClicks = await analytics.countDocuments({ shortUrl: findUrl._id })
        const timeThreshold = new Date(Date.now() - 60 * 1000) // 1 min
        const recentClicks = await analytics.countDocuments({
            shortUrl: findUrl._id,
            createdAt: { $gte: timeThreshold }
        })

        return res.json({
            totalClicks,
            recentClicks,
        });
    } catch (err) {
        console.log(err)
        const error = new CustomError("Error occurred while retrieving analytics data", 500);
        return next(error);
    }
}