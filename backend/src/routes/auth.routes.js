import express from "express";
import {
  register,
  login,
  recoverPassword,
  verifyRecoveryCode,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/recover-password", recoverPassword);
router.post("/verify-recovery-code", verifyRecoveryCode);
router.post("/reset-password", resetPassword);

export default router;