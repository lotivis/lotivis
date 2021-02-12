import {Language} from "../language/language";

export class Option {

    constructor(id, title) {
        this.id = id;
        this.title = title || id;
    }

    get translatedTitle() {
        return Language.translate(this.title);
    }
}
