const express = require("express");
const router = express.Router();

// Obtener todas las reseñas
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al obtener reseñas:", err);
    res.status(500).json({ error: "Error al obtener las reseñas" });
  }
});

// Crear nueva reseña
router.post("/", async (req, res) => {
  const { user_name, rating, comment } = req.body;

  if (!user_name || !rating || !comment) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const { data, error } = await req.supabase
      .from('reviews')
      .insert([{ user_name, rating, comment }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al crear reseña:", err);
    res.status(500).json({ error: "Error al crear la reseña" });
  }
});

module.exports = router;
