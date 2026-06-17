import pool from "../config/db.js";

export const obtenerMisJuegos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [tickets] = await pool.query(
      `
      SELECT 
        t.id,
        t.folio,
        t.estado,
        t.total_aciertos,
        t.puntos_obtenidos,
        t.costo_unitario,
        t.creado_en,
        l.nombre AS liga,
        d.nombre AS deporte,
        j.nombre AS jornada,
        j.fecha_fin AS cierre
      FROM tickets t
      INNER JOIN jornadas j ON t.jornada_id = j.id
      INNER JOIN ligas l ON t.liga_id = l.id
      INNER JOIN deportes d ON l.deporte_id = d.id
      WHERE t.usuario_id = ?
      ORDER BY t.creado_en DESC
      `,
      [usuarioId]
    );

    const ticketsConResumen = [];

    for (const ticket of tickets) {
      const [predicciones] = await pool.query(
        `
        SELECT 
          e.id AS evento_id,
          el.nombre AS equipo_local,
          ev.nombre AS equipo_visitante,
          p.seleccion
        FROM predicciones p
        INNER JOIN eventos e ON p.evento_id = e.id
        INNER JOIN equipos el ON e.local_id = el.id
        INNER JOIN equipos ev ON e.visitante_id = ev.id
        WHERE p.ticket_id = ?
        ORDER BY e.fecha_hora ASC
        LIMIT 3
        `,
        [ticket.id]
      );

      ticketsConResumen.push({
        ...ticket,
        resumen_partidos: predicciones
      });
    }

    return res.json({
      ok: true,
      tickets: ticketsConResumen
    });
  } catch (error) {
    console.error("Error obteniendo mis juegos:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener mis juegos"
    });
  }
};

export const obtenerDetalleJuego = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { ticketId } = req.params;

    const [ticketRows] = await pool.query(
      `
      SELECT 
        t.id,
        t.folio,
        t.estado,
        t.total_aciertos,
        t.puntos_obtenidos,
        t.costo_unitario,
        t.creado_en,
        l.nombre AS liga,
        d.nombre AS deporte,
        j.nombre AS jornada,
        j.fecha_fin AS cierre
      FROM tickets t
      INNER JOIN jornadas j ON t.jornada_id = j.id
      INNER JOIN ligas l ON t.liga_id = l.id
      INNER JOIN deportes d ON l.deporte_id = d.id
      WHERE t.id = ? AND t.usuario_id = ?
      LIMIT 1
      `,
      [ticketId, usuarioId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Ticket no encontrado"
      });
    }

    const [predicciones] = await pool.query(
      `
      SELECT 
        e.id AS evento_id,
        el.nombre AS equipo_local,
        ev.nombre AS equipo_visitante,
        p.seleccion,
        e.marcador_local,
        e.marcador_visitante,
        e.estado AS estado_partido,
        e.fecha_hora
      FROM predicciones p
      INNER JOIN eventos e ON p.evento_id = e.id
      INNER JOIN equipos el ON e.local_id = el.id
      INNER JOIN equipos ev ON e.visitante_id = ev.id
      WHERE p.ticket_id = ?
      ORDER BY e.fecha_hora ASC
      `,
      [ticketId]
    );

    return res.json({
      ok: true,
      ticket: ticketRows[0],
      predicciones
    });
  } catch (error) {
    console.error("Error obteniendo detalle del juego:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener detalle del juego"
    });
  }
};