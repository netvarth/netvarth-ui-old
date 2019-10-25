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
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];

    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
    ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Layout', 'type': 'addlayout' }, { 'title': 'Learn More', 'type': 'learnmore' }]
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
                    this.layout_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    showDisplayboard(layout) {
        this.router.navigate(['provider', 'settings', 'displayboard', 'layout', layout.id, 'view']);
    }
    performActions(action) {
        this.addDisplayboardLayout();
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/displayboard->layout']);
        }
    }
    addDisplayboardLayout() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'layout', 'add']);
    }
    editDisplayboardLayout(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: layout.id }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'layout', 'edit'], navigationExtras);
    }
    goDisplayboardLayoutDetails(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: layout.id }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'layout', 'view'], navigationExtras);
    }
    deleteDisplayboardLayout(layout) {
        this.provider_services.deleteBoardLayout(layout.id).subscribe(
            () => {
                this.getDisplayboardLayouts();
            }
        );
    }
    getLayout(layoutvalue) {
        let layoutActive;
        for (let i = 0; i < this.boardLayouts.length; i++) {
            if (this.boardLayouts[i].value === layoutvalue) {
                layoutActive = this.boardLayouts[i];
                break;
            }
        }
        return layoutActive;
    }
}
