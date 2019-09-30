import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    breadcrumbs = [
        {
            title: 'Dashboard'
        }
    ];

    constructor(private router: Router) {

    }

    gotoCheckins() {
        this.router.navigate(['provider', 'dashboard', 'check-ins']);
    }
}
