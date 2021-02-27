import {Component} from "./component";
import {Language} from "../../../../frc-visualization/src/language/language";

/**
 *
 * @class LoadingView
 * @extends Component
 */
export class LoadingView extends Component {

    /**
     * Creates a new instance of LoadingView.
     *
     * @param parent The parental component.
     */
    constructor(parent) {
        super(parent);
        this.render();
    }

    /**
     * Renders this component.
     */
    render() {
        this.container = this.parent
            .append('div')
            .classed('loading-container', true);

        this.card = this.container
            .append('div')
            .classed('loading-card', true)
            .text(Language.translate('Loading...'));
    }

    /**
     * Presents this component.
     */
    show() {
        this.container.style('display', 'block');
    }

    /**
     * Hides this component.
     */
    hide() {
        this.container.style('display', 'none');
    }

    /**
     * Removes this component.
     */
    remove() {
        this.container.remove();
    }
}
