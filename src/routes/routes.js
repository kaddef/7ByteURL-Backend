import Router from "express"
import { createShortUrl, redirectToDest, getQRCode, getShortUrl, getClickStats } from "../controller/shortUrlController.js";
import { destinationValidator, shortIdValidator, validateRequest } from "../middleware/validation.js";

const routes = Router();

routes.get("/check", (req,res) => {
    res.send("Healthy")
})

routes.post("/api/url", destinationValidator, validateRequest, createShortUrl)

routes.get("/api/url/:shortId", shortIdValidator, validateRequest, getShortUrl)

routes.get('/:shortId', shortIdValidator, validateRequest, redirectToDest)

routes.get('/api/url/analytics/:shortId', shortIdValidator, validateRequest, getClickStats)

routes.get('/api/qr/:shortId', shortIdValidator, validateRequest, getQRCode)

export default routes