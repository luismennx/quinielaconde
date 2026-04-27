import pool from "../config/db.js";

export const getPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [users] = await pool.query(
      `SELECT id, nombre, apodo, correo, whatsapp, saldo, rol, estado, creado_en
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [usuarioId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.json({
      message: "Perfil obtenido correctamente",
      usuario: users[0]
    });
  } catch (error) {
    console.error("Error en getPerfil:", error);

    return res.status(500).json({
      message: "Error interno al obtener perfil"
    });
  }
};