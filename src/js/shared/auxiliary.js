/**
 *
 * @param arrayOfArrays
 * @returns {[]}
 */
export function flatArrayOfArrays(arrayOfArrays) {
    let flattenList = [];
    for (let index = 0; index < arrayOfArrays.length; index++) {
        let currentArray = arrayOfArrays[index];
        for (let index = 0; index < currentArray.length; index++) {
            let currentItem = currentArray[index];
            flattenList.push(currentItem);
        }
    }
    return flattenList;
}

/**
 *
 * @param datasets
 * @returns {[]}
 */
export function flattenDatasets(datasets) {
    let flattenList = [];
    for (let index = 0; index < datasets.length; index++) {
        let dataset = datasets[index];
        let dataCollection = dataset.data;
        dataCollection.forEach(item => {
            item.dataset = dataset.dlabel;
            item.stack = dataset.stack;
            flattenList.push(item)
        });
    }
    return flattenList;
}

export function combine(flattenList) {
    let combined = [];
    for (let index = 0; index < flattenList.length; index++) {
        let listItem = flattenList[index];
        let entry = combined.find(function (entryItem) {
            return entryItem.stack === listItem.stack
                && entryItem.dlabel === listItem.dlabel;
        });
        if (entry) {
            entry.value += listItem.value;
        } else {
            combined.push({
                dlabel: listItem.dlabel,
                stack: listItem.stack,
                value: listItem.value
            });
        }
    }
    return combined;
}

export function combineDataByLabel(flattenList) {
    let combined = [];
    for (let index = 0; index < flattenList.length; index++) {
        let listItem = flattenList[index];
        let entry = combined.find(function (entryItem) {
            return entryItem.dlabel === listItem.dlabel;
        });
        if (entry) {
            entry.value += listItem.value;
        } else {
            combined.push({
                dlabel: listItem.dlabel,
                stack: listItem.stack,
                value: listItem.value
            });
        }
    }
    return combined;
}
