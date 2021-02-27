/**
 *
 * @class Option
 */
export class Option {

    constructor(id, title) {
        this.id = id;
        this.title = title || id;
    }

    get translatedTitle() {
        return this.title
    }
}
