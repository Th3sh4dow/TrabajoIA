// backend/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();
app.use(cors());
app.use(express.json());

// Probar conexión a la API
async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log("✅ Conectado a la API de Supabase correctamente");
  } catch (err) {
    console.error("❌ Error de comunicación con la API de Supabase:", err.message);
  }
}

testConnection();

// Middleware para pasar el cliente supabase a las rutas
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// --- RUTAS ---
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/reviews", require("./routes/reviews"));
app.use("/users", require("./routes/users"));
app.use("/cart", require("./routes/cart"));

app.get("/", (req, res) => {
  res.send("Backend funcionando con API de Supabase 🚀");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
