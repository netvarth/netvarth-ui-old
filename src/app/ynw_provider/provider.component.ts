import {Component} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-provider',
    templateUrl: './provider.component.html'
})

export class ProviderComponent {

    evnt;

    constructor(router: Router) {
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
    }
}
