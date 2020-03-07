import { Component, OnDestroy, OnInit } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderDataStorageService } from '../../../../../../ynw_provider/services/provider-datastorage.service';
import { AddProviderBprofileSpecializationsComponent } from '../../../../../../ynw_provider/components/add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSpecializationComponent } from './userspecialization/userspecialization.component';
@Component({
    selector: 'app-userspecializatons',
    templateUrl: './specializations.component.html'
})
export class SpecializationsComponent implements OnInit, OnDestroy {
    specialization_arr: any = [];
    special_cap = Messages.BPROFILE_SPECIAL_CAP;

    bProfile = null;
    frm_specialization_cap = Messages.FRM_LEVEL_SPEC_MSG;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    specialdialogRef;
    domain;
    normal_specilization_show = 1;
    breadcrumb_moreoptions: any = [];
    specn;
    username;
    domainList: any = [];
    subDomain;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            url: '/provider/settings/miscellaneous/users',
            title: 'Users'

        },

    ];
    breadcrumbs = this.breadcrumbs_init;
    userId: any;
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
    }
    ngOnDestroy() {
        if (this.specialdialogRef) {
            this.specialdialogRef.close();
        }
    }
    ngOnInit() {
        this.domainList = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
        });
        breadcrumbs.push({
            title: this.userId,
            url: '/provider/settings/miscellaneous/users/add?type=edit&val=' + this.userId,
        });
        breadcrumbs.push({
            title: 'Online Profile',
            url: '/provider/settings/miscellaneous/users/' + this.userId + '/bprofile',
        });
        breadcrumbs.push({
            title: 'Specialization'
        });
        this.breadcrumbs = breadcrumbs;
        this.getUser();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    // learnmore_clicked(parent, child) {}
    performActions() {

        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->specializations']);

    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->']);
    }

    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                this.username = data.firstName;
                for (let i = 0; i < this.domainList.bdata.length; i++) {
                    if (this.domainList.bdata[i].domain === this.domain) {
                        for (let j = 0; j < this.domainList.bdata[i].subDomains.length; j++) {
                            if (this.domainList.bdata[i].subDomains[j].id === data.subdomain) {
                                this.subDomain = this.domainList.bdata[i].subDomains[j].subDomain;
                                console.log(this.subDomain);
                                this.initSpecializations();
                            }
                        }
                    }
                }
            });


    }

    initSpecializations() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    console.log(this.domain);
                    console.log(this.subDomain);
                    this.getSpecializations(this.domain, this.subDomain);
                    if (this.bProfile.specialization) {
                        if (this.bProfile.specialization.length > 0) {
                            this.normal_specilization_show = 3;
                        } else {
                            this.normal_specilization_show = 2;
                        }
                    } else {
                        this.normal_specilization_show = 2;
                    }

                },
                () => {
                    this.normal_specilization_show = 2;
                }
            );
    }
    getSpecializations(domain, subdomain) {
        this.provider_services.getSpecializations(domain, subdomain)
            .subscribe(data => {
                this.specialization_arr = data;
                console.log(this.specialization_arr);
            });
    }
    getSpecializationName(n) {
        for (let i = 0; i < this.specialization_arr.length; i++) {
            if (this.specialization_arr[i].name === n) {
                return this.specialization_arr[i].displayName;
            }
        }
    }
    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getUserBussinessProfile(_this.userId)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );

        });
    }
    handleSpecialization() {
        let holdselspec;
        if (this.bProfile && this.bProfile.specialization) {
            holdselspec = JSON.parse(JSON.stringify(this.bProfile.specialization)); // to avoid pass by reference
        } else {
            holdselspec = [];
        }

        const bprof = holdselspec;
        const special = this.specialization_arr;
        this.specialdialogRef = this.dialog.open(UserSpecializationComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
            disableClose: true,
            autoFocus: false,
            data: {
                selspecializations: bprof,
                specializations: special,
                userId: this.userId,

            }
        });
        this.specialdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result['mod'] === 'reloadlist') {
                    this.bProfile = result['data'];
                    this.initSpecializations();
                    if (this.bProfile && this.bProfile.selspecializations) {
                        if (this.bProfile.selspecializations.length > 0) {
                            this.normal_specilization_show = 3;
                        } else {
                            this.normal_specilization_show = 2;
                        }
                    } else {
                        this.normal_specilization_show = 2;
                    }
                }
            }
        });
    }
}
