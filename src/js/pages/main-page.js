import {Page} from './page';
import {Language} from "../language/language";

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
        this.renderCard();
        this.renderMenuItems();
        this.hideBackButton();
        this.fetchServerInfo();

        this.updateFooterURL();
        this.updateFooterDebugInfo();
    }

    /**
     *
     */
    renderLeftTitleComponent() {

        this.titleContainer = this.row
            .append('div')
            .classed('col-lg-3', true);

        this.titleLabel = this.titleContainer
            .append('h1')
            .text(Language.translate('French Rap Corpus Visualization'));

        this.titleInfoBox = this.titleContainer
            .append('div')
            .classed('info-box', true);

        this.versionLabel = this.titleInfoBox
            // .append('p')
            // .classed('margin-bottom margin-top', true)
            .append('samp')
            .text(Language.translate('Version') + ': ')
            .append('samp')
            .attr('id', 'version-label')
            .text('-');

        this.environmentLabel = this.titleInfoBox
            // .append('p')
            // .classed('margin-bottom margin-top', true)
            .append('samp')
            .text(Language.translate('Server') + ': ')
            .append('samp')
            .attr('id', 'environment-label')
            .text('-');

    }

    renderCard() {
        this.menuCard = this.row
            .append('div')
            .classed('col-6', true)
            .append('div')
            .classed('card card-inset menu', true);
    }

    renderMenuItems() {
        let application = this.application;
        let pages = [
            ['search', Language.translate('Search')],
            ['diachronic-data', Language.translate('Diachronic Data')],
            ['diatopic-data', Language.translate('Diatopic Data')],
            ['corpus-data', Language.translate('Corpus Data')],
            ['artists-data', Language.translate('Artists Data')]
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

    fetchServerInfo() {
        let thisReference = this;
        fetch("info")
            .then(response => response.json())
            .then(function (json) {
                thisReference.versionLabel
                    .text(json.application_version);
                thisReference.environmentLabel
                    .text(json.environment);
            });
    }
}
