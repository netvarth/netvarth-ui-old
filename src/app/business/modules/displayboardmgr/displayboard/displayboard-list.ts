import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';

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
    domain: any;
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
    ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]
        };
        this.getDisplayboards();
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
    }
    getDisplayboards() {
        this.api_loading = true;
        this.board_list = [];
        this.provider_services.getDisplayboards()
            .subscribe(
                data => {
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
        // if (action === 'addstatusboard') {
        //     console.log(action);
        //     this.addDisplayboard();
        // }
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/displayboard->board']);
        }
    }
    addDisplayboard() {
        this.router.navigate(['provider', 'settings', 'displayboard',
            'list', 'add']);
    }
    editDisplayboard(board) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: board.id }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'list', 'edit'], navigationExtras);
    }
    goDisplayboardDetails(board) {
        // this.router.navigate(['provider', 'settings', 'displayboard',
        //     'labels', board.id]);
        const navigationExtras: NavigationExtras = {
            queryParams: { id: board.id }
        };
        this.router.navigate(['provider', 'settings', 'displayboard',
            'list', 'view'], navigationExtras);
    }
    deleteDisplayboard(board) {
        this.provider_services.deleteDisplayboard(board.id).subscribe(
            () => {
                this.getDisplayboards();
            }
        );
    }
}
