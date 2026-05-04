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

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarCodigoRecuperacion = async ({ to, nombre, codigo }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Código de recuperación - Quiniela Conde",
    html: `
      <div style="font-family: Arial, sans-serif; background:#0b0b0b; color:#ffffff; padding:24px;">
        <h2 style="color:#00ff88;">Quiniela Conde</h2>
        <p>Hola ${nombre || ""},</p>
        <p>Tu código de recuperación es:</p>
        <div style="font-size:32px; font-weight:800; letter-spacing:6px; color:#00ff88; margin:20px 0;">
          ${codigo}
        </div>
        <p>Este código vence en 10 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `
  });
};