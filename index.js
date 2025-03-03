const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

/* We're going to use the aladhan API

    API doc: https://aladhan.com/prayer-times-api
*/

app.get('/prayers', async (req, res) => {

    let {city, country}  = req.query;

    try {

        const response = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        
        if (!response.ok) {
            throw new Error('Problema nel fetch degli orari..');
        }

        const data = await response.json();

        // La data in calendario gregoriano e quella in calendario islamico
        const responseData = {
            timings: data.data.timings,
            date: `${data.data.date.readable} | ${data.data.date.hijri.date} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`
        };

        res.json(responseData);
        
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
