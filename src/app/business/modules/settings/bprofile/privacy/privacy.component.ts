import { Component, OnInit, OnDestroy } from '@angular/core';
import { projectConstants } from '../../../../../app.component';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ConfirmBoxComponent } from '../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { NavigationExtras } from '@angular/router';
import { AddProviderBprofilePrivacysettingsComponent } from '../../../../../ynw_provider/components/provider-bprofile-privacysettings/provider-bprofile-privacysettings.component';
import { Router } from '@angular/router';
@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit, OnDestroy {
    privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
    normal_privacy_settings_show = 1;
    frm_privacy_cap = Messages.FRM_LEVEL_PRIVACY_MSG;
    customernormal_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    email_cap = Messages.SERVICE_EMAIL_CAP;
    bProfile = null;
    edit_cap = Messages.EDIT_BTN;
    delete_btn = Messages.DELETE_BTN;
    phone_cap = Messages.BPROFILE_PHONE_CAP;
    info_cap = Messages.BPROFILE_INFORMATION_CAP;
    privacy_sett_cap = Messages.BPROFILE_PRIVACY_SETTINGS_CAP;
    have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    privacydialogRef;
    phonearr: any = [];
    emailarr: any = [];
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
            title: 'Contact Information'
        }
    ];
    breadcrumb_moreoptions: any = [];
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private routerobj: Router,
        private router: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog
    ) { }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = {  'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.setPrivacyDetails();
    }
    ngOnDestroy() {
        if (this.privacydialogRef) {
            this.privacydialogRef.close();
        }
    }
    // updating the phone number and email ids
    UpdatePrimaryFields(pdata) {
        this.provider_services.updatePrimaryFields(pdata)
            .subscribe(
                data => {
                    this.bProfile = data;
                    this.setPrivacyDetails();
                },
                () => {
                    // this.api_error = error.error;
                }
            );
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }
    performActions() {
        this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->privacy-settings']);   
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
    setPrivacyDetails() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                    if (this.bProfile.phoneNumbers || this.bProfile.emails) {
                        this.normal_privacy_settings_show = 3;
                        if (this.bProfile.phoneNumbers) {
                            this.phonearr = [];
                            for (let i = 0; i < this.bProfile.phoneNumbers.length; i++) {
                                this.phonearr.push(
                                    {
                                        'label': this.bProfile.phoneNumbers[i].label,
                                        'number': this.bProfile.phoneNumbers[i].instance,
                                        'permission': this.bProfile.phoneNumbers[i].permission
                                    }
                                );
                            }
                        }
                        if (this.bProfile.emails) {
                            this.emailarr = [];
                            for (let i = 0; i < this.bProfile.emails.length; i++) {
                                this.emailarr.push(
                                    {
                                        'label': this.bProfile.emails[i].label,
                                        'emailid': this.bProfile.emails[i].instance,
                                        'permission': this.bProfile.emails[i].permission
                                    }
                                );
                            }
                        }
                    }
                });
    }
    deletePrivacysettings(mod, indx) {
        const temparr = [];
        let post_itemdata: any = [];
        if (mod === 'phone') {
            for (let i = 0; i < this.phonearr.length; i++) {
                if (i !== indx) {
                    temparr.push({
                        'label': this.phonearr[i].label,
                        'resource': 'Phoneno',
                        'instance': this.phonearr[i].number,
                        'permission': this.phonearr[i].permission
                    });
                }
            }
            post_itemdata = {
                'phoneNumbers': temparr
            };
        } else if (mod === 'email') {
            for (let i = 0; i < this.emailarr.length; i++) {
                if (i !== indx) {
                    temparr.push({
                        'label': this.emailarr[i].label,
                        'resource': 'Email',
                        'instance': this.emailarr[i].emailid,
                        'permission': this.emailarr[i].permission
                    });
                }
            }
            post_itemdata = {
                'emails': temparr
            };
        }
        this.UpdatePrimaryFields(post_itemdata);
    }
    show_privacyText(txt) {
        let rettxt = '';
        if (txt === 'customersOnly') {
            if (this.customernormal_label !== '' && this.customernormal_label !== undefined && this.customernormal_label !== null) {
                rettxt = 'My ' + this.sharedfunctionobj.firstToUpper(this.customernormal_label) + 's Only';
            } else {
                rettxt = 'My ' + this.privacypermissiontxt[txt] + 's Only';
            }
        } else if (txt === 'all') {
            rettxt = 'Public';
        } else {
            rettxt = 'Private';
        }
        return rettxt;
    }
    deletePrivacysettingsConfirm(mod, indx) {
        let msg = '';
        if (mod === 'phone') {
            msg = Messages.BPROFILE_PRIVACY_PHONE_DELETE;
            msg = msg.replace('[DATA]', this.phonearr[indx].number);
        } else if (mod === 'email') {
            msg = Messages.BPROFILE_PRIVACY_EMAIL_DELETE;
            msg = msg.replace('[DATA]', this.emailarr[indx].emailid);
        }
        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': msg,
                'heading': 'Delete Confirmation'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deletePrivacysettings(mod, indx);
            }
        });
    }
    handlePrivacysettings(typ?, peditindx?) {
        const navigationExtras: NavigationExtras = {
            queryParams: { bprofile: this.bProfile,
            editindx: peditindx,
            curtype: typ }
          };
            this.router.navigate(['provider', 'settings', 'bprofile', 'privacy', 'add'], navigationExtras);
    }
}
