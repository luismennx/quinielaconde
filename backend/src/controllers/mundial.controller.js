import pool from "../config/db.js";

export const obtenerJornadasMundial = async (req, res) => {
  try {
    const { ligaId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        liga_id,
        nombre,
        fase,
        fecha_inicio,
        fecha_fin,
        estado
      FROM mundial_jornadas
      WHERE liga_id = ?
      AND estado = 'activo'
      ORDER BY fecha_inicio ASC
      `,
      [ligaId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo jornadas mundial:", error);

    res.status(500).json({
      message: "Error interno al obtener jornadas del mundial",
      debug: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  }
};

export const obtenerPartidosPorJornada = async (req, res) => {
  try {
    const { jornadaId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        jornada_id,
        grupo,
        local_nombre,
        local_bandera,
        visitante_nombre,
        visitante_bandera,
        fecha_partido,
        estado
      FROM mundial_partidos
      WHERE jornada_id = ?
      ORDER BY fecha_partido ASC
      `,
      [jornadaId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo partidos mundial:", error);

    res.status(500).json({
      message: "Error interno al obtener partidos del mundial",
      debug: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  }
};

export const obtenerPosicionesMundial = async (req, res) => {
  try {
    const { ligaId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        liga_id,
        grupo,
        equipo_nombre,
        equipo_bandera,
        pj,
        g,
        e,
        p,
        gf,
        gc,
        dg,
        pts,
        orden
      FROM mundial_posiciones
      WHERE liga_id = ?
      ORDER BY grupo ASC, pts DESC, dg DESC, gf DESC, orden ASC
      `,
      [ligaId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo posiciones mundial:", error);

    res.status(500).json({
      message: "Error interno al obtener posiciones del mundial",
      debug: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  }
};