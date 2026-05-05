import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarCodigoRecuperacion = async ({ to, nombre, codigo }) => {
  if (!to) {
    throw new Error("No hay correo destinatario");
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Quiniela Conde <onboarding@resend.dev>",
    to: [to],
    subject: "Código de recuperación - Quiniela Conde",
    html: `
      <div style="font-family: Arial, sans-serif; background:#0b0b0b; color:#ffffff; padding:24px;">
        <h2 style="color:#00ff88;">Quiniela Conde</h2>
        <p>Hola ${nombre || "jugador"},</p>
        <p>Tu código de recuperación es:</p>
        <div style="font-size:32px; font-weight:800; letter-spacing:6px; color:#00ff88; margin:20px 0;">
          ${codigo}
        </div>
        <p>Este código vence en 10 minutos.</p>
      </div>
    `
  });

  if (error) {
    throw new Error(error.message || "Error al enviar correo con Resend");
  }

  return data;
};