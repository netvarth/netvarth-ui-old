import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
// import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { AddProviderUserBprofileSpokenLanguagesComponent } from './addprovideuserbprofilespokenlanguages/addprovideuserbprofilespokenlanguages.component';
@Component({
    selector: 'app-userlanguages',
    templateUrl: './languages.component.html'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    languages_arr: any = [];
    lang_known_cap = Messages.LANG_KNOWN_CAP;
    sellanguage_arr: any = [];
    user_arr: any = [];
    src: any;
    disableButton = false;
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    langdialogRef;
    frm_lang_cap = '';
    normal_language_show = 1;
    customer_label = '';
    bProfile = null;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    breadcrumb_moreoptions: any = [];
    domain;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            url: '/provider/settings/general/users',
            title: 'Users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    userId: any;
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private routerobj: Router,
        private language: Location,
        public shared_functions: SharedFunctions,
        // private dialog: MatDialog
    ) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
        this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.getUser();
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
                           this.sellanguage_arr = this.bProfile.languagesSpoken;
                        } else {
                            this.sellanguage_arr = null;
                        }
                    }
                },
                () => {
                     }
            );
    }

    ngOnDestroy() {
        // if (this.langdialogRef) {
        //     this.langdialogRef.close();
        // }
    }
    goBack() {
        if (this.src === 'h') {
        this.backPage();
        } else {
          this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
        }
      }
      backPage() {
        this.language.back();
      }
    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                this.user_arr = data;
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                    breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: data.firstName,
                    url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
                });
                breadcrumbs.push({
                    title: 'Settings',
                    url: '/provider/settings/general/users/' + this.userId + '/settings'
                  });
                breadcrumbs.push({
                    title: 'Online Profile',
                    url: '/provider/settings/general/users/' + this.userId + '/settings/bprofile',
                });
                breadcrumbs.push({
                    title: 'Languages Known'
                });
                this.breadcrumbs = breadcrumbs;
            });
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
        if (this.user_arr.userType === 'PROVIDER') {
          postdata['userSubdomain'] = this.user_arr.subdomain;
        }
        this.provider_services.updateUserbProfile(postdata, this.userId)
          .subscribe(data => {
            this.shared_functions.openSnackBar(Messages.BPROFILE_LANGUAGE_SAVED, { 'panelClass': 'snackbarnormal' });
            this.disableButton = false;
            this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
            },
            error => {
              this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
      cancel() {
      this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
      }
    // handleSpokenLanguages() {
    //     let holdsellang;
    //     if (this.bProfile.languagesSpoken) {
    //         holdsellang = JSON.parse(JSON.stringify(this.bProfile.languagesSpoken)); // to avoid pass by reference
    //     } else {
    //         holdsellang = [];
    //     }
    //     const bprof = holdsellang;
    //     const lang = this.languages_arr;
    //     this.langdialogRef = this.dialog.open(AddProviderUserBprofileSpokenLanguagesComponent, {
    //         width: '50%',
    //         panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
    //         disableClose: true,
    //         autoFocus: false,
    //         data: {
    //             sellanguages: bprof,
    //             languagesSpoken: lang,
    //             userId: this.userId
    //         }
    //     });
    //     this.langdialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             if (result['mod'] === 'reloadlist') {
    //                 this.bProfile = result['data'];
    //                 this.setLanguages();
    //                 if (this.bProfile.sellanguages) {
    //                     if (this.bProfile.sellanguages.length > 0) {
    //                         this.normal_language_show = 3;
    //                     } else {
    //                         this.normal_language_show = 2;
    //                     }
    //                 } else {
    //                     this.normal_language_show = 2;
    //                 }
    //             }
    //         }
    //     });
    // }
}
