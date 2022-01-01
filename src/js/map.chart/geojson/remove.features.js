/**
 *
 * @param geoJSON
 * @param removeCandidates
 * @returns {*}
 */
export function removeFeatures(geoJSON, removeCandidates) {
  if (!Array.isArray(removeCandidates)) return geoJSON;
  let newGeoJSON = geoJSON;
  for (let index = 0; index < removeCandidates.length; index++) {
    let code = removeCandidates[index];
    let candidate = newGeoJSON.features.find(
      feature => feature.properties.code === code
    );
    if (!candidate) continue;
    let candidateIndex = newGeoJSON.features.indexOf(candidate);
    if (candidateIndex < 0) continue;
    newGeoJSON.features.splice(candidateIndex, 1);
  }
  return newGeoJSON;
}
