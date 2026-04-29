import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

console.log("🚀 VERSION NUEVA LOGIN ACTIVA");

export const register = async (req, res) => {
  try {
    console.log("🔵 [REGISTER] Body:", req.body);

    const { nombre, apodo, correo, whatsapp, password } = req.body;

    if (!nombre || !apodo || !correo || !password) {
      console.log("🟡 [REGISTER] Faltan campos");
      return res.status(400).json({
        message: "Nombre, apodo, correo y contraseña son obligatorios"
      });
    }

    console.log("🟢 [REGISTER] Verificando usuario existente...");

    const [existingUsers] = await pool.query(
      `SELECT id FROM usuarios 
       WHERE correo = ? OR apodo = ? OR whatsapp = ?`,
      [correo, apodo, whatsapp || null]
    );

    console.log("🟢 [REGISTER] Resultado búsqueda:", existingUsers);

    if (existingUsers.length > 0) {
      console.log("🔴 [REGISTER] Usuario ya existe");
      return res.status(409).json({
        message: "Ya existe una cuenta con ese correo, apodo o WhatsApp"
      });
    }

    console.log("🟢 [REGISTER] Encriptando contraseña...");

    const passwordHash = await bcrypt.hash(password, 10);

    console.log("🟢 [REGISTER] Insertando usuario...");

    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, apodo, correo, whatsapp, password_hash, rol, estado)
       VALUES (?, ?, ?, ?, ?, 'jugador', 'activo')`,
      [nombre, apodo, correo, whatsapp || null, passwordHash]
    );

    console.log("🟢 [REGISTER] Usuario creado ID:", result.insertId);

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
    console.error("💥 ERROR EN REGISTER:", error);

    return res.status(500).json({
      message: "Error interno al registrar usuario",
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("🔵 [LOGIN] Body:", req.body);

    const { identificador, password } = req.body;

    if (!identificador || !password) {
      console.log("🟡 [LOGIN] Faltan datos");
      return res.status(400).json({
        message: "Identificador y contraseña son obligatorios"
      });
    }

    console.log("🟢 [LOGIN] Buscando usuario:", identificador);

    const [users] = await pool.query(
      `SELECT id, nombre, apodo, correo, whatsapp, password_hash, saldo, rol, estado
       FROM usuarios
       WHERE correo = ? OR apodo = ? OR whatsapp = ?
       LIMIT 1`,
      [identificador, identificador, identificador]
    );

    console.log("🟢 [LOGIN] Resultado query:", users);

    if (users.length === 0) {
      console.log("🔴 [LOGIN] Usuario no encontrado");
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const user = users[0];

    console.log("🟢 [LOGIN] Usuario encontrado:", {
      id: user.id,
      correo: user.correo,
      estado: user.estado
    });

    if (user.estado !== "activo") {
      console.log("🔴 [LOGIN] Usuario inactivo");
      return res.status(403).json({
        message: "Tu cuenta no está activa"
      });
    }

    console.log("🟢 [LOGIN] Comparando password...");

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    console.log("🟢 [LOGIN] Resultado bcrypt:", passwordIsValid);

    if (!passwordIsValid) {
      console.log("🔴 [LOGIN] Password incorrecto");
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos"
      });
    }

    console.log("🟢 [LOGIN] Generando token...");

    if (!process.env.JWT_SECRET) {
      console.error("🔴 [LOGIN] JWT_SECRET NO DEFINIDO");
      throw new Error("JWT_SECRET no definido");
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

    console.log("🟢 [LOGIN] Login exitoso");

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
    console.error("💥 ERROR REAL EN LOGIN COMPLETO:");
    console.error("name:", error?.name);
    console.error("message:", error?.message);
    console.error("code:", error?.code);
    console.error("errno:", error?.errno);
    console.error("sqlMessage:", error?.sqlMessage);
    console.error("sql:", error?.sql);
    console.error("stack:", error?.stack);
    console.error("error completo:", error);

    return res.status(500).json({
      message: "Error interno al iniciar sesión",
      debug: {
        name: error?.name || null,
        message: error?.message || null,
        code: error?.code || null,
        errno: error?.errno || null,
        sqlMessage: error?.sqlMessage || null,
        sql: error?.sql || null,
        stack: error?.stack || null
      }
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    console.log("🔵 [RECOVER] Body:", req.body);

    const { identificador } = req.body;

    if (!identificador) {
      console.log("🟡 [RECOVER] Falta identificador");
      return res.status(400).json({
        message: "Correo o WhatsApp es obligatorio"
      });
    }

    console.log("🟢 [RECOVER] Buscando usuario...");

    const [users] = await pool.query(
      `SELECT id, nombre, correo, whatsapp
       FROM usuarios
       WHERE correo = ? OR whatsapp = ?
       LIMIT 1`,
      [identificador, identificador]
    );

    console.log("🟢 [RECOVER] Resultado query:", users);

    if (users.length === 0) {
      console.log("🔴 [RECOVER] Usuario no encontrado");
      return res.status(404).json({
        message: "No existe una cuenta con ese correo o WhatsApp"
      });
    }

    console.log("🟢 [RECOVER] Usuario encontrado");

    return res.json({
      message: "Solicitud de recuperación recibida. Próximamente enviaremos instrucciones."
    });

  } catch (error) {
    console.error("💥 ERROR EN RECOVER:", error);

    return res.status(500).json({
      message: "Error interno al recuperar contraseña",
      error: error.message
    });
  }
};