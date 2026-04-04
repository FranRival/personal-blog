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
        🔥 CHECK EXTERNAL MONITOR (NUEVO)
        ======================================================
        */
        let externalStatus = {
            status: 'unknown',
            error: null
        };

        try {
            const external = await axios.get('http://IP_MONITOR:8080/api_status.json', {
                timeout: 2000
            });

            externalStatus = external.data;

        } catch (e) {
            externalStatus = {
                status: 'down',
                error: e.code || 'external_unreachable'
            };
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

            /*
            ======================================================
            🔴 PRIORIDAD 1: EXTERNAL MONITOR
            ======================================================
            */
            if (externalStatus.status === 'down') {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: externalStatus.error || 'api_down'
                };
                continue;
            }

            /*
            ======================================================
            🟡 SIN DATOS
            ======================================================
            */
            if (!existingDates.has(dateStr)) {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: 'no_data'
                };
                continue;
            }

            /*
            ======================================================
            🟢 OK
            ======================================================
            */
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

//API caida - servidor apagado - problemas de red - timeout - DNS - firewall ---- todos son la misma categoria: api_down. ERROR. 

//[External monitor]
//creado en otra instancia de lightsail.