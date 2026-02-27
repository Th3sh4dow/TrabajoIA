const express = require("express");
const router = express.Router();

// Crear o actualizar carrito
router.post("/", async (req, res) => {
  const { items, user_id } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "El carrito está vacío" });
  }

  try {
    const { data, error } = await req.supabase
      .from('carrito')
      .insert([{
        user_id: user_id || null,
        items: items // Supabase maneja JSON automáticamente
      }])
      .select();

    if (error) throw error;

    res.json({ message: "Carrito guardado correctamente", carritoId: data[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error guardando el carrito" });
  }
});

// Obtener carritos
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('carrito')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Error en GET /cart:", err);
    res.status(500).json({
      message: "Error obteniendo los carritos",
      error: err.message || err
    });
  }
});

module.exports = router;
