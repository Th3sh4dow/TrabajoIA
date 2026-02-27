-- ================================================
-- ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- ================================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- (https://app.supabase.com/project/_/sql)

-- ================================================
-- 1. TABLA DE PRODUCTOS
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por categoría
CREATE INDEX idx_products_category ON products(category);

-- ================================================
-- 2. TABLA DE USUARIOS
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hash de bcrypt
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX idx_users_email ON users(email);

-- ================================================
-- 3. TABLA DE ÓRDENES
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
  items JSONB NOT NULL, -- Array de productos [{id, name, price, quantity}]
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ================================================
-- 4. TABLA DE RESEÑAS
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ================================================
-- 5. TABLA DE CARRITO
-- ================================================
CREATE TABLE IF NOT EXISTS carrito (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Array de productos [{id, name, price, quantity}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por usuario
CREATE INDEX idx_carrito_user_id ON carrito(user_id);

-- ================================================
-- FUNCIONES AUXILIARES
-- ================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carrito_updated_at BEFORE UPDATE ON carrito
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
-- IMPORTANTE: Supabase requiere RLS para seguridad
-- Puedes desactivarlo temporalmente para desarrollo

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;

-- ================================================
-- POLÍTICAS DE SEGURIDAD (Ejemplos básicos)
-- ================================================

-- PRODUCTOS: Lectura pública, escritura solo autenticados
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- USUARIOS: Solo pueden ver/editar su propia información
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR true); -- Temporal: permite lectura pública

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- ÓRDENES: Solo pueden ver sus propias órdenes
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (true); -- Temporal: permite lectura pública

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (true); -- Temporal: permite inserción pública

-- RESEÑAS: Lectura pública, escritura autenticada
CREATE POLICY "Allow public read access on reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on reviews"
  ON reviews FOR INSERT
  WITH CHECK (true); -- Temporal: permite inserción pública

-- CARRITO: Solo pueden ver/editar su propio carrito
CREATE POLICY "Users can view own cart"
  ON carrito FOR SELECT
  USING (true); -- Temporal: permite lectura pública

CREATE POLICY "Users can manage own cart"
  ON carrito FOR ALL
  USING (true); -- Temporal: permite todo públicamente

-- ================================================
-- DATOS DE EJEMPLO (Opcional)
-- ================================================

-- Insertar productos de ejemplo
INSERT INTO products (name, price, description, image_url, stock, category) VALUES
  ('Laptop Gaming', 1299.99, 'Potente laptop para gaming con RTX 4060', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', 15, 'Electronics'),
  ('Mouse Inalámbrico', 29.99, 'Mouse ergonómico con 6 botones programables', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 50, 'Accessories'),
  ('Teclado Mecánico', 89.99, 'Teclado mecánico RGB con switches Cherry MX', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 30, 'Accessories'),
  ('Monitor 4K', 449.99, 'Monitor 27" 4K UHD con 144Hz', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', 20, 'Electronics'),
  ('Auriculares Gaming', 79.99, 'Auriculares con sonido 7.1 y micrófono', 'https://images.unsplash.com/photo-1599669454699-248893623440', 40, 'Accessories')
ON CONFLICT DO NOTHING;

-- Insertar usuario de prueba
-- Contraseña: "password123" (hash de bcrypt)
INSERT INTO users (name, email, password) VALUES
  ('Usuario Demo', 'demo@example.com', '$2a$10$YourBcryptHashHere')
ON CONFLICT DO NOTHING;

-- ================================================
-- VISTAS ÚTILES (Opcional)
-- ================================================

-- Vista de productos con promedio de rating
CREATE OR REPLACE VIEW products_with_ratings AS
SELECT 
  p.*,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id;

-- Vista de órdenes con información de usuario
CREATE OR REPLACE VIEW orders_with_user AS
SELECT 
  o.*,
  u.name as user_name,
  u.email as user_email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- ================================================
-- NOTAS IMPORTANTES
-- ================================================
-- 1. Cambia las políticas RLS según tus necesidades de seguridad
-- 2. Las políticas actuales son permisivas (true) para desarrollo
-- 3. En producción, usa auth.uid() para validar usuarios
-- 4. Ajusta los tipos de datos según tus necesidades
-- 5. Agrega más índices si tienes queries lentas

-- ================================================
-- VERIFICACIÓN
-- ================================================
-- Ejecuta esto para verificar que todo se creó correctamente:

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
