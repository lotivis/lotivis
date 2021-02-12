import {Component} from "./component";

/**
 * @class Button
 * @extends Component
 */
export class Button extends Component {

    /**
     * Creates an instance of Button.
     *
     * @constructor
     * @param {Component} parent The parental component.
     */
    constructor(parent) {
        super(parent);

        let thisRef = this;
        this.element = parent
            .append('button')
            // .classed('button', true)
            .attr('id', this.selector)
            .on('click', function (event) {
                if (!thisRef.onClick) return;
                thisRef.onClick(event);
            });
    }

    setText(text) {
        this.element.text(text);
    }

    setFontAwesomeImage(imageName) {
        this.element.html('<i class="fas fa-' + imageName + '"></i>');
    }

    onClick(event) {
        // empty
    }
}
