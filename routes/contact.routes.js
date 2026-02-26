import express from "express";
import { validateIdentifyRequest } from "../middlewares/validate.middleware.js";
import { identifyContact } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/identify", validateIdentifyRequest, identifyContact);

export default router;
