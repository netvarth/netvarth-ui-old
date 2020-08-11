import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { AddProviderBprofileSpokenLanguagesComponent } from '../../../../../ynw_provider/components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { Router } from '@angular/router';
@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    languages_arr: any = [];
    langdialogRef;
    frm_lang_cap = '';
    normal_language_show = 1;
    customer_label = '';
    bProfile = null;
    lang_known_cap = Messages.LANG_KNOWN_CAP;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    breadcrumb_moreoptions: any = [];
    domain;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Jaldee Profile',
            url: '/provider/settings/bprofile'
        },
        {
            title: 'Languages Known'
        }
    ];
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) {
        this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
        this.getSpokenLanguages();
        this.setLanguages();
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }
    performActions() {
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->languages-known']);
    }
    setLanguages() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    if (this.bProfile.languagesSpoken) {
                        if (this.bProfile.languagesSpoken.length > 0) {
                            this.normal_language_show = 3;
                        } else {
                            this.normal_language_show = 2;
                        }
                    } else {
                        this.normal_language_show = 2;
                    }
                });
    }

    ngOnDestroy() {
        if (this.langdialogRef) {
            this.langdialogRef.close();
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
    getSpokenLanguages() {
        this.provider_services.getSpokenLanguages()
            .subscribe(data => {
                this.languages_arr = data;
            });
    }
    getlanguageName(n) {
        for (let i = 0; i < this.languages_arr.length; i++) {
            if (this.languages_arr[i].name === n) {
                return this.languages_arr[i].displayName;
            }
        }
    }
    handleSpokenLanguages() {
        let holdsellang;
        if (this.bProfile.languagesSpoken) {
            holdsellang = JSON.parse(JSON.stringify(this.bProfile.languagesSpoken)); // to avoid pass by reference
        } else {
            holdsellang = [];
        }

        const bprof = holdsellang;
        const lang = this.languages_arr;
        this.langdialogRef = this.dialog.open(AddProviderBprofileSpokenLanguagesComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
            disableClose: true,
            autoFocus: false,
            data: {
                sellanguages: bprof,
                languagesSpoken: lang
            }
        });
        this.langdialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result['mod'] === 'reloadlist') {
                    // this.getBusinessProfile();
                    this.bProfile = result['data'];
                    this.setLanguages();
                    if (this.bProfile.sellanguages) {
                        if (this.bProfile.sellanguages.length > 0) {
                            this.normal_language_show = 3;
                        } else {
                            this.normal_language_show = 2;
                        }
                    } else {
                        this.normal_language_show = 2;
                    }
                }
            }
        });
    }
}
