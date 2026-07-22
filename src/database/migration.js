// src/database/migrations.js
//
// Este script se corre UNA sola vez (o cada vez que agregues una tabla nueva).
// Reutiliza la misma conexión que ya usa todo el proyecto, apuntando
// al mismo archivo database.sqlite que ya existe.

const db = require('./db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS paused_ranges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            reason TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creando tabla paused_ranges:', err.message);
        } else {
            console.log('✅ Tabla paused_ranges lista (creada o ya existente)');
        }

        // Cerramos la conexión al terminar, ya que este script
        // es de un solo uso (no es el servidor corriendo indefinidamente)
        db.close((closeErr) => {
            if (closeErr) {
                console.error('Error cerrando la conexión:', closeErr.message);
            } else {
                console.log('Conexión cerrada correctamente');
            }
        });
    });

});