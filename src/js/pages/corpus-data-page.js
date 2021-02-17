import {Page} from './page';
import {Language} from "../language/language";

/**
 *
 */
export class CorpusDataPage extends Page {
  constructor(application) {
    super(application, Language.translate('Corpus Metadata'));
    // this.buildSubpage();
    this.createLeftPanel();
    this.createCard();
    this.loadCorpusIfNeeded();
  }

  willLoadCorpus() {
    super.willLoadCorpus();
    this.loadingView = this.addLoadingView(this.cardBody);
  }

  didLoadCorpus() {
    super.didLoadCorpus();
    this.loadingView.remove();
    this.update();
  }

  createLeftPanel() {
    this.leftPanel = this.addContainer(this.row, 'col-lg-3');
    this.titleLabel = this.leftPanel
      .append('h1')
      .text(this.title);
  }

  createCard() {
    this.wrapper = this.addContainer(this.row, 'col-lg-6 col-12');
    this.card = this.addContainer(this.wrapper, 'card card-corpus-metadata');
    this.cardBody = this.addContainer(this.card, 'card-body');
    this.cardBodyRow = this.addRow(this.cardBody);
  }

  update() {
    this.clearContent();
    let corpus = this.application.corpus;
    this.currentGroup = this.createGroup();
    this.createLine('# Artists', corpus.artists.length);
    this.createLine('# Female Artists', corpus.femaleArtists().length);
    this.createLine('# Male Artists', corpus.maleArtists().length);
    this.createLine('# Group Artists', corpus.groupArtists().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Albums', corpus.allAlbums().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Tracks w/o Album', corpus.allTracksWithoutAlbum().length);
    this.createLine('# Tracks', corpus.allTracks().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Words', corpus.allWords().length);
  }

  createGroup() {
    return this.addContainer(this.cardBodyRow, 'group');
  }

  createLine(title, value) {
    let row = this.currentGroup
      .append('div')
      .classed('row text-vertical-center', true);
    row.append('div')
      .classed('col-6 text-end label', true)
      .text(appendColon(title));
    row.append('div')
      .classed('col-6', true)
      .append('samp')
      .text(value);
  }

  clearContent() {
    this.cardBody.selectAll('div').remove();
    this.cardBodyRow = this.addRow(this.cardBody);
  }
}

/**
 * Appends a colon (':') to the given string if it does not end with one.
 *
 * @param text The string to append a colon on.
 * @returns {*|string} The text ending with a colon.
 */
function appendColon(text) {
  return text.endsWith(':') ? text : text + ':';
}
