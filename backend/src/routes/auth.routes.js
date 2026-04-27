import express from "express";
import {
  register,
  login,
  recoverPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/recover-password", recoverPassword);

export default router;