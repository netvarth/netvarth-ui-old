import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-container-details',
    templateUrl: './container-detail.component.html'
})
export class ContainerDetailComponent implements OnInit {
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    layout_id;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    // showQsets = true;
    // showQset = false;
    layoutData: any = [];
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    boardSelectedItems: any = {};
    action = 'show';
    api_loading: boolean;
    name;
    displayName;
    metric: any = [];
    metricSelected = {};
    id;
    displayBoardData: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'Queue Board',
            url: '/provider/settings/q-manager/displayboards'
        },
        {
            title: 'Containers',
            url: '/provider/settings/q-manager/displayboards/containers'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    showDboard = true;
    source;
    sbIds;
    refreshInterval;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private shared_Functionsobj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private router: Router
    ) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.layout_id = qparams.id;
                if (this.layout_id) {
                    this.editLayoutbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
    }
    ngOnInit() {
    }
    // createRange(number) {
    //     const items = [];
    //     for (let i = 0; i < number; i++) {
    //         items.push(i);
    //     }
    //     return items;
    // }
    editLayoutbyId(id) {
        this.provider_services.getDisplayboardContainer(id).subscribe(data => {
            this.layoutData = data;
            this.displayBoardData = data;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: this.layoutData.displayName
            });
            this.breadcrumbs = breadcrumbs;
            this.name = this.layoutData.name;
            this.displayName = this.layoutData.displayName;
            this.id = this.layoutData.id;
            this.refreshInterval = this.layoutData.interval;
            const sbids: any = [];
            this.layoutData.sbContainer.forEach(element => {
                sbids.push(element.sbId);
            });
            this.sbIds = sbids.toString();
        });
    }
    onSubmit() {
        let name = '';
        if (this.displayName) {
            name = this.displayName.trim().replace(/ /g, '_');
        }
        const sbIds = this.sbIds.split(',');
        if (this.actionparam === 'add') {
            const post_data = {
                'name': name,
                'layout': '1_1',
                'displayName': this.displayName,
                'interval': this.refreshInterval,
                'sbIds': sbIds,
            };
            this.provider_services.createDisplayboardContainer(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_ADD'), { 'panelclass': 'snackbarerror' });
                // this.editLayoutbyId(data);
                // this.actionparam = 'view';
                this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'containers']);
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
            // } else {
            //     this.shared_Functionsobj.openSnackBar('Please enter the display name', { 'panelClass': 'snackbarerror' });
            // }
        }
        if (this.actionparam === 'edit') {
            const sbids = this.sbIds.split(',');
            const post_data = {
                'id': this.layoutData.id,
                'name': name,
                'layout': '1_1',
                'interval': this.refreshInterval,
                'displayName': this.displayName,
                'sbIds': sbids
            };
            this.provider_services.updateDisplayboardContainer(this.layoutData.id, post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
               // this.editLayoutbyId(this.layoutData.id);
               this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'containers']);
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    onCancel() {
        // if (this.actionparam === 'edit') {
        //     this.actionparam = 'view';
        // } else {
            this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards', 'containers']);
        // }
    }
    editlayout(id) {
        this.actionparam = 'edit';
        this.editLayoutbyId(id);
    }
    resetApiErrors() {
    }
}
