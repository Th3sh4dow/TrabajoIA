const express = require("express");
const router = express.Router();

// POST /orders
router.post("/", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items" });
  }

  try {
    const { error } = await req.supabase
      .from('orders')
      .insert([{ items: items }]);

    if (error) throw error;
    res.json({ message: "Pedido recibido" });
  } catch (err) {
    console.error("❌ Error en POST /orders:", err);
    res.status(500).json({ error: "Error creating order", details: err.message });
  }
});

module.exports = router;
