import {Card} from "./card";
import {Textarea} from "./textarea";

export class TextareaCard extends Card {
    constructor(parent) {
        super(parent);
        this.titleLabel.text('Debug');
        // this.header.style('display', 'none')
        this.textarea = new Textarea(this.content, 'Debug');
        this.textarea.element
            .attr('disabled', 'true');
        this.textarea.element
            .text('Hello');
    }
}