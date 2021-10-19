import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
// import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../../../shared/services/snackbar.service';
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
  domain;
  userId: any;
  constructor(
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private routerobj: Router,
    private language: Location,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService
  ) {
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
    }
    );
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  ngOnInit() {
    this.getUser();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
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
        this.snackbarService.openSnackBar(Messages.BPROFILE_LANGUAGE_SAVED, { 'panelClass': 'snackbarnormal' });
        this.disableButton = false;
        this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
      },
        error => {
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  cancel() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
  }
}
