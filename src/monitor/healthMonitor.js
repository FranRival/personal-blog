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



        // Ì†ΩÌ¥• MAPA DE D√çAS CON DATOS

        const existingDates = new Set(rows.map(r => r.date));



        // Ì†ΩÌ¥• RANGO: desde el primer dato hasta hoy

        const startDate = new Date(rows[0].date);

        const endDate = new Date();



        // Ì†ΩÌ¥• DEFINE CU√ÅNDO EMPEZ√ì EL SISTEMA REALMENTE

        // Ajusta esta fecha seg√∫n tu caso real

        const systemStartDate = new Date('2026-03-02');



        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {



            const dateStr = d.toISOString().split('T')[0];



            /*

            ======================================================

            Ì†ΩÌ¥µ ANTES DEL SISTEMA

            - Si hay dato ‚Üí OK

            - Si no hay dato ‚Üí ignorar (NO error)

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

            Ì†ΩÌ¥¥ DESPU√âS DEL SISTEMA

            - Si no hay dato ‚Üí ERROR

            ======================================================

            */

            if (!existingDates.has(dateStr)) {

                statusByDate[dateStr] = { status: 'error' };

                continue;

            }



            /*

            ======================================================

            Ì†ΩÌø¢ TODO OK

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
