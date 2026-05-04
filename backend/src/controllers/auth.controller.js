import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { enviarCodigoRecuperacion } from "../services/email.service.js";

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
      message: "Error interno al registrar usuario",
      error: error.message
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
      return res.status(404).json({
        message: "Usuario no encontrado"
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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido");
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
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
      message: "Error interno al iniciar sesión",
      error: error.message
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { identificador } = req.body;

    if (!identificador) {
      return res.status(400).json({
        message: "Correo, apodo o WhatsApp es obligatorio"
      });
    }

    const [users] = await pool.query(
      `SELECT id, nombre, correo, apodo, whatsapp
       FROM usuarios
       WHERE correo = ? OR apodo = ? OR whatsapp = ?
       LIMIT 1`,
      [identificador, identificador, identificador]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const user = users[0];

    if (!user.correo) {
      return res.status(400).json({
        message: "Este usuario no tiene correo registrado para recuperación"
      });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `UPDATE password_resets 
       SET usado = 1 
       WHERE usuario_id = ? AND usado = 0`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_resets (usuario_id, codigo, expira_en)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [user.id, codigo]
    );

    console.log("Código de recuperación:", codigo);

    try {
      await enviarCodigoRecuperacion({
        to: user.correo,
        nombre: user.nombre,
        codigo
      });

      console.log("Correo de recuperación enviado a:", user.correo);
    } catch (emailError) {
      console.error("Error al enviar correo:", {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response
      });

      return res.status(500).json({
        message: "El código se generó, pero no se pudo enviar el correo",
        error: emailError.message,
        code: emailError.code || null
      });
    }

    return res.json({
      message: "Código de recuperación enviado correctamente"
    });
  } catch (error) {
    console.error("Error en recoverPassword:", error);
    return res.status(500).json({
      message: "Error interno al solicitar recuperación",
      error: error.message
    });
  }
};

export const verifyRecoveryCode = async (req, res) => {
  try {
    const { identificador, codigo } = req.body;

    if (!identificador || !codigo) {
      return res.status(400).json({
        message: "Identificador y código son obligatorios"
      });
    }

    const [rows] = await pool.query(
      `SELECT pr.id, pr.usuario_id
       FROM password_resets pr
       INNER JOIN usuarios u ON u.id = pr.usuario_id
       WHERE (u.correo = ? OR u.apodo = ? OR u.whatsapp = ?)
       AND pr.codigo = ?
       AND pr.usado = 0
       AND pr.expira_en > NOW()
       ORDER BY pr.id DESC
       LIMIT 1`,
      [identificador, identificador, identificador, codigo]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Código inválido o expirado"
      });
    }

    return res.json({
      message: "Código validado correctamente"
    });
  } catch (error) {
    console.error("Error en verifyRecoveryCode:", error);
    return res.status(500).json({
      message: "Error interno al validar código",
      error: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { identificador, codigo, password } = req.body;

    if (!identificador || !codigo || !password) {
      return res.status(400).json({
        message: "Identificador, código y nueva contraseña son obligatorios"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres"
      });
    }

    const [rows] = await pool.query(
      `SELECT pr.id, pr.usuario_id
       FROM password_resets pr
       INNER JOIN usuarios u ON u.id = pr.usuario_id
       WHERE (u.correo = ? OR u.apodo = ? OR u.whatsapp = ?)
       AND pr.codigo = ?
       AND pr.usado = 0
       AND pr.expira_en > NOW()
       ORDER BY pr.id DESC
       LIMIT 1`,
      [identificador, identificador, identificador, codigo]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Código inválido o expirado"
      });
    }

    const reset = rows[0];
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE usuarios SET password_hash = ? WHERE id = ?`,
      [passwordHash, reset.usuario_id]
    );

    await pool.query(
      `UPDATE password_resets SET usado = 1 WHERE id = ?`,
      [reset.id]
    );

    return res.json({
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({
      message: "Error interno al actualizar contraseña",
      error: error.message
    });
  }
};