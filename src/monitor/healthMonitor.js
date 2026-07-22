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

        let externalStatus = {
            status: 'unknown',
            error: null
        };

        try {
            const external = await axios.get('http://44.203.231.13:8080/api_status.json', {
                timeout: 2000
            });

            externalStatus = external.data;

        } catch (e) {
            externalStatus = {
                status: 'down',
                error: e.code || 'external_unreachable'
            };
        }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

            const dateStr = d.toISOString().split('T')[0];

            const today = new Date().toISOString().split('T')[0];

            if (externalStatus.status === 'down' && dateStr === today) {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: externalStatus.error
                };
                continue;
            }

            if (!existingDates.has(dateStr)) {
                statusByDate[dateStr] = { 
                    status: 'error',
                    type: 'no_data'
                };
                continue;
            }

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

//error. API. La linea 54 pinta cuadros rojos sin logica. Usando los esapcios sin automatizacion en color rojo. 