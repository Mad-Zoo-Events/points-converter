import {readFileSync, writeFileSync, rmSync} from "fs";
import {load} from "js-yaml";
import scp from "node-scp";

const connect = async () => {
    const conf = JSON.parse(readFileSync("./conf.json"));

    const hotg1 = {
        host: conf.host,
        port: 22,
        username: "ec2-user",
        privateKey: readFileSync(conf.privateKeyPath)
    };

    return await scp(hotg1);
};

const fetchPoints = async (client) => {
    try {
        await client.downloadFile("plugins/Aurora/points.yml", "points.yml");
    } catch (e) {
        console.error(e);
    }
};

const uploadMarkers = async (client) => {
    try {
        await client.uploadFile("markers.json", "bluemap/web/data/markers.json");
    } catch (e) {
        console.error(e);
    }
};

const convertToMarkers = (pointsYaml) => {
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

    return JSON.stringify(result);
};

const main = async () => {
    const client = await connect();

    try {
        await fetchPoints(client);

        const pointsYaml = load(readFileSync("points.yml", "utf8"));
        const markersJson = convertToMarkers(pointsYaml);

        writeFileSync("markers.json", markersJson);

        await uploadMarkers(client);

        rmSync("points.yml");
        rmSync("markers.json");
    } catch (error) {
        console.error(error);
    }

    client.close();
};

main().then(() => {
    console.log("done!");
});
