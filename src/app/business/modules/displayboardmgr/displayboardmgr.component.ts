import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-mgr',
    templateUrl: './displayboardmgr.component.html' 
})
export class DisplayboardMgrComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Displayboard'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    breadcrumb_moreoptions = { 
        'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]};
    domain;
    constructor (private router: Router,
        private routerobj: Router,
        private shared_functions: SharedFunctions) {
    }

    ngOnInit () {
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
    }
    gotoCustomfields() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'labels']);
    }
    gotoDisplayboards() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'list']);
    }
    gotoLayout() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'layout']);
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/displayboard->' + mod]);
      }
      performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/help']);
        }
    }
}
