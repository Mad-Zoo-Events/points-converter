const yaml = require('js-yaml');
const fs = require('fs');

const pointsYaml = yaml.load(fs.readFileSync('points.yaml', 'utf8'));
const pointsObjKeys = Object.keys(pointsYaml.points);
const pointsObjValues = Object.values(pointsYaml.points);

const points = [];

pointsObjKeys.forEach((k, i) => {
    const {x, y, z} = pointsObjValues[i].vector;
    points.push({
        id: `point${k}`,
        type: "poi",
        map: "stage",
        position: {
            x,
            y,
            z
        },
        minDistance: 0.0,
        maxDistance: 100000.0,
        label: `Point ${k}`,
        newTab: true,
        icon: "assets/poi.svg",
        iconAnchor: {
            "x": 25,
            "y": 45
        }
    });
});

const result = {
    markerSets: [
        {
            id: "markers",
            label: "Markers",
            toggleable: true,
            defaultHide: false,
            marker: points
        }
    ]
};

console.log(JSON.stringify(result));
