import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous.component.html'
})
export class MiscellaneousComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Miscellaneous'
        }
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    isCorp = false;
    isMultilevel = false;
    accountType: any;
    cust_domain_name = '';
    provider_domain_name = '';
    customer_label = '';
    provider_label = '';
    breadcrumb_moreoptions: any = []; 
    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.getDomainSubdomainSettings();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    // gotocustomview() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
    // }
    // gotobranchsps() {
    //     this.router.navigate(['provider', 'settings', 'general', 'users']);
    // }
    gotocorporate() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'corporate']);
    }
    // gotoNonworkingDays() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'holidays']);
    // }
    // gotoNotifications() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications']);
    // }
    gotosaleschannel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'saleschannel']);
    }
    // gotothemes() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'skins']);
    // }
    gotoJdn() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'jdn']);
    }
    // gotoLabels() {
    //     this.router.navigate(['provider', 'settings', 'miscellaneous', 'labels']);
    // }
    performActions(action) {
        if (action === 'learnmore') {
          this.router.navigate(['/provider/' + this.domain + '/miscellaneous']);
        }
      }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
    }
    getDomainSubdomainSettings() {
        const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isCorp = data.isCorp;
                        this.isMultilevel = data.isMultilevel;
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
}
