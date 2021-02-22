import {URLParameters} from "./shared/url-parameters";
import {Language} from "./language/language";
import {Datasource} from "./datasource/datasource";
import {TimeChartCard} from "./time-chart/time-chart-card";
import {TimeChart} from "./time-chart/time-chart";
import {MapChart} from "./map-chart/map-chart";
import {MapChartCard} from "./map-chart/map-chart-card";
import {Component} from "./components/component";

/**
 *
 * @class Application
 */
export class Application {

  /**
   * Creates a new instance in the container with the given id.
   *
   * @param selector The id of the `div` element.
   * @param delegate A data delegate which provides data for the app.
   */
  constructor(selector, delegate) {
    if (!selector) throw 'No selector specified.';
    if (!delegate) delegate = {};

    this.selector = selector;
    this.delegate = delegate;

    this.willInitialize();
    this.initialize();
    this.didInitialize();
  }


  // MARK: - Life Cycle

  willInitialize() {
    // console.clear();
  }

  initialize() {
    this.element = d3
      .select(`#${this.selector}`)
      .classed('container', true);
    window.lotivisApplication = this;

    let parameters = URLParameters.getInstance();
    let language = parameters.getString(URLParameters.language, Language.English);
    Language.setLanguage(language);
  }

  didInitialize() {
    // this.loadPage();
  }
}

class MenuItem {

}

Application.Pages = {};

exports.Component = Component;
exports.TimeChart = TimeChart;
exports.TimeChartCard = TimeChartCard;
exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;
exports.DataDelegate = Datasource;
