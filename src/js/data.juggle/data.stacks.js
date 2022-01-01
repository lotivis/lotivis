import { extractStacksFromDatasets } from "./data.extract";
import * as d3 from "d3";

/**
 *
 * @param datasets
 * @param dateToItemsRelation
 * @returns {*[]}
 */
export function createBarStackModel(controller, datasets, dateToItemsRelation) {
  let listOfStacks = extractStacksFromDatasets(datasets);

  console.log("listOfStacks", listOfStacks);
  console.log("dateToItemsRelation", dateToItemsRelation);

  return listOfStacks.map(function (stackName) {
    let datasetsForStack = datasets.filter(function (dataset) {
      return dataset.stack === stackName || dataset.label === stackName;
    });

    let candidatesNames = datasetsForStack.map(
      (stackCandidate) => stackCandidate.label
    );
    let candidatesColors = datasetsForStack.map((stackCandidate) =>
      controller.getColorForDataset(stackCandidate.label)
    );

    console.log("candidatesNames", candidatesNames);

    let d3Stack = d3
      .stack()
      .keys(candidatesNames)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    let series = d3Stack(dateToItemsRelation);

    console.log("d3Stack", typeof series);
    console.log("d3Stack", Array.isArray(series));
    console.log("d3Stack", series.length);

    // d3Stack.forEach((entry) => {
    //   entry.forEach((item, index) => {
    //     // item.date = dateToItemsRelation[index].date;
    //     console.log("item", index, item);
    //   });
    // });

    let model = {
      series: series,
      label: stackName,
      stack: stackName,
      colors: candidatesColors,
    };

    return model;
  });
}
