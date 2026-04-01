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

        // 🔥 MAPA DE DÍAS CON DATOS
        const existingDates = new Set(rows.map(r => r.date));

        // 🔥 RANGO: desde el primer dato hasta hoy
        const startDate = new Date(rows[0].date);
        const endDate = new Date();

        // 🔥 DEFINE CUÁNDO EMPEZÓ EL SISTEMA REALMENTE
        // Ajusta esta fecha según tu caso real
        const systemStartDate = new Date('2026-03-02');

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

            const dateStr = d.toISOString().split('T')[0];

            /*
            ======================================================
            🔵 ANTES DEL SISTEMA
            - Si hay dato → OK
            - Si no hay dato → ignorar (NO error)
            ======================================================
            */
            if (d < systemStartDate) {

                if (existingDates.has(dateStr)) {
                    statusByDate[dateStr] = { status: 'ok' };
                }

                continue;
            }

            /*
            ======================================================
            🔴 DESPUÉS DEL SISTEMA
            - Si no hay dato → ERROR
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