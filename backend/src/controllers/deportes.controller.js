import pool from "../config/db.js";

export const obtenerDeportesConLigas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.id AS deporte_id,
        d.nombre AS deporte_nombre,
        d.icono AS deporte_icono,
        l.id AS liga_id,
        l.nombre AS liga_nombre,
        l.logo AS liga_logo,
        l.fecha_cierre
      FROM deportes d
      LEFT JOIN ligas l 
        ON l.deporte_id = d.id
        AND l.estado = 'activa'
      WHERE d.estado = 'activo'
      ORDER BY d.id ASC, l.id ASC
    `);

    const deportesMap = {};

    rows.forEach((row) => {
      if (!deportesMap[row.deporte_id]) {
        deportesMap[row.deporte_id] = {
          id: row.deporte_id,
          nombre: row.deporte_nombre,
          icono: row.deporte_icono,
          ligas: []
        };
      }

      if (row.liga_id) {
        deportesMap[row.deporte_id].ligas.push({
          id: row.liga_id,
          nombre: row.liga_nombre,
          logo: row.liga_logo,
          fecha_cierre: row.fecha_cierre
        });
      }
    });

    const deportes = Object.values(deportesMap);

    return res.json(deportes);
  } catch (error) {
    console.error("Error obteniendo deportes y ligas:", error);

    return res.status(500).json({
      message: "Error interno al obtener deportes y ligas"
    });
  }
};