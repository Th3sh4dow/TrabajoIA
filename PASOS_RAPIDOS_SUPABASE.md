# 🚀 Pasos Rápidos para Migrar a Supabase

## 📝 Resumen Ejecutivo

Tienes **2 opciones** para conectar a Supabase:

### ✅ **OPCIÓN RECOMENDADA: PostgreSQL Directo** (Cambios mínimos)
- Solo cambias la conexión
- Tus queries SQL funcionan casi igual
- Menos código que modificar

### 🔷 **OPCIÓN AVANZADA: Cliente Supabase** (Más funciones)
- API moderna y simple
- Funciones extras (auth, realtime, storage)
- Requiere reescribir las queries

---

## 🎯 OPCIÓN 1: PostgreSQL Directo (Recomendada para ti)

### Paso 1: Crear proyecto en Supabase
1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Espera 2-3 minutos a que se configure

### Paso 2: Obtener credenciales
1. Ve a **Settings** → **Database**
2. Busca **Connection String** → **URI**
3. Copia la cadena (se ve así):
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. Reemplaza `[PASSWORD]` con tu contraseña real

### Paso 3: Configurar `.env`
Crea o edita `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxx.supabase.co:5432/postgres
PORT=3001
```

### Paso 4: Actualizar código
Reemplaza `backend/index.js` con el contenido de `backend/index-postgres.js`:
```bash
cd backend
copy index-postgres.js index.js
```

### Paso 5: Crear tablas en Supabase
1. Ve a **SQL Editor** en Supabase
2. Ejecuta tu esquema SQL (convierte AUTO_INCREMENT a SERIAL)
3. Ejemplo:
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Paso 6: Migrar datos (opcional)
Si tienes datos en MySQL:
```bash
node migrate-to-supabase.js
```

### Paso 7: Probar
```bash
npm start
```

### ✅ Listo! Solo necesitas cambiar:
- ✅ Archivo `.env`
- ✅ Archivo `index.js`
- ✅ Crear tablas en Supabase
- ❌ NO necesitas cambiar las rutas (funcionan igual)

---

## 🔷 OPCIÓN 2: Cliente Supabase

### Paso 1-2: Igual que arriba

### Paso 3: Instalar dependencia
```bash
cd backend
npm install @supabase/supabase-js
```

### Paso 4: Configurar `.env`
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
PORT=3001
```

### Paso 5: Actualizar código
```bash
copy index-supabase.js index.js
```

### Paso 6: Actualizar TODAS las rutas
Necesitas cambiar cada archivo en `routes/`:
- `products.js` → usar `products-supabase.js`
- `users.js` → usar `users-supabase.js`
- `cart.js` → usar `cart-supabase.js`
- etc.

---

## 📊 Comparación

| Característica | PostgreSQL Directo | Cliente Supabase |
|----------------|-------------------|------------------|
| Cambios en código | Mínimos | Muchos |
| Queries SQL | Funcionan igual | Hay que reescribir |
| Funciones extra | No | Sí (auth, realtime) |
| Dificultad | ⭐ Fácil | ⭐⭐⭐ Media |
| Tiempo estimado | 30 min | 2-3 horas |

---

## 🆘 Problemas Comunes

### Error: "password authentication failed"
- Verifica que la contraseña en `.env` sea correcta
- No uses `[PASSWORD]`, reemplázalo con tu contraseña real

### Error: "relation does not exist"
- Las tablas no existen en Supabase
- Ve a SQL Editor y créalas

### Error: "SSL required"
Ya está configurado en `db-postgres.js`:
```javascript
ssl: { rejectUnauthorized: false }
```

---

## 📁 Archivos Creados

He creado estos archivos para ayudarte:

### Para PostgreSQL Directo:
- ✅ `backend/db-postgres.js` - Conexión a PostgreSQL
- ✅ `backend/index-postgres.js` - Servidor actualizado
- ✅ `backend/.env.example` - Plantilla de variables

### Para Cliente Supabase:
- ✅ `backend/supabase.js` - Cliente de Supabase
- ✅ `backend/index-supabase.js` - Servidor con Supabase
- ✅ `backend/routes/products-supabase.js` - Ejemplo de ruta
- ✅ `backend/routes/users-supabase.js` - Ejemplo de ruta
- ✅ `backend/routes/cart-supabase.js` - Ejemplo de ruta

### Utilidades:
- ✅ `backend/migrate-to-supabase.js` - Script de migración
- ✅ `MIGRACION_SUPABASE.md` - Guía completa

---

## 🎯 Mi Recomendación

**Usa PostgreSQL Directo** porque:
1. ✅ Solo cambias 2 archivos (`index.js` y `.env`)
2. ✅ Tus rutas actuales funcionan sin cambios
3. ✅ Más rápido de implementar
4. ✅ Puedes migrar a Supabase Client después si lo necesitas

---

## 📞 ¿Necesitas ayuda?

Dime en qué paso estás y te ayudo específicamente.
