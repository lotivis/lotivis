import {Component} from "./component";

/**
 * @class Button
 * @extends Component
 * */
export class LanguageSelect extends Component {

    constructor(parent) {
        super(parent);
    }

    render() {
        this.element = parent
            .append('div');
    }
}