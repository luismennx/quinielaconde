import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { nombre, apodo, correo, whatsapp, password } = req.body;

    if (!nombre || !apodo || !correo || !password) {
      return res.status(400).json({
        message: "Nombre, apodo, correo y contraseña son obligatorios"
      });
    }

    const [existingUsers] = await pool.query(
      `SELECT id FROM usuarios 
       WHERE correo = ? OR apodo = ? OR whatsapp = ?`,
      [correo, apodo, whatsapp || null]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Ya existe una cuenta con ese correo, apodo o WhatsApp"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, apodo, correo, whatsapp, password_hash, rol, estado)
       VALUES (?, ?, ?, ?, ?, 'jugador', 'activo')`,
      [nombre, apodo, correo, whatsapp || null, passwordHash]
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: result.insertId,
        nombre,
        apodo,
        correo,
        whatsapp: whatsapp || null,
        rol: "jugador",
        estado: "activo"
      }
    });
  } catch (error) {
    console.error("Error en register:", error);

    return res.status(500).json({
      message: "Error interno al registrar usuario"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identificador, password } = req.body;

    if (!identificador || !password) {
      return res.status(400).json({
        message: "Identificador y contraseña son obligatorios"
      });
    }

    const [users] = await pool.query(
      `SELECT id, nombre, apodo, correo, whatsapp, password_hash, saldo, rol, estado
       FROM usuarios
       WHERE correo = ? OR apodo = ? OR whatsapp = ?
       LIMIT 1`,
      [identificador, identificador, identificador]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos"
      });
    }

    const user = users[0];

    if (user.estado !== "activo") {
      return res.status(403).json({
        message: "Tu cuenta no está activa"
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    );

    return res.json({
      message: "Inicio de sesión correcto",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apodo: user.apodo,
        correo: user.correo,
        whatsapp: user.whatsapp,
        saldo: user.saldo,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);

    return res.status(500).json({
      message: "Error interno al iniciar sesión"
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { identificador } = req.body;

    if (!identificador) {
      return res.status(400).json({
        message: "Correo o WhatsApp es obligatorio"
      });
    }

    const [users] = await pool.query(
      `SELECT id, nombre, correo, whatsapp
       FROM usuarios
       WHERE correo = ? OR whatsapp = ?
       LIMIT 1`,
      [identificador, identificador]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "No existe una cuenta con ese correo o WhatsApp"
      });
    }

    return res.json({
      message: "Solicitud de recuperación recibida. Próximamente enviaremos instrucciones."
    });
  } catch (error) {
    console.error("Error en recoverPassword:", error);

    return res.status(500).json({
      message: "Error interno al recuperar contraseña"
    });
  }
};