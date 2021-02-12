import {Popup} from "./popup";
import {Language} from "../language/language";

/**
 *
 * @class ModalPopup
 * @extends Popup
 */
export class ModalPopup extends Popup {

    /**
     *
     * @param parent
     */
    constructor(parent) {
        super(parent);
        this.modalBackground
            .classed('popup-underground', false)
            .classed('modal-underground', true);
    }

    /**
     *
     */
    render() {
        super.render();
        this.renderRow();
    }

    /**
     *
     */
    renderRow() {
        this.row = this.card.body
            .append('div')
            .classed('row', true);
        this.content = this.row
            .append('div')
            .classed('col-12 info-box-margin', true);
    }

    /**
     *
     */
    loadContent(url) {
        if (!url) return;
        console.log('url: ' + url);
        let content = this.content;
        d3.text(url)
            .then(function (text) {
                console.log(text);
                content.html(text);
            })
            .catch(function (error) {
                console.log(error);
                content.html(Language.translate(''));
            });
    }

    /**
     *
     * @returns {{width: number, height: number}}
     */
    preferredSize() {
        return {
            width: 800,
            height: 600
        };
    }
}
