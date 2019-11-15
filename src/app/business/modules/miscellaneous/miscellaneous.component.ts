import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous.component.html'
})
export class MiscellaneousComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Miscellaneous'
        }
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
    ) {

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }

    gotoNonworkingDays() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'holidays']);
    }
    gotoNotifications() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications']);
    }
    gotosaleschannel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'saleschannel']);
    }
    gotothemes() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'skins']);
    }
    gotoJdn() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'jdn']);
    }
    gotoLabels () {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'labels']);
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
      }
}
