import express from "express";
import { obtenerDeportesConLigas } from "../controllers/deportes.controller.js";

const router = express.Router();

router.get("/", obtenerDeportesConLigas);

export default router;