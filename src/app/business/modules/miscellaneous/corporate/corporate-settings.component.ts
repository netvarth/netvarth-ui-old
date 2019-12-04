import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-corporatesettings',
    templateUrl: './corporate-settings.component.html'
})
export class CorporateSettingsComponent implements OnInit {
    breadcrumb_moreoptions: any = [];
    cancel_btn = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    accountType;
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
    constructor(private router: Router,
        private shared_services: ProviderServices,
        private shared_functions: SharedFunctions) {

    }
    ngOnInit() {
        this.loading = false;
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
    }
    onSubmitJoinCorp (corpId) {
        this.shared_services.joinCorp(corpId).subscribe(
            (data) => {
                const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
                user['accountType'] = 'BRANCH';
                this.shared_functions.setitemToGroupStorage('ynw-user', user);
                this.accountType = 'BRANCH';
                this.shared_functions.openSnackBar(Messages.JOINCORP_SUCCESS);
            },
            (error) => {
                console.log(error);
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    onSubmitCreateCorp (corpName, corpCode) {
        if (!corpName || corpName === '') {
            this.shared_functions.openSnackBar('Corporate Name required', { 'panelClass': 'snackbarerror' });
            return false;
        }
        if (!corpCode || corpCode === '') {
            this.shared_functions.openSnackBar('Corporate Code required', { 'panelClass': 'snackbarerror' });
            return false;
        }
        const post_data = {
            'corporateName' : corpName,
            'corporateCode' : corpCode,
            'multilevel': true
        };
        this.shared_services.createCorp (post_data).subscribe(
            (data) => {
                const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
                user['accountType'] = 'BRANCH';
                this.shared_functions.setitemToGroupStorage('ynw-user', user);
                this.accountType = 'BRANCH';
                this.shared_functions.openSnackBar(Messages.CREATECORP_SUCCESS);
            },
            (error) => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    onCancel() {
        this.router.navigate(['provider', 'settings']);
    }
}
