import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle, Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import data from "./data.json"
import { fromLonLat, get } from "ol/proj"
import { transform } from 'ol/proj';



function getFeaturesFromData() {
    const features = data.slice(1, 2).map((d) => {
        return {
            "type": "Feature",
            "properties": { radius: parseFloat(d.DTW) * 2, wellDepth: parseFloat(d.DTW) * 2 },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    parseFloat(d.Lattitude),
                    parseFloat(d.Longitude),
                ]
            }
        }
    });

    console.log(features);
    return features;
}

function addRandomFeature() {
    data.forEach((el) => {
        var x = el.Longitude
        var y = el.Lattitude

        var iconFeature = new Feature({
            geometry: new Point(transform([x, y], 'EPSG:4326', 'EPSG:3857')),
            name: 'Marker ',

        });
        vectorSource.addFeature(iconFeature);
    })
}
const geojsonObj = {
    "type": "FeatureCollection",
    "features": []
}

var vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geojsonObj)
});

data.forEach((el) => {
    var x = el.Longitude
    var y = el.Lattitude

    var iconFeature = new Feature({
        geometry: new Point(transform([x, y], 'EPSG:4326', 'EPSG:3857')),
        name: 'Marker ',
        "properties": { DTW: parseFloat(el.DTW) * 2, wellDepth: parseFloat(el.Well_depth) }

    });
    vectorSource.addFeature(iconFeature);
})


function getStyle(feature) {
    return new Style({
        image: new CircleStyle({
            radius: feature.get("properties").DTW,
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.3)'
            }),
            stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.3)', width: 1 })
        })
    });
}



var vectorLayerForDTW = new VectorLayer({
    source: vectorSource,
    style: getStyle
});
var vectorLayerForWllDepth = new VectorLayer({
    source: vectorSource,
    style: getStyle
});

document.getElementById("button").onclick = () => {
    map.removeLayer(vectorLayerForDTW);
    map.addLayer(vectorLayerForDTW);
}

document.getElementById("button").onclick = () => {
    map.removeLayer(vectorLayerForWllDepth);
    map.addLayer(vectorLayerForWllDepth);
}


var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
    ],
    target: 'map',
    view: new View({
        center: fromLonLat([34.84, 36.85]),
        zoom: 11
    })
});