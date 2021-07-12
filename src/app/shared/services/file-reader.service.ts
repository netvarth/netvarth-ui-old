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

    getLocationJson () {
        return this.servicemeta.getJSON('http://localhost:4200/assets/json/locations.json');
    }

    getMetrosJson() {
        return this.servicemeta.getJSON('http://localhost:4200/assets/json/metros_capital.json');
    }

}