const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Faltan campos" });

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) return res.status(400).json({ error: "Cuenta ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const { error: insertError } = await req.supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }]);

    if (insertError) throw insertError;

    res.json({ message: "Cuenta creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Faltan campos" });

  try {
    const { data: user, error } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(400).json({ error: "Cuenta no encontrada" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

    res.json({ message: "Inicio de sesión correcto", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
});

module.exports = router;
