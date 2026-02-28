// api/index.js
// Vercel usará este archivo como una función que carga todo el backend Express
const app = require('../backend/index');

// Exportar la aplicación para que Vercel la ejecute
module.exports = app;
