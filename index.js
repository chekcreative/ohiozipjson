require('dotenv').config();

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const parseJson = require('parse-json');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.APP_CORS.split(','),
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.get('/', (req, res) => {
  fs.readFile('./oh_ohio_zip_codes_geo.min.json', async (err,data) => {
    if(err) {
      res.status(500).end();
    } else {
      try {
        const geoJsonFile = JSON.parse(data);
        const geoJsonFeatureCollection = geoJsonFile.features;
        if(req.query.zips) {
          const zips = req.query.zips.split(',');
          let returnCollection = {
            type: "FeatureCollection",
            features: []
          };
          await geoJsonFeatureCollection.forEach(geoJsonFeature => {
            if (zips.includes(geoJsonFeature.properties.ZCTA5CE10)) {
              returnCollection.features.push(geoJsonFeature);
            }
          });
          res.json(returnCollection);
        } else {
          res.json({
            type: "FeatureCollection",
            features: []
          });
        }
      } catch (err) {
        res.status(500).end();
      }
    }
  })
})

app.listen(port, () => {
  console.log(`ohiozipjson listening on port ${port}`); 
});