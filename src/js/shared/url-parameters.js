/**
 *
 * @class URLParameters
 */
export class URLParameters {

  /**
   * Returns the singleton instance.
   *
   * @returns {URLParameters}
   */
  static getInstance() {
    if (!URLParameters.instance) {
      URLParameters.instance = new URLParameters();
    }
    return URLParameters.instance;
  }

  /**
   * Return the current window URL.
   * @returns {URL}
   */
  getURL() {
    return new URL(window.location.href);
  }

  getBoolean(parameter, defaultValue = false) {
    let value = this.getURL().searchParams.get(parameter);
    return value ? value === 'true' : defaultValue;
  }

  getString(parameter, defaultValue = '') {
    return this.getURL().searchParams.get(parameter) || defaultValue;
  }

  set(parameter, newValue) {
    const url = this.getURL();

    if (newValue === false) {
      url.searchParams.delete(parameter);
    } else {
      url.searchParams.set(parameter, newValue);
    }

    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }

  setWithoutDeleting(parameter, newValue) {
    const url = this.getURL();
    url.searchParams.set(parameter, newValue);
    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }

  clear() {
    const url = this.getURL();
    const newPath = url.protocol + url.host;
    const newURL = new URL(newPath);
    window.history.replaceState(null, null, newURL);
    this.updateCurrentPageFooter();
  }

  updateCurrentPageFooter() {
    // console.log('window.lotivisApplication: ' + window.lotivisApplication);
    // window.lotivisApplication.currentPage.updateFooter();
  }
}

URLParameters.language = 'language';
URLParameters.page = 'page';
URLParameters.query = 'query';
URLParameters.searchViewMode = 'search-view-mode';
URLParameters.chartType = 'chart-type';
URLParameters.chartShowLabels = 'chart-show-labels';
URLParameters.chartCombineStacks = 'chart-datasetCombine-stacks';
URLParameters.contentType = 'content-type';
URLParameters.valueType = 'value-type';
URLParameters.searchSensitivity = 'search-sensitivity';
URLParameters.startYear = 'start-year';
URLParameters.endYear = 'end-year';

URLParameters.showTestData = 'show-test-data';
