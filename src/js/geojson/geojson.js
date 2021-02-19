/**
 *
 */
export class GeoJson {

    constructor(source) {
        this.type = source.type;
        this.features = [];


        for (let index = 0; index < source.features.length; index++) {
            let featureSource = source.features[index];
            let feature = new Feature(featureSource);
            this.features.push(feature);
        }
    }

    getCenter() {
        let allCoordinates = this.extractAllCoordinates();
        console.log('allCoordinates.length: ' + allCoordinates.length);
        let latitudeSum = 0;
        let longitudeSum = 0;

        allCoordinates.forEach(function (coordinates) {
            latitudeSum += coordinates[1];
            longitudeSum += coordinates[0];
        });

        return [
            latitudeSum / allCoordinates.length,
            longitudeSum / allCoordinates.length
        ];
    }

    extractGeometryCollection() {
        let geometryCollection = [];
        if (this.type === 'Feature') {
            geometryCollection.push(this.geometry);
        } else if (this.type === 'FeatureCollection') {
            this.features.forEach(feature => geometryCollection.push(feature.geometry));
        } else if (this.type === 'GeometryCollection') {
            this.geometries.forEach(geometry => geometryCollection.push(geometry));
        } else {
            throw new Error('The geoJSON is not valid.');
        }
        return geometryCollection;
    }

    extractAllCoordinates() {
        let geometryCollection = this.extractGeometryCollection();
        let coordinatesCollection = [];

        geometryCollection.forEach(item => {

            let coordinates = item.coordinates;
            let type = item.type;

            if (type === 'Point') {
                console.log("Point: " + coordinates.length);
                coordinatesCollection.push(coordinates);
            } else if (type === 'MultiPoint') {
                console.log("MultiPoint: " + coordinates.length);
                coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
            } else if (type === 'LineString') {
                console.log("LineString: " + coordinates.length);
                coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
            } else if (type === 'Polygon') {
                coordinates.forEach(function (polygonCoordinates) {
                    polygonCoordinates.forEach(function (coordinate) {
                        coordinatesCollection.push(coordinate);
                    });
                });
            } else if (type === 'MultiLineString') {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else if (type === 'MultiPolygon') {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else {
                throw new Error('The geoJSON is not valid.');
            }
        });

        return coordinatesCollection;
    }
}
