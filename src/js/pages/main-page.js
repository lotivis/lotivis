import {Page} from './page';
import {Language} from "../language/language";
import {ProgressBar} from "../components/progress-bar";

/**
 * The main page of the application.
 *
 * @class MainPage
 * @extends Page
 */
export class MainPage extends Page {

  /**
   * Creates a new instance.
   *
   * @param application
   */
  constructor(application) {
    super(application, 'Main');
    if (!application) {
      throw 'No application given.';
    }
    this.application = application;
    this.element = application.element;
    this.renderLeftTitleComponent();
    this.renderMenuCard();
    this.renderMenuItems();
    this.renderProgressBar();
    this.hideBackButton();

    this.updateFooterURL();
    this.updateFooterDebugInfo();
    this.loadData();
  }

  /**
   *
   */
  renderLeftTitleComponent() {

    this.titleContainer = this.row
      .append('div')
      .classed('col-lg-3', true);

    let title = this.application.delegate.name;
    this.titleLabel = this.titleContainer
      .append('h1')
      .text(title);

    this.titleInfoBox = this.titleContainer
      .append('div')
      .classed('info-box', true);
  }

  renderMenuCard() {
    this.menuCardContainer = this.row
      .append('div')
      .classed('col-6', true);
    this.menuCard = this.menuCardContainer
      .append('div')
      .classed('card card-inset menu', true);
  }

  renderMenuItems() {
    let application = this.application;
    let pages = [
      ['search', Language.translate('Search')],
      ['diachronic-data', Language.translate('Diachronic Data')],
      ['diatopic-data', Language.translate('Diatopic Data')],
      ['corpus-data', Language.translate('Corpus Data')]
    ];

    for (let i = 0; i < pages.length; i++) {
      let pageItem = pages[i];
      let pageId = pageItem[0];
      let pageTitle = pageItem[1];
      this.addMenuButton(pageTitle, function () {
        application.showPage(pageId, true);
      });
    }
  }

  addMenuButton(name, functionToCall) {
    let link = this.menuCard
      .append('a')
      .text(name)
      .on('click', function () {
        if (!functionToCall)
          return;
        functionToCall();
      });
    this.menuCard.append('br');
    return link;
  }

  renderProgressBar() {
    this.progressBar = new ProgressBar(this.menuCardContainer);
    this.progressBar.value = 0;
  }

  loadData() {
    let delegate = this.application.delegate;
    if (delegate.rawJSON) return;
    let progressBar = this.progressBar;
    delegate.loadData(function (progress, error) {
      progressBar.value = progress;
      console.log('progress: ' + progress);
      // if (progress < 1) {
      //
      // } else {
      //
      // }
    });
  }
}
