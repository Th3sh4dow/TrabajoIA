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

// --- CONFIGURACIÓN DE RUTAS ---
const apiRouter = express.Router();
apiRouter.use("/products", require("./routes/products"));
apiRouter.use("/orders", require("./routes/orders"));
apiRouter.use("/reviews", require("./routes/reviews"));
apiRouter.use("/users", require("./routes/users"));
apiRouter.use("/cart", require("./routes/cart"));

// Para que funcione tanto en Vercel (/api) como en local (/) 
app.use("/api", apiRouter);
app.use("/", apiRouter);

app.get("/", (req, res) => {
  res.send("Backend funcionando con API de Supabase 🚀");
});

const PORT = process.env.PORT || 3001;

// Solo ejecutamos el servidor local si no estamos en Vercel (donde lo maneja serverless)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor local en http://localhost:${PORT}`);
  });
}

// Exportar la instancia para que Vercel Functions pueda cargarla
module.exports = app;
