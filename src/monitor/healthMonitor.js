const db = require('../database/db');

function getStatusByDate(callback) {

    // 1. Obtener todos los registros
    db.all("SELECT date, created_at FROM hours ORDER BY date ASC", [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        if (!rows.length) {
            return callback(null, {});
        }

        const statusByDate = {};

        // 2. Detectar último registro (salud del sistema)
        const lastRecord = rows[rows.length - 1];
        const lastCreatedAt = new Date(lastRecord.created_at);
        const now = new Date();

        const diffHours = (now - lastCreatedAt) / (1000 * 60 * 60);

        const systemDown = diffHours > 48;

        // 3. Crear mapa de fechas existentes
        const existingDates = new Set(rows.map(r => r.date));

        // 4. Rango de fechas (del primer registro hasta hoy)
        const startDate = new Date(rows[0].date);
        const endDate = new Date();

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

            const dateStr = d.toISOString().split('T')[0];

            if (systemDown) {
                statusByDate[dateStr] = { status: 'error' };
                continue;
            }

            if (!existingDates.has(dateStr)) {
                statusByDate[dateStr] = { status: 'error' };
            } else {
                statusByDate[dateStr] = { status: 'ok' };
            }
        }

        callback(null, statusByDate);
    });
}

module.exports = {
    getStatusByDate
};