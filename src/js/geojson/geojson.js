import { copy } from "../common/values.js";

/* returns a GeoJSON FeatureCollection object */
export function FeatureCollection(features) {
    return { type: "FeatureCollection", features };
}

/* returns a GeoJSON Feature object */
export function Feature(geometry, properties = {}) {
    return { type: "Feature", geometry, properties };
}

/* returns a GeoJSON Geometry object */
export function Geometry(type, coordinates) {
    return { type, coordinates };
}

/* returns a GeoJSON object */
export function GeoJSON(source) {
    let geoJSON = copy(source);

    geoJSON.getCenter = function () {
        let allCoordinates = this.extractAllCoordinates();
        let latitudeSum = 0;
        let longitudeSum = 0;

        allCoordinates.forEach(function (coordinates) {
            latitudeSum += coordinates[1];
            longitudeSum += coordinates[0];
        });

        return [
            latitudeSum / allCoordinates.length,
            longitudeSum / allCoordinates.length,
        ];
    };

    geoJSON.extractGeometryCollection = function () {
        let geometryCollection = [];
        if (this.type === "Feature") {
            geometryCollection.push(this.geometry);
        } else if (this.type === "FeatureCollection") {
            this.features.forEach((feature) =>
                geometryCollection.push(feature.geometry)
            );
        } else if (this.type === "GeometryCollection") {
            this.geometries.forEach((geometry) =>
                geometryCollection.push(geometry)
            );
        } else {
            throw new Error("The geoJSON is not valid.");
        }
        return geometryCollection;
    };

    geoJSON.extractAllCoordinates = function () {
        let geometryCollection = this.extractGeometryCollection();
        let coordinatesCollection = [];

        geometryCollection.forEach((item) => {
            let coordinates = item.coordinates;
            let type = item.type;

            if (type === "Point") {
                console.log("Point: " + coordinates.length);
                coordinatesCollection.push(coordinates);
            } else if (type === "MultiPoint") {
                console.log("MultiPoint: " + coordinates.length);
                coordinates.forEach((coordinate) =>
                    coordinatesCollection.push(coordinate)
                );
            } else if (type === "LineString") {
                console.log("LineString: " + coordinates.length);
                coordinates.forEach((coordinate) =>
                    coordinatesCollection.push(coordinate)
                );
            } else if (type === "Polygon") {
                coordinates.forEach(function (polygonCoordinates) {
                    polygonCoordinates.forEach(function (coordinate) {
                        coordinatesCollection.push(coordinate);
                    });
                });
            } else if (type === "MultiLineString") {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else if (type === "MultiPolygon") {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else {
                throw new Error("The geoJSON is not valid.");
            }
        });

        return coordinatesCollection;
    };

    return geoJSON;
}
