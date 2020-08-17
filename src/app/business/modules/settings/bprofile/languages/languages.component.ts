import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { AddProviderBprofileSpokenLanguagesComponent } from '../../../../../ynw_provider/components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    sellanguage_arr: any = [];
    disableButton = false;
    languages_arr: any = [];
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
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
    src: any;
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
        private language: Location,
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
    goBack() {
        if (this.src === 'h') {
        this.backPage();
        } else {
          this.routerobj.navigate(['provider', 'settings', 'bprofile']);
        }
      }
      backPage() {
        this.language.back();
      }
    setLanguages() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    if (this.bProfile.languagesSpoken) {
                        if (this.bProfile.languagesSpoken.length > 0) {
                            this.sellanguage_arr = this.bProfile.languagesSpoken;
                        } else {
                            this.sellanguage_arr = [];
                        }
                    }
                });
    }

    ngOnDestroy() {
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
    langSel(sel) {
        if (this.sellanguage_arr.length > 0) {
          const existindx = this.sellanguage_arr.indexOf(sel);
          if (existindx === -1) {
            this.sellanguage_arr.push(sel);
          } else {
            this.sellanguage_arr.splice(existindx, 1);
          }
        } else {
          this.sellanguage_arr.push(sel);
        }
      }
      checklangExists(lang) {
        if (this.sellanguage_arr.length > 0) {
          const existindx = this.sellanguage_arr.indexOf(lang);
          if (existindx !== -1) {
            return true;
          }
        } else {
          return false;
        }
      }
      saveLanguages() {
        this.disableButton = true;
        const postdata = {
          'languagesSpoken': this.sellanguage_arr
        };
        this.provider_services.updatePrimaryFields(postdata)
          .subscribe(() => {
            this.shared_functions.openSnackBar(Messages.BPROFILE_LANGUAGE_SAVED, { 'panelClass': 'snackbarnormal' });
            this.disableButton = false;
            this.routerobj.navigate(['provider', 'settings', 'bprofile']);
            },
            error => {
              this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
      cancel() {
      this.routerobj.navigate(['provider', 'settings', 'bprofile']);
      }

}
