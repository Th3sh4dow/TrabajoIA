# 📊 Comparación: MySQL Local vs Supabase

## 🔄 Cambios en la Conexión

### ❌ ANTES (MySQL Local)
```javascript
// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### ✅ DESPUÉS (Supabase - PostgreSQL)
```javascript
// backend/db-postgres.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

---

## 🔄 Cambios en las Variables de Entorno

### ❌ ANTES (.env con MySQL)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tu_database
PORT=3001
```

### ✅ DESPUÉS (.env con Supabase)
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
PORT=3001
```

---

## 🔄 Cambios en las Queries

### Ejemplo 1: SELECT Simple

#### ❌ ANTES (MySQL)
```javascript
const [rows] = await req.pool.query("SELECT * FROM products");
res.json(rows);
```

#### ✅ DESPUÉS (PostgreSQL)
```javascript
const { rows } = await req.pool.query("SELECT * FROM products");
res.json(rows);
```

**Cambio:** MySQL devuelve `[rows, fields]`, PostgreSQL devuelve `{ rows, fields }`

---

### Ejemplo 2: SELECT con WHERE

#### ❌ ANTES (MySQL)
```javascript
const [rows] = await req.pool.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

#### ✅ DESPUÉS (PostgreSQL)
```javascript
const { rows } = await req.pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
```

**Cambios:**
- `execute` → `query`
- `?` → `$1, $2, $3...`
- `[rows]` → `{ rows }`

---

### Ejemplo 3: INSERT

#### ❌ ANTES (MySQL)
```javascript
const [result] = await req.pool.execute(
  "INSERT INTO products (name, price) VALUES (?, ?)",
  [name, price]
);
const newId = result.insertId;
```

#### ✅ DESPUÉS (PostgreSQL)
```javascript
const { rows } = await req.pool.query(
  "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id",
  [name, price]
);
const newId = rows[0].id;
```

**Cambios:**
- Agregar `RETURNING id` para obtener el ID
- `result.insertId` → `rows[0].id`

---

### Ejemplo 4: UPDATE

#### ❌ ANTES (MySQL)
```javascript
await req.pool.execute(
  "UPDATE products SET price = ? WHERE id = ?",
  [newPrice, productId]
);
```

#### ✅ DESPUÉS (PostgreSQL)
```javascript
await req.pool.query(
  "UPDATE products SET price = $1 WHERE id = $2",
  [newPrice, productId]
);
```

**Cambio:** Solo los placeholders (`?` → `$1`)

---

### Ejemplo 5: DELETE

#### ❌ ANTES (MySQL)
```javascript
await req.pool.execute(
  "DELETE FROM products WHERE id = ?",
  [productId]
);
```

#### ✅ DESPUÉS (PostgreSQL)
```javascript
await req.pool.query(
  "DELETE FROM products WHERE id = $1",
  [productId]
);
```

**Cambio:** Solo los placeholders

---

## 🔄 Cambios en el Esquema SQL

### Tipos de Datos

| MySQL | PostgreSQL | Notas |
|-------|------------|-------|
| `INT AUTO_INCREMENT` | `SERIAL` o `BIGSERIAL` | Para IDs |
| `VARCHAR(255)` | `VARCHAR(255)` | ✅ Igual |
| `TEXT` | `TEXT` | ✅ Igual |
| `DECIMAL(10,2)` | `DECIMAL(10,2)` o `NUMERIC(10,2)` | ✅ Igual |
| `TIMESTAMP` | `TIMESTAMPTZ` | Con zona horaria |
| `DATETIME` | `TIMESTAMP` | Sin zona horaria |
| `TINYINT(1)` | `BOOLEAN` | Para true/false |
| `JSON` | `JSON` o `JSONB` | JSONB es más rápido |

### Ejemplo de Tabla

#### ❌ ANTES (MySQL)
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ✅ DESPUÉS (PostgreSQL)
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 Cambios en Funciones SQL

| Operación | MySQL | PostgreSQL |
|-----------|-------|------------|
| Fecha actual | `NOW()` o `CURRENT_TIMESTAMP` | `NOW()` ✅ |
| Concatenar | `CONCAT(a, b)` | `a || b` o `CONCAT(a, b)` |
| Case insensitive | `LIKE '%text%'` | `ILIKE '%text%'` |
| Límite | `LIMIT 10` | `LIMIT 10` ✅ |
| Offset | `LIMIT 10 OFFSET 5` | `LIMIT 10 OFFSET 5` ✅ |
| Substring | `SUBSTRING(str, 1, 5)` | `SUBSTRING(str, 1, 5)` ✅ |

---

## 📦 Cambios en package.json

### ❌ ANTES
```json
{
  "dependencies": {
    "mysql2": "^3.16.3",
    "express": "^5.2.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.3"
  }
}
```

### ✅ DESPUÉS (Opción PostgreSQL)
```json
{
  "dependencies": {
    "pg": "^8.18.0",  // Ya lo tienes instalado
    "express": "^5.2.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.3"
  }
}
```

### ✅ DESPUÉS (Opción Supabase Client)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",  // Nuevo
    "express": "^5.2.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.3"
  }
}
```

