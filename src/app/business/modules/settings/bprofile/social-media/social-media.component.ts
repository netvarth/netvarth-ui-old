import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-social-media',
    templateUrl: './social-media.component.html',
    styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit {

    constructor(public routerobj: Router,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions) { }
    orgsocial_list = projectConstantsLocal.SOCIAL_MEDIA;
    socialLink: any = [];
    social_arr: any = [];
    bProfile: any = [];
    showSave: any = [];
    ngOnInit() {
        this.getBusinessProfile();
    }
    redirecToBprofile() {
        this.routerobj.navigate(['provider', 'settings', 'bprofile']);
    }
    saveSocial(media, socialUrl) {
        const curlabel = socialUrl;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_URL);
        const result = pattern.test(curlabel);
        if (!result) {
            this.shared_functions.openSnackBar(Messages.BPROFILE_SOCIAL_URL_VALID, { 'panelclass': 'snackbarerror' });
            return;
        }
        const filteredList = this.social_arr.filter(social => social.Sockey === media);
        if (filteredList.length === 0) {
            this.social_arr.push({ 'Sockey': media, 'Socurl': socialUrl });
        } else {
            for (let i = 0; i < this.social_arr.length; i++) {
                if (this.social_arr[i].Sockey === media) {
                    this.social_arr[i].Socurl = socialUrl;
                }
            }
        }
        this.saveSocialmedia();
    }
    saveSocialmedia() {
        const post_data: any = [];
        for (let i = 0; i < this.social_arr.length; i++) {
            if (this.social_arr[i].Socurl !== '') {
                post_data.push({ 'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl });
            }
        }
        const submit_data = {
            'socialMedia': post_data
        };
        this.provider_services.updateSocialMediaLinks(submit_data)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar(Messages.BPROFILE_SOCIALMEDIA_SAVED, { 'panelclass': 'snackbarerror' });
                    this.showSave = [];
                    this.getBusinessProfile();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile().subscribe(
            data => {
                this.bProfile = data;
                this.socialLink = [];
                this.social_arr = [];
                if (this.bProfile.socialMedia) {
                    for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
                        if (this.bProfile.socialMedia[i].resource !== '') {
                            this.social_arr.push({ 'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
                            const filteredList = this.orgsocial_list.filter(social => social.key === this.bProfile.socialMedia[i].resource);
                            if (filteredList && filteredList[0]) {
                                const indx = this.orgsocial_list.indexOf(filteredList[0]);
                                this.socialLink[indx] = this.bProfile.socialMedia[i].value;
                            }
                        }
                    }
                }
            });
    }
    keyPressed(index) {
        this.showSave[index] = true;
    }
    deleteSocialmedia(sockey) {
        console.log(this.social_arr);
        console.log(sockey);
        const post_data: any = [];
        for (let i = 0; i < this.social_arr.length; i++) {
            if (this.social_arr[i].Sockey !== sockey) {
                post_data.push({ 'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl });
            }
        }
        console.log(post_data);
        const submit_data = {
            'socialMedia': post_data
        };
        this.provider_services.updateSocialMediaLinks(submit_data)
            .subscribe(
                () => {
                    this.getBusinessProfile();
                },
                () => {
                }
            );
    }
    showDelete(key) {
        const filteredList = this.social_arr.filter(social => social.Sockey === key);
        if (filteredList.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}
