import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
    selector: 'app-saleschannel-settings',
    templateUrl: './sc-settings.component.html'
})
export class SaleschannelSettingsComponent implements OnInit {
    id;
    api_error = null;
    api_success = null;
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous'
        },
        {
            title: 'Sales Channel'
        }
    ];
    domain: any;
    scCode_Ph;
    scfound;
    scExists;
    scInfo;
    dispObj = {};
    scCode;
    constructor(private provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private router: Router) {
    }
    ngOnInit() {
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getSalesChannel();
    }
    onReferalSubmit(sccode) {
        this.scfound = false;
        this.scCode = null;
        if (sccode) {
            this.scCode = sccode;
            this.scfound = true;
        }
    }
    addSalesCode() {
        if (this.scCode) {
            this.provider_services.addSalesCode(this.scCode).subscribe(
                data => {
                    this.api_success = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('SC_CREATED'), { 'panelclass': 'snackbarerror' });
                    this.getSalesChannel();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        } else {
            this.snackbarService.openSnackBar('Sales Channel Code is Required', { 'panelClass': 'snackbarerror' });
        }
    }
    getSalesChannel() {
        this.provider_services.getSalesChannel().subscribe(
            data => {
                if (data) {
                    this.scInfo = data;
                    this.scExists = true;
                    this.dispObj['action'] = 'view';
                    this.dispObj['scCode'] = data;
                    this.scfound = true;
                    const message = {};
                    message['ttype'] = 'saleschannel';
                    message['data'] = this.dispObj;
                    this.shared_functions.sendMessage(message);
                }
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    onCancel() {
        this.router.navigate(['provider/settings']);
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->saleschannel']);
        }
    }
    redirecToMiscellaneous() {
        this.routerobj.navigate(['provider', 'settings' , 'miscellaneous']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->saleschannel']);
    }
}
