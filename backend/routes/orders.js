const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Configuración de Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto según tu proveedor (outlook, etc)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// POST /orders
router.post("/", async (req, res) => {
  const { items, carritoId, user_email } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items" });
  }

  // Calculamos el total para que la inserción no falle (la tabla 'orders' lo pide como obligatorio)
  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  try {
    // 1. Crear la orden en la tabla 'orders' (asegurándonos de cumplir con las columnas del esquema)
    const { data: orderData, error: orderError } = await req.supabase
      .from('orders')
      .insert([{
        items: items,
        total: total,
        status: 'completed' // Ya que es post-pago
      }])
      .select();

    if (orderError) {
      console.error("❌ Error en Supabase Insert:", orderError);
      throw orderError;
    }

    // 2. Si viene un carritoId, borrarlo de la tabla 'carrito'
    if (carritoId) {
      // Usamos .match para ser más específicos
      console.log(`Intentando borrar carrito con ID: ${carritoId}`);
      const { error: deleteError } = await req.supabase
        .from('carrito')
        .delete()
        .match({ id: carritoId });

      if (deleteError) {
        console.error("⚠️ Error borrando el carrito en Supabase:", deleteError);
      } else {
        console.log(`✅ Carrito ${carritoId} borrado correctamente`);
      }
    }

    // 3. Envío de correo real con Nodemailer
    if (user_email && user_email.includes('@')) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user_email,
        subject: `Confirmación de Pedido #${orderData[0].id} - NEONBITE`,
        text: `¡Hola! Tu pedido ha sido tramitado correctamente.\n\nID del Pedido: ${orderData[0].id}\nTotal: $${total.toFixed(2)}\n\nGracias por confiar en NEONBITE.`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email enviado con éxito a ${user_email}`);
      } catch (mailErr) {
        console.error("❌ Error al enviar el correo real:", mailErr.message);
        // No detiene el proceso si ya se guardó la orden
      }
    } else {
      console.warn("⚠️ No se puede enviar correo real: falta email válido.");
    }

    res.json({
      success: true,
      message: "Pedido tramitado correctamente, carrito liberado y email enviado.",
      orderId: orderData[0].id
    });

  } catch (err) {
    console.error("❌ Error general en POST /orders:", err);
    res.status(500).json({ error: "Error processing payment", details: err.message });
  }
});

module.exports = router;
