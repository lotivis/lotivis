import {Button} from '../components/button';
import {URLParameters} from "../shared/url-parameters";
import {Language} from "../language/language";
import {RadioGroup} from "../components/radio-group";
import {Application} from "../application";
import {ModalPopup} from "../components/modal-popup";

export class Page {

  constructor(application, title = 'Unknown') {
    if (!application) {
      throw 'No application given.';
    }
    this.title = title || 'Unknown';
    this.application = application;
    this.element = application.element;
    this.renderHeader();
    this.renderBody();
    this.renderFooter();
    application.makeContainerNormal();
    document.title = 'FRC-Visualization - ' + this.title;
  }


  // MARK: - Add Components

  buildSubpage() {
    this.titleLabel = this.centerHeaderContainer.append('h1')
      .text(this.title);
  }

  addRow(toParent = this.element) {
    return this.addContainer(toParent, 'row');
  }

  addContainer(toParent = this.element, classes = '') {
    let parent = toParent || this.element;
    return parent
      .append('div')
      .classed(classes, true);
  }


  setTitle(newTitle) {
    this.title = newTitle;
    this.titleLabel.text(newTitle);
  }

  addSpace(toParent = this.element, width) {
    toParent
      .append('label')
      .style('width', width + 'px');
    return this;
  }

  // MARK: - Header

  renderHeader() {
    this.headerRow = this.addRow(this.element)
      .classed('row margin-bottom', true);
    this.leftHeaderContainer = this.headerRow
      .append('div')
      .classed('col-3', true);
    this.centerHeaderContainer = this.headerRow
      .append('div')
      .classed('col-6 text-center', true);
    this.rightHeaderContainer = this.headerRow
      .append('div')
      .classed('col-3 text-end button-group', true);
    this.backButton = this.addBackButton(this.leftHeaderContainer);
  }

  // MARK: - Body

  renderBody() {
    this.row = this.addRow(this.element);
  }

  // MARK: - Footer

  renderFooterRow() {
    this.footerRow = this.addRow(this.element)
      .classed('footer', true);
  }

  renderFooterLinks() {
    this.footerLinksContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);

    this.footerLinksContainer
      .append('a')
      .text(Language.translate('Impress'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/impress-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));

    this.footerLinksContainer
      .append('a')
      .text(Language.translate('Privacy Policy'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/privacy-policy-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));

    this.footerLinksContainer
      .append('a')
      .text(Language.translate('About the Project'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/about-project-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));
  }

  presentModalPopup(contentURL) {
    let parent = window.frcvApp.element;
    let impressPopup = new ModalPopup(parent);
    impressPopup.loadContent(contentURL);
    impressPopup.showBigModal();
  }

  renderFooterURL() {

    this.footerURLContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);

    this.footerURLContainer.append('br');

    this.footerTooltipContainer = this.footerURLContainer
      .append('div')
      .classed('tooltip', true);

    this.footerURLLabel = this.footerTooltipContainer
      .append('a')
      .append('samp')
      .on('click', this.copyLocationToClipboard);

    let text = Language.translate('Click on URL to copy it to clipboard');
    this.footerURLLabelTooltip = this.footerTooltipContainer
      .append('span')
      .classed('tooltiptext', true)
      .text(text);
  }

  copyLocationToClipboard() {
    let urlPath = window.location.href;
    navigator.clipboard.writeText(urlPath).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  renderFooterCorpusInfo() {
    this.footerCorpusInfoContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);

    this.footerDebugLabel = this.footerCorpusInfoContainer
      .append('samp');

    this.updateFooterDebugInfo();
  }

  renderFooterLanguageInfo() {
    this.footerLanguageInfoContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);

    this.footerLanguageLabel = this.footerLanguageInfoContainer
      .append('samp');

    this.footerLanguageRadioGroup = new RadioGroup(
      this.footerLanguageInfoContainer
    );

    this.footerLanguageRadioGroup.setOptions([
      [Language.English, 'English'],
      [Language.German, 'German'],
      [Language.French, 'French'],
    ]);

    this.footerLanguageRadioGroup.onChange = function (value) {
      Language.setLanguage(value);
      URLParameters.getInstance().set(URLParameters.language, value);
      Application.default.reloadPage();
    };

    this.footerLanguageRadioGroup.setSelectedOption(
      Language.language
    );

    // this.updateFooterLanguageInfo();
  }

  renderFooter() {
    this.renderFooterRow();
    this.renderFooterLinks();
    this.renderFooterURL();
    this.renderFooterCorpusInfo();
    this.renderFooterLanguageInfo();
  }

  // MARK: Update Footer

  updateFooter() {
    this.updateFooterURL();
    this.updateFooterDebugInfo();
    // this.updateFooterLanguageInfo();
  }

  updateFooterURL() {
    let url = URLParameters.getInstance().getURL();
    this.footerURLLabel.text(url);
  }

  updateFooterDebugInfo() {
    let label = Language.translate('Corpus loaded status');
    let isCorpusLoaded = this.application.isCorpusLoaded();
    let valueTranslated = Language.translate('' + isCorpusLoaded);
    this.footerDebugLabel.text(`${label}: ${valueTranslated}`);
  }

  // updateFooterLanguageInfo() {
  //     let label = Language.translate('Language');
  //     let translatedGreeting = Language.language;
  //     let text = `${label}: ${translatedGreeting}`;
  //     this.footerLanguageLabel.text(text);
  // }


  // MARK: - Loading View

  addLoadingView(toParent = this.element) {
    toParent.loadingView = toParent
      .append('div')
      .classed('loading-container', true);

    toParent.loadingView
      .append('div')
      .classed('loading-card', true)
      .text(Language.translate('Loading...'));

    return toParent.loadingView;
  }

  showLoadingView() {
    this.loadingView = this.addLoadingView(this.element);
  }

  hideLoadingView() {
    if (!this.loadingView) return;
    this.loadingView.remove();
  }

  // MARK: - Back Button

  addBackButton(toParent = this.element) {
    let button = new Button(toParent);
    button.element.classed('back-button', true);
    button.setText(Language.translate('Back'));
    let applicationReference = this.application;
    button.onClick = function () {
      applicationReference.showPage('main', true);
    };
    return button;
  }

  showBackButton() {
    this.backButton.element.style('visibility', 'visible');
  }

  hideBackButton() {
    this.backButton.element.style('visibility', 'hidden');
  }

  // MARK: - Load Corpus

  loadCorpusIfNeeded() {
    this.willLoadCorpus();
    if (this.application.isCorpusLoaded()) {
      this.didLoadCorpus();
    } else {
      let ref = this;
      this.application.loadCorpus(function () {
        ref.didLoadCorpus();
      });
    }
  }

  willLoadCorpus() {

  }

  didLoadCorpus() {
    this.updateFooterURL();
    this.updateFooterDebugInfo();
  }
}
