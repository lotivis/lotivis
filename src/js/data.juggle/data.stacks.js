import { extractStacksFromDatasets } from "./data.extract";
import * as d3 from "d3";

/**
 *
 * @param datasets
 * @param dateToItemsRelation
 * @returns {*[]}
 */
export function createStackModel(controller, datasets, dateToItemsRelation) {
  let listOfStacks = extractStacksFromDatasets(datasets);

  return listOfStacks.map(function(stackName) {
    let stackCandidates = datasets.filter(function(dataset) {
      return dataset.stack === stackName || dataset.label === stackName;
    });

    let candidatesNames = stackCandidates.map(
      stackCandidate => stackCandidate.label
    );
    let candidatesColors = stackCandidates.map(stackCandidate =>
      controller.getColorForDataset(stackCandidate.label)
    );

    let stack = d3.stack().keys(candidatesNames)(dateToItemsRelation);

    stack.label = stackName;
    stack.stack = stackName;
    stack.colors = candidatesColors;

    return stack;
  });
}
