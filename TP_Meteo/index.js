
// read weather_data.csv file
const fs = require('fs');
const csv = require('csv-parser');
const results = [];

// create new csv file with new data
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'new_weather_data.csv',
    header: [
        {id: 'region', title: 'region'},
        {id: 'day', title: 'date'},
        {id: 'TempMax_Deg', title: 'temp_max_deg'},
        {id: 'TempMin_Deg', title: 'temp_min_deg'},
        {id: 'pressure_hpa', title: 'pressure_hpa'},
        {id: 'Wind_kmh', title: 'wind_kmh'},
        {id: 'Wet_percent', title: 'wet_percent'},
        {id: 'Visibility_km', title: 'visibility_km'},
        {id: 'CloudCoverage_percent', title: 'cloud_coverage_percent'},
    ],
});

// read csv file
fs.createReadStream('weather_data.csv')
    .pipe(csv())
    .on('data', (data) => {
        // convert date to date iso
        data.day = new Date(data.day).toISOString().split('T')[0];

        // create random pressure
        data.pressure_hpa = Math.floor(Math.random() * 1000);

        // check if data is empty
        if (data.TempMax_Deg === '') {
            data.TempMax_Deg = Math.floor(Math.random() * 100);
        }
        if (data.TempMin_Deg === '') {
            data.TempMin_Deg = Math.floor(Math.random() * 100);
        }
        if (data.Wind_kmh === '') {
            data.Wind_kmh = Math.floor(Math.random() * 100);
        }
        if (data.Wet_percent === '') {
            data.Wet_percent = Math.floor(Math.random() * 100);
        }
        if (data.Visibility_km === '') {
            data.Visibility_km = Math.floor(Math.random() * 100);
        }
        if (data.CloudCoverage_percent === '') {
            data.CloudCoverage_percent = Math.floor(Math.random() * 100);
        }

        results.push(data);
    })
    .on('end', () => {
        // write result to new csv file
        csvWriter
            .writeRecords(results)
            .then(() => console.log('The CSV file was written successfully'));
    }
);