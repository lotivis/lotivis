import {SearchPage} from './pages/search-page';
import {CorpusDataPage} from './pages/corpus-data-page';
import {MainPage} from "./pages/main-page";
import {DiachronicAboutPage} from "./pages/diachronic-about-page";
import {ArtistsDataPage} from "./pages/artists-data-page";
import {Corpus} from "./corpus-model/corpus";
import {URLParameters} from "./shared/url-parameters";
import {Language} from "./language/language";
import {DiatopicDataPage} from "./pages/diatopic-data-page";

/**
 *
 */
export class Application {
    /**
     * Creates a new instance in the container with the given id.
     */
    constructor(selector) {
        if (!selector) throw 'No selector specified.';
        this.selector = selector;
        this.willInitialize();
        this.initialize();
        this.didInitialize();
        Application.default = this;
    }

    // MARK: - Life Cycle

    willInitialize() {
        // console.clear();
    }

    initialize() {
        this.element = d3
            .select(`#${this.selector}`)
            .classed('container', true);
        window.frcvApp = this;
        window.frcvConfig = {};

        let parameters = URLParameters.getInstance();
        let language = parameters.getString(URLParameters.language, Language.English);
        Language.setLanguage(language);
    }

    didInitialize() {
        this.loadPage();
    }

    // MARK: - Load Page

    clearContainer() {
        document.getElementById(this.selector).innerHTML = '';
    }

    loadPage() {
        let page = URLParameters.getInstance().getString(URLParameters.page, 'main');
        this.showPage(page, false);
    }

    showPage(selector, updateHistory = false) {
        this.clearContainer();
        if (updateHistory) {
            URLParameters.getInstance().clear();
            URLParameters.getInstance().set(URLParameters.page, selector);
            URLParameters.getInstance().set(URLParameters.language, Language.language);
        }

        this.currentPageSelector = selector;

        switch (selector) {
            case 'search':
                this.currentPage = new SearchPage(this);
                break;
            case 'about':
                this.currentPage = new AboutPage(this);
                break;
            case 'corpus-data':
                this.currentPage = new CorpusDataPage(this);
                break;
            case 'artists-data':
                this.currentPage = new ArtistsDataPage(this);
                break;
            case 'diachronic-data':
                this.currentPage = new DiachronicAboutPage(this);
                break;
            case 'diatopic-data':
                this.currentPage = new DiatopicDataPage(this);
                break;
            default:
                this.currentPage = new MainPage(this);
                this.currentPageSelector = 'main';
                break;
        }
    }

    reloadPage() {
        this.showPage(this.currentPageSelector);
    }

    makeFluit() {
        this.element.classed('container-fluit', true);
        this.element.classed('container', false);
    }

    makeUnfluit() {
        this.element.classed('container-fluit', false);
        this.element.classed('container', true);
    }

    // Corpus

    isCorpusLoaded() {
        return this.corpus !== undefined;
    }

    loadCorpus(completion) {
        let thisReference = this;
        this.isLoading = true;
        let url = "../../corpus/original";
        d3.json(url)
            .then(function (json) {
                thisReference.corpus = new Corpus(json);
                thisReference.isLoading = false;
                thisReference.fetchDepartements(completion);
            });
    }

    fetchDepartements(completion) {
        let thisReference = this;
        this.isFetchingDepartements = true;
        fetch("../../departements")
            .then(response => response.json())
            .then(function (json) {
                thisReference.departements = json;
                thisReference.corpus.departements = json;
                thisReference.isFetchingDepartements = false;
                if (completion) {
                    completion();
                }
            });
    }

    getDepartementForNumber(departementNumber) {
        for (let i = 0; i < this.departements.length; i++) {
            const departement = this.departements[i];
            if (departementNumber === departement.deptCode) {
                return departement;
            }
        }
        return null;
    }

    makeContainerNormal() {
        this.element.classed('container-full', false);
        this.element.classed('container', true);
    }

    makeContainerFull() {
        this.element.classed('container', false);
        this.element.classed('container-full', true);
    }
}

class MenuItem {

}

Application.Pages = {

};
