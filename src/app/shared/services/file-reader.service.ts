import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable()
export class FileReaderService {

    locations:any;
    metroCapitals:any;

    constructor(private servicemeta: ServiceMeta) {}

    setMetros(metros) {
        this.metroCapitals = metros
    }
    setLocations (locations) {
        this.locations = locations;
    }

    getMetros() {
        return this.metroCapitals;
    }
    getLocations () {
        return this.locations;
    }

    getLocationJson (path) {
        let url = path + 'assets/json/locations.json';
        return this.servicemeta.getJSON(url);
    }

    getMetrosJson(path) {
        let url = path + 'assets/json/metros_capital.json';
        return this.servicemeta.getJSON(url);
    }

}