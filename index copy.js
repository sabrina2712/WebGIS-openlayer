import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import data from "./data.json"
import { fromLonLat, get } from "ol/proj"
import { transform } from 'ol/proj';



function getFeaturesFromData() {
    const features = data.slice(0, 1).map((d) => {
        return {
            "type": "Feature",
            "properties": { radius: parseFloat(d.DTW) * 2 },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    parseFloat(d.Longitude),
                    parseFloat(d.Lattitude),
                ]
            }
        }
    });

    console.log(features);
    return features;
}
const geojsonObj = {
    "type": "FeatureCollection",
    "features": getFeaturesFromData()
}

var vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geojsonObj)
});


function getStyle(feature) {
    return new Style({
        image: new CircleStyle({
            radius: feature.get("radius"),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            }),
            stroke: new Stroke({ color: 'red', width: 2 })
        })
    });
}



var vectorLayer = new VectorLayer({
    source: vectorSource,
    style: getStyle
});

var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer
    ],
    target: 'map',
    view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
    })
});