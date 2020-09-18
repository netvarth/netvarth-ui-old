import { Component, OnDestroy, OnInit } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'app-specializatons',
    templateUrl: './specializations.component.html'
})
export class SpecializationsComponent implements OnInit, OnDestroy {
    specialization_arr: any = [];
    specializations_cap = Messages.SPECIALIZATIONS_CHOOSE;
    special_cap = Messages.BPROFILE_SPECIAL_CAP;
    specialization_title = '';
    bProfile = null;
    frm_specialization_cap = Messages.FRM_LEVEL_SPEC_MSG;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    domain;
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    api_loading = true;
    selspecialization_arr: any = [];
    disableButton = false;
    src: any;
    normal_specilization_show = 1;
    breadcrumb_moreoptions: any = [];
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
            title: 'Specializations'
        }
    ];
    constructor(
        private provider_services: ProviderServices,
        private routerobj: Router,
        private specialsn: Location,
        public shared_functions: SharedFunctions
    ) {
      }
    ngOnDestroy() {
       }
    ngOnInit() {
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.initSpecializations();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }
    // learnmore_clicked(parent, child) {}
    performActions() {

        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->specializations']);

    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod ]);
    }
    goBack() {
        if (this.src === 'h') {
        this.backPage();
        } else {
          this.routerobj.navigate(['provider', 'settings', 'bprofile']);
        }
      }
      backPage() {
        this.specialsn.back();
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
                          // console.log(this.bProfile.specialization);
                           this.selspecialization_arr = this.bProfile.specialization;
                          } else {
                            this.selspecialization_arr = [];
                        }
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
    specializationSel(sel) {
        if (this.selspecialization_arr.length > 0) {
          const existindx = this.selspecialization_arr.indexOf(sel);
          if (existindx === -1) {
            this.selspecialization_arr.push(sel);
          } else {
            this.selspecialization_arr.splice(existindx, 1);
          }
        } else {
          this.selspecialization_arr.push(sel);
        }
      }
      checkspecializationExists(lang) {
        if (this.selspecialization_arr.length > 0) {
          const existindx = this.selspecialization_arr.indexOf(lang);
          if (existindx !== -1) {
            return true;
          }
        } else {
          return false;
        }
      }
      saveSpecializations() {
        this.disableButton = true;
        const postdata = {
          'specialization': this.selspecialization_arr
        };
        this.provider_services.updatePrimaryFields(postdata)
          .subscribe(() => {
            this.shared_functions.openSnackBar(Messages.BPROFILE_SPECIALIZATION_SAVED, { 'panelClass': 'snackbarnormal' });
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
