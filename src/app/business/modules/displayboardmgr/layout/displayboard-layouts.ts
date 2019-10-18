import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-layouts',
    templateUrl: './displayboard-layouts.html'
})
export class DisplayboardLayoutsComponent implements OnInit {
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Layouts'
        }
    ];
    api_loading: boolean;
    layout_list: any = [];
    domain: any;

    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
        ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Layout', 'type': 'addlayout' },{ 'title': 'Learn More', 'type': 'learnmore' }]
        };
        this.getDisplayboardLayouts();
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
    }
    getDisplayboardLayouts() {
        this.api_loading = true;
        this.layout_list = [];
        this.provider_services.getBoardLayouts()
            .subscribe(
                data => {
                    console.log(data);
                    this.layout_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(action) {
        if (action === 'addlayout') {
            this.addDisplayboardLayout();
        }
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/help']);
        }
    }
    addDisplayboardLayout() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'layout', 'add']);
    }
    editDisplayboardLayout(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'list', layout.id], navigationExtras);
    }
    goDisplayboardLayoutDetails(layout) {
        this.router.navigate(['provider', 'settings', 'displayboard',
            'layout', layout.id]);
    }
    deleleDisplayboardLayout(layout) {
        this.provider_services.deleteBoardLayout(layout.id).subscribe(
            () => {
                this.getDisplayboardLayouts();
            }
        );
    }
}
