# 🚀 Guía de Migración de MySQL Local a Supabase

## 📋 Resumen de Cambios

Para migrar tu aplicación de MySQL local a Supabase, necesitas:

1. ✅ Instalar dependencias
2. ✅ Configurar variables de entorno
3. ✅ Modificar archivos de conexión
4. ✅ Adaptar las rutas (opcional según método)
5. ✅ Migrar el esquema de base de datos
6. ✅ Migrar los datos existentes

---

## 🎯 Opción 1: Usar el Cliente de Supabase (Recomendado)

### Ventajas:
- ✅ API más simple y moderna
- ✅ Funciones de autenticación integradas
- ✅ Realtime subscriptions
- ✅ Storage de archivos
- ✅ Row Level Security automático

### Pasos:

#### 1. Instalar dependencias
```bash
cd backend
npm install @supabase/supabase-js
```

#### 2. Crear archivo `.env`
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_KEY=tu-service-role-key-aqui
PORT=3001
```

#### 3. Reemplazar archivos:
- ❌ Eliminar: `backend/db.js`
- ✅ Usar: `backend/supabase.js` (ya creado)
- ✅ Renombrar: `backend/index-supabase.js` → `backend/index.js`

#### 4. Actualizar las rutas:
Cambia de SQL queries a Supabase queries:

**Antes (MySQL):**
```javascript
const [rows] = await req.pool.query("SELECT * FROM products");
res.json(rows);
```

**Después (Supabase):**
```javascript
const { data, error } = await req.supabase
  .from('products')
  .select('*');

if (error) throw error;
res.json(data);
```

**Ejemplos de conversión:**

| Operación | MySQL | Supabase |
|-----------|-------|----------|
| SELECT | `SELECT * FROM products` | `.from('products').select('*')` |
| WHERE | `WHERE id = ?` | `.eq('id', value)` |
| INSERT | `INSERT INTO products (name) VALUES (?)` | `.from('products').insert({ name })` |
| UPDATE | `UPDATE products SET name = ? WHERE id = ?` | `.from('products').update({ name }).eq('id', id)` |
| DELETE | `DELETE FROM products WHERE id = ?` | `.from('products').delete().eq('id', id)` |
| JOIN | `JOIN orders ON ...` | `.select('*, orders(*)')` |
| LIMIT | `LIMIT 10` | `.limit(10)` |
| ORDER BY | `ORDER BY created_at DESC` | `.order('created_at', { ascending: false })` |

---

## 🎯 Opción 2: Usar PostgreSQL Directamente

### Ventajas:
- ✅ Cambios mínimos en el código
- ✅ Usa SQL estándar
- ✅ Más control sobre las queries

### Pasos:

#### 1. Ya tienes `pg` instalado (verificar)
```bash
cd backend
npm list pg
```

Si no está instalado:
```bash
npm install pg
```

#### 2. Crear archivo `.env`
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres
PORT=3001
```

**Nota:** Obtén la cadena de conexión desde:
Supabase Dashboard → Settings → Database → Connection String (URI)

#### 3. Reemplazar archivos:
- ❌ Eliminar: `backend/db.js`
- ✅ Usar: `backend/db-postgres.js` (ya creado)
- ✅ Renombrar: `backend/index-postgres.js` → `backend/index.js`

#### 4. Actualizar las rutas (cambios mínimos):

**Antes (MySQL):**
```javascript
const [rows] = await req.pool.query("SELECT * FROM products");
```

**Después (PostgreSQL):**
```javascript
const { rows } = await req.pool.query("SELECT * FROM products");
```

**Diferencias principales:**
- MySQL devuelve: `[rows, fields]`
- PostgreSQL devuelve: `{ rows, fields }`

---

## 🗄️ Migrar el Esquema de Base de Datos

### Opción A: Usar el SQL Editor de Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Crea las tablas necesarias

**Ejemplo de conversión de MySQL a PostgreSQL:**

**MySQL:**
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**PostgreSQL (Supabase):**
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

