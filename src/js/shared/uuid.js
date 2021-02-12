export function createUUID() {
    let index = 0;
    let usedIDs;
    usedIDs = [];
    function generate() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    let uuid = generate();
    while (usedIDs.indexOf(uuid) >= 0) {
        uuid = generate();
    }
    return "id-" + uuid;
}
