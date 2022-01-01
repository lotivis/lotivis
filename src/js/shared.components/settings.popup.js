import { Popup } from "./popup";
import { Button } from "./button";
import { downloadImage } from "../shared/download";
import { createDownloadFilename } from "../shared/filename";

/**
 * @class SettingsPopup
 * @extends Popup
 */
export class SettingsPopup extends Popup {
  /**
   * Creates a new instance of SettingsPopup.
   */
  constructor(parent) {
    super(parent);
  }

  /**
   * Appends the content of the settings popup.
   * @override
   */
  inject() {
    super.inject();
    this.card.setTitle("");
    this.row = this.card.content.append("div").classed("row", true);

    let container = this.row.append("div");
    this.screenshotButton = new Button(container);
    this.screenshotButton.setText("Make Screenshot");
    this.screenshotButton.element.classed("ltv-button ltv-button-block", true);
    this.screenshotButton.onClick = this.screenshotButtonAction.bind(this);
  }

  /**
   * Returns the preferred size of the popup.
   * @returns {{width: number, height: number}}
   * @override
   */
  preferredSize() {
    return { width: 240, height: 600 };
  }

  /**
   * Triggered when the screenshot button is pushed.
   *
   * Should be overridden by subclasses.
   */
  screenshotButtonAction() {
    let filename = this.chart.datasetController.getFilename() || "unknown";
    let downloadFilename = createDownloadFilename(filename, `chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}
