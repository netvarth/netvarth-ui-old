import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';


@Component({
    selector: 'app-saleschannel',
    templateUrl: './saleschannel.component.html'
})
export class SaleschannelComponent implements OnInit {
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
    constructor(private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private router: Router, ) {
    }
    ngOnInit() {
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getSalesChannel();
    }
    addSalesCode(scCode) {
        if (scCode) {
            console.log(this.scInfo.scId);
            this.provider_services.addSalesCode(this.scInfo.scId).subscribe(
                data => {
                    this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('SC_CREATED'), { 'panelclass': 'snackbarerror' });
                    this.getSalesChannel();
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        } else {
            this.shared_Functionsobj.openSnackBar('Sales Channel Code is Required', { 'panelClass': 'snackbarerror' });
        }
    }
    getSalesChannel() {
        this.provider_services.getSalesChannel().subscribe(
            data => {
                // this.scCode_Ph = data;
                this.scInfo = data;
                this.scExists = true;
                // this.findSC_ByScCode(this.scCode_Ph);
            },
            error => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }

    handlekeyup(ev) {
        if (ev.keyCode === 13) {
            this.findSC_ByScCode(this.scCode_Ph);
        }
    }
    findSC_ByScCode(scCode) {
        if (scCode) {
            this.provider_services.getSearchSCdetails(scCode)
                .subscribe(
                    data => {
                        this.scfound = true;
                        this.scInfo = data;
                    },
                    () => {
                        this.findSC_ByPhone(scCode);
                    }
                );
        }
    }
    findSC_ByPhone(phonenumber) {
        this.provider_services.getsearchPhonedetails(phonenumber)
            .subscribe(
                data => {
                    this.scfound = true;
                    this.scInfo = data;
                },
                () => {
                    this.scfound = false;
                    this.shared_functions.openSnackBar(Messages.SCNOTFOUND, { 'panelClass': 'snackbarerror' });
                }
            );
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
}
