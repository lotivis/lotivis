import {extractStacksFromDatasets} from "../data-juggle/dataset-extract";
import {Color} from "../shared/colors";

/**
 *
 * @param datasets
 * @param dateToItemsRelation
 * @returns {*[]}
 */
export function createStackModel(datasets, dateToItemsRelation) {
  let listOfStacks = extractStacksFromDatasets(datasets);

  return listOfStacks.map(function (stackName) {

    let stackCandidates = datasets.filter(function (dataset) {
      return dataset.stack === stackName
        || dataset.label === stackName;
    });

    let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
    let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);

    let stack = d3
      .stack()
      .keys(candidatesNames)
      (dateToItemsRelation);

    stack.label = stackName;
    stack.stack = stackName;
    stack.colors = candidatesColors;

    return stack;
  });
}

/**
 *
 */
export function calculateColors(datasetController) {
  let stacks = datasetController.stacks;

  for (let index = 0; index < stacks.length; index++) {

    let stackName = stacks[index];
    let datasets = datasetController.workingDatasets.filter(function (dataset) {
      return dataset.stack === stackName
        || dataset.label === stackName;
    });

    let numberOfDatasets = datasets.length;
    let colors = Color.colorsForStack(index, numberOfDatasets);

    for (let index = 0; index < colors.length; index++) {
      datasets[index].color = colors[index];
    }
  }

  for (let index = 0; index < stacks.length; index++) {

    let stackName = stacks[index];
    let datasets = datasetController.enabledDatasets.filter(function (dataset) {
      return dataset.stack === stackName
        || dataset.label === stackName;
    });

    let numberOfDatasets = datasets.length;
    let colors = Color.colorsForStack(index, numberOfDatasets);

    for (let index = 0; index < colors.length; index++) {
      datasets[index].color = colors[index];
    }
  }
}
