import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-corporatesettings',
    templateUrl: './corporate-settings.component.html'
})
export class CorporateSettingsComponent implements OnInit {
    corporateCode;
    corporateName;
    breadcrumb_moreoptions: any = [];
    cancel_btn = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    accountType;
    domain;
    breadcrumbs = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            title: 'Corporate Settings'
        }
    ];
    loading: boolean;
    corpInfo;
    corpType;
    corpId = '';
    constructor(
        private router: Router,
        private routerobj: Router,
        private shared_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private groupService: GroupStorageService,
        private snackbarService: SnackbarService) {

    }
    ngOnInit() {
        this.loading = false;
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.accountType = user.accountType;
        this.getCorporateDetails();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    getCorporateDetails() {
        this.shared_services.getCorporateDetails().subscribe(
            (data) => {
                this.corpInfo = data;
            }
        );
    }
    onSubmitJoinCorp(corpId) {
        if (this.corpId.trim() === '') {
            this.snackbarService.openSnackBar('Please enter corporate uid', { 'panelClass': 'snackbarerror' });
        } else {
            this.shared_services.joinCorp(corpId).subscribe(
                (data) => {
                    const user = this.groupService.getitemFromGroupStorage('ynw-user');
                    user['accountType'] = 'BRANCH';
                    this.groupService.setitemToGroupStorage('ynw-user', user);
                    this.accountType = 'BRANCH';
                    this.snackbarService.openSnackBar(Messages.JOINCORP_SUCCESS);
                    this.corpType = '';
                    this.corpId = '';
                    this.getCorporateDetails();
                    const pdata = { 'ttype': 'upgradelicence' };
                    this.shared_functions.sendMessage(pdata);
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        }
    }
    onSubmitCreateCorp(corpName, corpCode) {
        if (!corpName || corpName === '') {
            this.snackbarService.openSnackBar('Corporate Name required', { 'panelClass': 'snackbarerror' });
            return false;
        }
        if (!corpCode || corpCode === '') {
            this.snackbarService.openSnackBar('Corporate Code required', { 'panelClass': 'snackbarerror' });
            return false;
        }
        const post_data = {
            'corporateName': corpName,
            'corporateCode': corpCode,
            'multilevel': true
        };
        this.shared_services.createCorp(post_data).subscribe(
            (data) => {
                const user = this.groupService.getitemFromGroupStorage('ynw-user');
                user['accountType'] = 'BRANCH';
                this.groupService.setitemToGroupStorage('ynw-user', user);
                this.accountType = 'BRANCH';
                this.snackbarService.openSnackBar(Messages.CREATECORP_SUCCESS);
                this.getCorporateDetails();
                const pdata = { 'ttype': 'upgradelicence' };
                this.shared_functions.sendMessage(pdata);
            },
            (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    onCancel() {
        this.router.navigate(['provider', 'settings']);
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->corporate']);
        }
    }
    redirecToMiscellaneous() {
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->corporate']);
    }
}
