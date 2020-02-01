import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-manageonlineprofile',
    templateUrl: './manageonlineprofile.component.html'
})
export class ManageOnlineProfileComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            title: 'Users',
            url: '/provider/settings/miscellaneous/users'
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
    userId;
    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private activatedRoot: ActivatedRoute,
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
        this.activatedRoot.queryParams.subscribe(data => {
            this.userId = data;
            console.log( this.userId);

        });
    }
    ngOnInit() {
        // const breadcrumbs = [];
        // this.breadcrumbs_init.map((e) => {
        //     breadcrumbs.push(e);
        // });
        // breadcrumbs.push({
        //     title: this.userType.type.charAt(0).toUpperCase() + this.userType.type.slice(1)
        //     
        // });
        // breadcrumbs.push({
        //     title: 'Online profile'
        // });
        // this.breadcrumbs = breadcrumbs;
        this.getDomainSubdomainSettings();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]',this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]',this.provider_label);
    }
    onlineProfile() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile']);
    }
    specializations() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','specializations']);
    }
    additionalInfo() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','additionalinfo']);
    }
    languagesKnown() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','languages']);
    }
    galerySocialmedia() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','media']);
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
