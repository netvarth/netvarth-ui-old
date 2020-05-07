import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-containers',
    templateUrl: './containers.component.html'
})
export class ContainersComponent implements OnInit {
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'QBoards',
            url: '/provider/settings/q-manager/displayboards'
        },
        {
            title: 'Containers'
        }
    ];
    api_loading: boolean;
    layout_list: any = [];
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    statusboard_cap = Messages.DISPLAYBOARD_HEADING;
    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions
    ) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.getDisplayboardContainers();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }
    getDisplayboardContainers() {
        this.api_loading = true;
        this.layout_list = [];
        this.provider_services.getDisplayboardsWaitlist()
            .subscribe(
                (data: any) => {
                    const alldisplayBoards = data;
                    this.layout_list = [];

                    alldisplayBoards.forEach(element => {
                        if (element.container) {
                            this.layout_list.push(element);
                        }
                    });
                    // this.layout_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );


        // this.provider_services.getDisplayboardContainers()
        //     .subscribe(
        //         data => {
        //             this.layout_list = data;
        //             this.api_loading = false;
        //         },
        //         error => {
        //             this.api_loading = false;
        //             this.shared_functions.apiErrorAutoHide(this, error);
        //         }
        //     );
    }
    performActions(action) {
        this.addDisplayboardContainer();
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/checkinmanager->settings-displayboards']);
        }
    }
    addDisplayboardContainer() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'containers', 'add']);
    }
    editDisplayboardContainer(layout) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: layout.id }
        };
        this.router.navigate(['provider', 'settings', 'q-manager',
            'displayboards', 'containers', 'edit'], navigationExtras);
    }
    goDisplayboardContainerDetails(layout, source?) {
        if (source) {
            window.open('#/displayboard/' + layout.id + '?type=container', '_blank');
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: { id: layout.id, type: 'container' }
            };
            this.router.navigate(['provider', 'settings', 'q-manager',
                'displayboards', 'containers', 'view'], navigationExtras);
        }
    }
    deleteDisplayboardContainer(layout) {
        this.provider_services.deleteDisplayboard(layout.id).subscribe(
            () => {
                this.getDisplayboardContainers();
            }
        );
    }
    // getLayout(layoutvalue) {
    //     let layoutActive;
    //     for (let i = 0; i < this.boardLayouts.length; i++) {
    //         if (this.boardLayouts[i].value === layoutvalue) {
    //             layoutActive = this.boardLayouts[i];
    //             break;
    //         }
    //     }
    //     return layoutActive;
    // }
}
