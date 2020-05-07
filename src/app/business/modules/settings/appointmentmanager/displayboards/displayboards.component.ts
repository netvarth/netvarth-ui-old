import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-displayboards',
    templateUrl: './displayboards.component.html'
})
export class DisplayboardsComponent implements OnInit {
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Appointment Manager',
            url: '/provider/settings/appointmentmanager'
        },
        {
            title: 'QBoards'
        }
    ];
    api_loading: boolean;
    layout_list: any = [];
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    statusboard_cap = Messages.DISPLAYBOARD_HEADING;
    boardLayouts = [
        { displayName: '1x1', value: '1_1', row: 1, col: 1 },
        { displayName: '1x2', value: '1_2', row: 1, col: 2 },
        { displayName: '2x1', value: '2_1', row: 2, col: 1 },
        { displayName: '2x2', value: '2_2', row: 2, col: 2 }
    ];
    container_count = 0;
    accountType: any;

    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
    ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'appointmentmanager->q-boards', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.getDisplayboardLayouts();
        // this.getDisplayboardContainers();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        this.domain = user.sector;
    }
    getDisplayboardLayouts() {
        this.api_loading = true;
        this.layout_list = [];
        this.provider_services.getDisplayboardsAppointment()
            .subscribe(
                (data: any) => {
                    const alldisplayBoards = data;
                    this.layout_list = [];
                    let count = 0;
                    alldisplayBoards.forEach(element => {
                        if (element.container) {
                            count++;
                        } else {
                            this.layout_list.push(element);
                        }
                    });
                    this.container_count = count;
                    // this.layout_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(action) {
        this.addDisplayboardLayout();
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/appointmentmanager->q-boards']);
        }
    }
    addDisplayboardLayout() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards', 'add']);
    }
    listContainers() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards', 'containers']);
    }
    gotoDisplayboardQSet() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards', 'q-set']);
    }
    ViewDisplayboardLayout(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                value: 'view',
                id: layout.id
            }
        };
        this.router.navigate(['provider', 'settings', 'appointmentmanager',
            'displayboards', 'view'], navigationExtras);
    }
    editDisplayboardLayout(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: layout.id }
        };
        this.router.navigate(['provider', 'settings', 'appointmentmanager',
            'displayboards', 'edit'], navigationExtras);
    }
    getDisplayboardContainers() {
        this.provider_services.getDisplayboardContainers()
            .subscribe(
                (data: any) => {
                    this.container_count = data.length;
                });
    }
    goDisplayboardLayoutDetails(layout, source?) {
        if (source) {
            window.open('#/displayboard/' + layout.id, '_blank');
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: { id: layout.id }
            };
            this.router.navigate(['provider', 'settings', 'appointmentmanager',
                'displayboards', 'view'], navigationExtras);
        }
    }
    deleteDisplayboardLayout(layout) {
        this.provider_services.deleteDisplayboard(layout.id).subscribe(
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