---

## 🎯 Resumen de Cambios Necesarios

### Opción PostgreSQL Directo (Mínimos cambios)

| Archivo | Acción |
|---------|--------|
| `.env` | ✏️ Cambiar variables |
| `db.js` | 🔄 Reemplazar con `db-postgres.js` |
| `index.js` | 🔄 Cambiar `require('./db')` |
| `routes/*.js` | ✏️ Cambiar `[rows]` → `{ rows }` y `?` → `$1` |
| Esquema SQL | 🔄 Ejecutar en Supabase |

### Opción Supabase Client (Más cambios)

| Archivo | Acción |
|---------|--------|
| `.env` | ✏️ Cambiar variables |
| `package.json` | ➕ Instalar `@supabase/supabase-js` |
| `supabase.js` | ➕ Crear nuevo |
| `index.js` | 🔄 Reemplazar completamente |
| `routes/*.js` | 🔄 Reescribir todas las queries |
| Esquema SQL | 🔄 Ejecutar en Supabase |

---

## ✅ Ventajas de Supabase

1. ✅ **Hosting en la nube** - No necesitas servidor de BD
2. ✅ **Backups automáticos** - Supabase hace backups diarios
3. ✅ **Escalabilidad** - Crece con tu aplicación
4. ✅ **Dashboard visual** - Ver y editar datos fácilmente
5. ✅ **API REST automática** - Supabase genera APIs
6. ✅ **Realtime** - Suscripciones a cambios en tiempo real
7. ✅ **Storage** - Almacenamiento de archivos incluido
8. ✅ **Auth** - Sistema de autenticación integrado
9. ✅ **Row Level Security** - Seguridad a nivel de fila
10. ✅ **Gratis hasta 500MB** - Plan gratuito generoso

---

## ⚠️ Consideraciones

1. **Conexión a Internet** - Necesitas internet (vs MySQL local)
2. **Latencia** - Puede ser ligeramente más lenta que local
3. **Límites del plan gratuito:**
   - 500 MB de base de datos
   - 1 GB de almacenamiento
   - 2 GB de transferencia
   - 50,000 usuarios activos mensuales

---

## 🚀 Próximos Pasos Recomendados

1. ✅ Crear proyecto en Supabase
2. ✅ Copiar credenciales
3. ✅ Actualizar `.env`
4. ✅ Ejecutar esquema SQL
5. ✅ Probar conexión
6. ✅ Migrar datos (opcional)
7. ✅ Actualizar código
8. ✅ Probar todas las rutas
9. ✅ Configurar RLS en producción
10. ✅ Desplegar aplicación

---

**¿Listo para empezar? Dime en qué paso estás y te ayudo! 🚀**
