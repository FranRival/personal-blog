const db = require('../database/db');

function getStatusByDate(callback) {

    db.all("SELECT date, created_at FROM hours ORDER BY date ASC", [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        if (!rows.length) {
            return callback(null, {});
        }

        const statusByDate = {};

        // 🔥 1. Detectar último registro (salud global)
        const lastRecord = rows[rows.length - 1];
        const lastCreatedAt = new Date(lastRecord.created_at);
        const now = new Date();

        const diffHours = (now - lastCreatedAt) / (1000 * 60 * 60);
        const systemDown = diffHours > 48;

        // 🔥 2. Mapa de días existentes
        const existingDates = new Set(rows.map(r => r.date));

        // 🔥 3. Rango completo (desde primer registro hasta hoy)
        const startDate = new Date(rows[0].date);
        const endDate = new Date();

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

            const dateStr = d.toISOString().split('T')[0];

            /*
            ======================================================
            🔴 PRIORIDAD 1: SISTEMA CAÍDO
            ======================================================
            */
            if (systemDown) {
                statusByDate[dateStr] = { status: 'error' };
                continue;
            }

            /*
            ======================================================
            🔴 PRIORIDAD 2: DÍA FALTANTE
            ======================================================
            */
            if (!existingDates.has(dateStr)) {
                statusByDate[dateStr] = { status: 'error' };
                continue;
            }

            /*
            ======================================================
            🟢 TODO OK
            ======================================================
            */
            statusByDate[dateStr] = { status: 'ok' };
        }

        callback(null, statusByDate);
    });
}

module.exports = {
    getStatusByDate
};