const express = require("express");
const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  try {
    if (!req.supabase) {
      console.error("❌ ERROR: El cliente de Supabase no está inicializado en la petición.");
      return res.status(500).json({ error: "Servidor mal configurado: Supabase no disponible." });
    }

    const { data, error } = await req.supabase
      .from('products')
      .select('id, name, price, description, image_url');

    if (error) {
      console.error("❌ Error de consulta en Supabase:", error);
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error crítico en GET /products:", err.message);
    res.status(500).json({
      error: "Error fetching products",
      details: err.message,
      hint: "Verifica las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY en Vercel."
    });
  }
});

module.exports = router;
