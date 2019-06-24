import {Component} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProviderServices } from './services/provider-services.service';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { CommonDataStorageService } from '../shared/services/common-datastorage.service';

@Component({
    selector: 'app-provider',
    templateUrl: './provider.component.html'
})

export class ProviderComponent {

    evnt;
    outerscroller = false;
    constructor(router: Router,
    public route: ActivatedRoute,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public provider_datastorage: CommonDataStorageService) {
        // alert('here');
        this.evnt = router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {

                const match_url = '\/provider\/settings';
               // if (router.url === '\/provider\/settings' ||
                // router.url === '\/provider' ||
                if (router.url === '\/provider\/waitlist-manager' ||
                router.url === '\/provider\/license' ) {
                     router.navigate(['provider', 'settings', 'bprofile-search']);
                }
            }
          });

          this.route.data.subscribe((data) => {
            if (data.terminologies) {
              this.provider_datastorage.set('terminologies', data.terminologies);
            }

          });

          this.shared_functions.sendMessage({ttype: 'main_loading', action: false});

    }
        handleScrollhide(ev) {
        this.outerscroller = ev;
    }
}
