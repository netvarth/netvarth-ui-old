import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous',
        },
        {
            title: 'Notifications'
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
    gotoConsumer() {
        this.router.navigate(['provider', 'settings', 'miscellaneous',  'notifications', 'consumer']);
    }
    gotoProvider() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications', 'provider']);
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
      }
}
