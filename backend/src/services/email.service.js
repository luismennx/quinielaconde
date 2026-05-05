import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("EMAIL CONFIG:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  from: process.env.EMAIL_FROM,
  hasPass: Boolean(process.env.EMAIL_PASS)
});

const emailPort = Number(process.env.EMAIL_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4,
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 8000
});

export const enviarCodigoRecuperacion = async ({ to, nombre, codigo }) => {
  if (!to) {
    throw new Error("No hay correo destinatario");
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || `Quiniela Conde <${process.env.EMAIL_USER}>`,
    to,
    subject: "Código de recuperación - Quiniela Conde",
    html: `
      <div style="font-family: Arial, sans-serif; background:#0b0b0b; color:#ffffff; padding:24px; border-radius:12px;">
        <h2 style="color:#00ff88; margin-bottom:16px;">Quiniela Conde</h2>

        <p>Hola ${nombre || "jugador"},</p>

        <p>Recibimos una solicitud para restablecer tu contraseña.</p>

        <p>Tu código de recuperación es:</p>

        <div style="font-size:32px; font-weight:800; letter-spacing:6px; color:#00ff88; margin:20px 0;">
          ${codigo}
        </div>

        <p>Este código vence en 10 minutos.</p>

        <p style="color:#b5bcc6; font-size:13px;">
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
      </div>
    `
  });
};