### Opción B: Usar la interfaz de Supabase

1. Ve a **Table Editor**
2. Click en **New Table**
3. Define las columnas manualmente

---

## 📊 Migrar los Datos

### Opción 1: Exportar/Importar CSV

1. **Exportar desde MySQL:**
```sql
SELECT * FROM products 
INTO OUTFILE '/tmp/products.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

2. **Importar en Supabase:**
- Ve a Table Editor
- Selecciona la tabla
- Click en "Insert" → "Import data from CSV"

### Opción 2: Script de migración

```javascript
// migrate-data.js
const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function migrate() {
  // Conectar a MySQL
  const mysqlConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_password',
    database: 'tu_database'
  });

  // Obtener datos
  const [products] = await mysqlConn.query('SELECT * FROM products');
  
  // Insertar en Supabase
  const { data, error } = await supabase
    .from('products')
    .insert(products);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`✅ Migrados ${products.length} productos`);
  }

  await mysqlConn.end();
}

migrate();
```

---

## 🔐 Configurar Row Level Security (RLS)

Supabase usa RLS para seguridad. Ejemplos de políticas:

```sql
-- Permitir lectura pública de productos
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Solo usuarios autenticados pueden crear reseñas
CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Los usuarios solo pueden editar sus propias órdenes
CREATE POLICY "Users can update own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id);
```

---

## 🎨 Actualizar el Frontend (si es necesario)

Si usas el cliente de Supabase en el frontend:

```bash
cd frontend
npm install @supabase/supabase-js
```

```javascript
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Archivo `.env` del frontend:**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## ✅ Checklist de Migración

- [ ] Crear proyecto en Supabase
- [ ] Obtener credenciales (URL, Keys, Connection String)
- [ ] Instalar dependencias (`@supabase/supabase-js` o usar `pg`)
- [ ] Crear archivo `.env` con las credenciales
- [ ] Migrar esquema de base de datos
- [ ] Migrar datos existentes
- [ ] Actualizar archivos de conexión
- [ ] Actualizar rutas del backend
- [ ] Configurar Row Level Security
- [ ] Probar todas las rutas
- [ ] Actualizar frontend (si es necesario)

---

## 🚨 Diferencias Importantes MySQL vs PostgreSQL

| Característica | MySQL | PostgreSQL |
|----------------|-------|------------|
| Auto-increment | `AUTO_INCREMENT` | `SERIAL` o `BIGSERIAL` |
| Timestamp | `TIMESTAMP` | `TIMESTAMPTZ` |
| Booleanos | `TINYINT(1)` | `BOOLEAN` |
| Strings | `VARCHAR` | `VARCHAR` o `TEXT` |
| Límite | `LIMIT 10` | `LIMIT 10` ✅ |
| Offset | `LIMIT 10 OFFSET 5` | `LIMIT 10 OFFSET 5` ✅ |
| Concatenar | `CONCAT()` | `||` o `CONCAT()` |
| Case insensitive | `LIKE` | `ILIKE` |

---

## 🆘 Solución de Problemas

### Error: "SSL connection required"
```javascript
// Agregar en db-postgres.js
ssl: {
  rejectUnauthorized: false
}
```

### Error: "relation does not exist"
- Verifica que las tablas existan en Supabase
- Verifica que los nombres sean exactos (case-sensitive)

### Error: "new row violates row-level security policy"
- Configura políticas RLS en Supabase
- O desactiva RLS temporalmente (no recomendado en producción)

---

## 📚 Recursos Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL vs MySQL](https://supabase.com/docs/guides/database/postgres-vs-mysql)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Recomendación

**Para tu caso, recomiendo la Opción 2 (PostgreSQL directo)** porque:
- ✅ Cambios mínimos en tu código actual
- ✅ Solo necesitas cambiar la conexión
- ✅ Las queries SQL funcionarán casi igual
- ✅ Ya tienes `pg` instalado

Luego, si necesitas funciones avanzadas (auth, realtime, storage), puedes migrar gradualmente a la Opción 1.
