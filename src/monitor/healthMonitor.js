const db = require('../database/db');
const axios = require('axios');

function getStatusByDate(callback) {

    db.all("SELECT date, created_at FROM hours ORDER BY date ASC", [], async (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        if (!rows.length) {
            return callback(null, {});
        }

        const statusByDate = {};

        const existingDates = new Set(rows.map(r => r.date));

        const startDate = new Date(rows[0].date);
        const endDate = new Date();

        const systemStartDate = new Date('2026-03-02');

        /*
        ======================================================
        🔥 NUEVO: CHECAR SI LA API RESPONDE
        ======================================================
        */
        let apiDown = false;

        try {
            await axios.get('https://api.emmanuelibarra.com/api/health', {
                timeout: 3000
            });
        } catch (e) {
            apiDown = true;
        }

        /*
        ======================================================
        LOOP
        ======================================================
        */
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

            const dateStr = d.toISOString().split('T')[0];

            // 🔵 ANTES DEL SISTEMA
            if (d < systemStartDate) {

                if (existingDates.has(dateStr)) {
                    statusByDate[dateStr] = { status: 'ok' };
                }

                continue;
            }

            // 🔴 API CAÍDA (PRIORIDAD MÁXIMA)
            if (apiDown) {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: 'api_down'
                };
                continue;
            }

            // 🟡 SIN DATOS
            if (!existingDates.has(dateStr)) {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: 'no_data'
                };
                continue;
            }

            // 🟢 OK
            statusByDate[dateStr] = { 
                status: 'ok',
                type: 'ok'
            };
        }

        callback(null, statusByDate);
    });
}

module.exports = {
    getStatusByDate
};