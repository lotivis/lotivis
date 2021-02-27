import {URLParameters} from "./shared/url-parameters";
import {Language} from "../../../frc-visualization/src/language/language";

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
