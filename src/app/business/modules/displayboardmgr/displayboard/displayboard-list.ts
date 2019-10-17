import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-list',
    templateUrl: './displayboard-list.html'
})
export class DisplayboardListComponent implements OnInit {
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
            title: 'Displayboards'
        }
    ];
    api_loading: boolean;
    board_list: any = [];

    constructor(
        private router: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
        ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Displayboard', 'type': 'addstatusboard' }]
        };
        this.getDisplayboards();
    }
    getDisplayboards() {
        this.api_loading = true;
        this.board_list = [];
        this.provider_services.getDisplayboards()
            .subscribe(
                data => {
                    console.log(data);
                    this.board_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(action) {
        if (action === 'addstatusboard') {
            this.addDisplayboard();
        }
    }
    addDisplayboard() {
        this.router.navigate(['provider', 'settings', 'displayboard', 'list', 'add']);
    }
    editDisplayboard(board) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'list', board.id], navigationExtras);
    }
    goDisplayboardDetails(board) {
        this.router.navigate(['provider', 'settings', 'displayboard',
            'labels', board.id]);
    }
    deleleDisplayboard(board) {
        this.provider_services.deleteDisplayboard(board.id).subscribe(
            () => {
                this.getDisplayboards();
            }
        );
    }
}
