import express from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { getPerfil } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/perfil", verificarToken, getPerfil);

export default router;