export class UrlParameters {
  static getInstance() {
    if (!UrlParameters.instance) {
      UrlParameters.instance = new UrlParameters();
    }
    return UrlParameters.instance;
  }

  getURL() {
    return new URL(window.location.href);
  }

  getBoolean(parameter, defaultValue = false) {
    let value = this.getURL().searchParams.get(parameter);
    return value ? value === "true" : defaultValue;
  }

  getString(parameter, defaultValue = "") {
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
    if (typeof document === "undefined") return;
    let urlContainer = document.getElementById("lotivis-url-container");
    if (urlContainer) urlContainer.innerText = this.getURL();
  }
}

UrlParameters.language = "language";
UrlParameters.page = "page";
UrlParameters.query = "query";
UrlParameters.searchViewMode = "search-view-mode";
UrlParameters.chartType = "chart-type";
UrlParameters.chartShowLabels = "chart-show-labels";
UrlParameters.chartCombineStacks = "combine-stacks";
UrlParameters.contentType = "content-type";
UrlParameters.valueType = "value-type";
UrlParameters.searchSensitivity = "search-sensitivity";
UrlParameters.startYear = "start-year";
UrlParameters.endYear = "end-year";
UrlParameters.showTestData = "show-samples";
