const express = require("express");
const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('products')
      .select('id, name, price, description, image_url');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Error en GET /products:", err);
    res.status(500).json({ error: "Error fetching products", details: err.message });
  }
});

module.exports = router;
