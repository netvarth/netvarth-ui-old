import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

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
source;
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    constructor(private router: Router,
        private _location: Location, public activateroute: ActivatedRoute,
        private provider_services: ProviderServices,
        private snackbarService:SnackbarService,
        private groupService: GroupStorageService,
        private  wordProcessor: WordProcessor) {
            this.activateroute.queryParams.subscribe(params => {
               this.source = params.source;
              });
         }
    ngOnInit() {
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'general->labels', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };

        this.getLabels();
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
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
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(actions) {
        this.addLabel();
        if (actions === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/general->labels']);
        }
    }
    addLabel() {
        const navigationExtras: NavigationExtras = {
            queryParams: { source: this.source }
        };
        console.log(navigationExtras);
        this.router.navigate(['provider', 'settings', 'general',
        'labels','add'], navigationExtras);
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
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    changeLabelStatus(label) {
        const status = (label.status === 'ENABLED') ? 'DISABLED' : 'ENABLED';
        const statusmsg = (label.status === 'ENABLED') ? ' disabled' : ' enabled';
        this.provider_services.updateLabelStatus(label.id, status).subscribe(data => {
            this.snackbarService.openSnackBar(label.displayName + statusmsg + ' successfully');
            this.getLabels();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    redirecToGeneral() {
        if (this.source === 'appt' || this.source === 'checkin' || this.source === 'customer' || this.source === 'order') {
            this._location.back();
        } else {
        this.router.navigate(['provider', 'settings' , 'general']);
        }
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/general->labels']);
    }
}
