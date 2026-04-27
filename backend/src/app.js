import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { verificarToken } from "./middlewares/auth.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Quiniela Conde funcionando correctamente"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");

    res.json({
      message: "Conexión a MySQL correcta",
      resultado: rows[0].resultado
    });
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);

    res.status(500).json({
      message: "Error al conectar con MySQL",
      error: error.message
    });
  }
});



export default app;