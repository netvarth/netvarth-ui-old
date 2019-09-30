import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    breadcrumbs = this.breadcrumbs_init;

    constructor(
        private router: Router
    ) {

    }
    ngOnInit() {

    }

    gotoNonworkingDays() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'holidays']);
    }
    gotoNotifications() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications']);
    }
}
