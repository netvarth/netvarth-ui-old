import { Injectable } from "@angular/core";
import { DateTimeProcessor } from "./datetime-processor.service";
import { LocalStorageService } from "./local-storage.service";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})

/**
 * Class which handle domain configuration
 */
export class DomainConfigGenerator {
    DOMAINLIST_APIFETCH_HOURS = 1; //

    constructor(
        private lStorageService: LocalStorageService,
        private dateTimeService: DateTimeProcessor,
        private servicemeta: ServiceMeta
    ) { }

    /**
     * @returns the latest domain cofiguration
     */
    getDomainList() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const bconfig = _this.lStorageService.getitemfromLocalStorage('ynw-bconf');
            let run_api = true;
            if (bconfig && bconfig.cdate && bconfig.bdata) { // case if data is there in local storage
                const bdate = bconfig.cdate;
                // const bdata = bconfig.bdata;
                const saveddate = new Date(bdate);
                if (bconfig.bdata) {
                    const diff = _this.dateTimeService.getdaysdifffromDates('now', saveddate);
                    if (diff['hours'] < _this.DOMAINLIST_APIFETCH_HOURS) {
                        run_api = false;
                        resolve(bconfig);
                    }
                }
            }
            if (run_api) { // case if data is not there in data
                _this.bussinessDomains()
                    .subscribe(
                        res => {
                            // this.domainList = res;
                            const today = new Date();
                            const postdata = {
                                cdate: today,
                                bdata: res
                            };
                            _this.lStorageService.setitemonLocalStorage('ynw-bconf', postdata);
                            resolve(postdata);
                        }
                    ); 
            }
        });
    }

    /**
     * Api call to fetch business domain configuration
     */
    bussinessDomains() {
        const path = 'ynwConf/businessDomains';
        return this.servicemeta.httpGet(path);
    }
}
