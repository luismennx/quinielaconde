import express from "express";
import {
  obtenerJornadasMundial,
  obtenerPartidosPorJornada
} from "../controllers/mundial.controller.js";

const router = express.Router();

router.get("/:ligaId/jornadas", obtenerJornadasMundial);
router.get("/jornadas/:jornadaId/partidos", obtenerPartidosPorJornada);

export default router;