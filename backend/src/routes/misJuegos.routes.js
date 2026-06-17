import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";

import {
  obtenerMisJuegos,
  obtenerDetalleJuego
} from "../controllers/misJuegos.controller.js";

const router = Router();

router.get("/", verificarToken, obtenerMisJuegos);
router.get("/:ticketId", verificarToken, obtenerDetalleJuego);

export default router;