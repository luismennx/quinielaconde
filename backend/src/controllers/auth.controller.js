export const login = async (req, res) => {
  try {
    console.log("🔵 [LOGIN] Request body:", req.body);

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

    console.log("🟢 [LOGIN] Usuario encontrado:", user);

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
      console.error("🔴 JWT_SECRET NO DEFINIDO");
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
    console.error("💥 ERROR REAL EN LOGIN:", error);

    return res.status(500).json({
      message: "Error interno al iniciar sesión",
      error: error.message // 👈 IMPORTANTE para debug
    });
  }
};