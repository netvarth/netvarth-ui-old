import { Component, OnDestroy, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
import { AddProviderBprofileSpecializationsComponent } from '../../../../ynw_provider/components/add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { Router } from '@angular/router';
@Component({
    selector: 'app-specializatons',
    templateUrl: './specializations.component.html'
})
export class SpecializationsComponent implements OnInit, OnDestroy {
    specialization_arr: any = [];
    special_cap = Messages.BPROFILE_SPECIAL_CAP;
    specialization_title = '';
    bProfile = null;
    frm_specialization_cap = Messages.FRM_LEVEL_SPEC_MSG;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    specialdialogRef;
    domain;
    normal_specilization_show = 1;
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Jaldee Online',
            url: '/provider/settings/bprofile'
        },
        {
            title: 'Specializations'
        }
    ];
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) { }
    ngOnDestroy() {
        if (this.specialdialogRef) {
            this.specialdialogRef.close();
        }
    }
    ngOnInit() {
        this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'profile-search->public-search' };
        this.initSpecializations();
        const user = this.shared_functions.getitemfromSessionStorage('ynw-user');
        this.domain = user.sector;
    }
    // learnmore_clicked(parent, child) {}
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
      }
    initSpecializations() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    this.getSpecializations(data['serviceSector']['domain'], data['serviceSubSector']['subDomain']);
                    this.specialization_title = (data['serviceSubSector']['displayName']) ?
                        data['serviceSubSector']['displayName'] : '';
                    if (this.bProfile.specialization) {
                        if (this.bProfile.specialization.length > 0) {
                            this.normal_specilization_show = 3;
                        } else {
                            this.normal_specilization_show = 2;
                        }
                    } else {
                        this.normal_specilization_show = 2;
                    }
                });
    }
    getSpecializations(domain, subdomain) {
        this.provider_services.getSpecializations(domain, subdomain)
            .subscribe(data => {
                this.specialization_arr = data;
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

            _this.provider_services.getBussinessProfile()
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
        this.specialdialogRef = this.dialog.open(AddProviderBprofileSpecializationsComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
            disableClose: true,
            autoFocus: false,
            data: {
                selspecializations: bprof,
                specializations: special
            }
        });
        this.specialdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result['mod'] === 'reloadlist') {
                    // this.getBusinessProfile();
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
