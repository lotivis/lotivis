import {createUUID} from "../shared/uuid";

/**
 *
 * @class Component
 */
export class Component {

    /**
     *
     * @param parent
     */
    constructor(parent) {
        if (!parent) {
            throw 'No parent specified.';
        }
        this.selector = createUUID();
        this.parent = parent;
    }

    show() {
        if (!this.element) return;
        this.element.style('display', 'inline-block');
    }

    hide() {
        if (!this.element) return;
        this.element.style('display', 'none');
    }

    get isVisible() {
        if (!this.element) return false;
        return this.element.style('display') !== 'none';
    }
}
