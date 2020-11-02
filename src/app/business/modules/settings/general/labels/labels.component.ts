import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-labels',
    templateUrl: './labels.component.html'
})
export class LabelsComponent implements OnInit {
    tooltipcls = '';
    add_button = '';
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Custom Fields'
        }
    ];
    api_loading: boolean;
    label_list: any;

    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    constructor(private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions) { }

    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'general->labels', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };

        this.getLabels();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }
    getLabels() {
       this.api_loading = true;
        this.label_list = [];
        this.provider_services.getLabelList()
            .subscribe(
                (data: any) => {
                    // this.label_list = data.filter(label => label.status === 'ACTIVE');
                    this.label_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(actions) {
        this.addLabel();
        if (actions === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/general->labels']);
        }
    }
    addLabel() {
        this.router.navigate(['provider/settings/general/labels/add']);
    }
    editLabel(label) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: label.id }
        };
        this.router.navigate(['provider', 'settings', 'general',
            'labels', 'edit'], navigationExtras);
    }
    goLabelDetail(label) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: label.id }
        };
        this.router.navigate(['provider', 'settings', 'general',
            'labels', 'view'], navigationExtras);
    }
    deleteLabel(label) {
        this.provider_services.deleteLabel(label.id).subscribe(
            () => {
                this.getLabels();
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    changeLabelStatus(label) {
        const status = (label.status === 'ENABLED') ? 'DISABLED' : 'ENABLED';
        const statusmsg = (label.status === 'ENABLED') ? ' disabled' : ' enabled';
        this.provider_services.updateLabelStatus(label.id, status).subscribe(data => {
            this.shared_functions.openSnackBar(label.displayName + statusmsg + ' successfully');
            this.getLabels();
        },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    redirecToGeneral() {
        this.router.navigate(['provider', 'settings' , 'general']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/general->labels']);
    }
}
