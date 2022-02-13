import * as d3 from "d3";
import { ltv_debug } from "./config";

export class Events {
    static disp = d3.dispatch(
        "filter",
        "data",
        "map-selection-will-change",
        "map-selection-did-change"
    );

    static on(name, callback) {
        ltv_debug("Events on", name);
        this.disp.on(name, callback);
    }

    static call(name, sender, ...params) {
        ltv_debug("Events on", name);
        this.disp.call(name, this, sender, ...params);
    }
}

Events.shared = new Events();
