import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class ProviderDataStorageService {

  business_profile: any;
  private storage = {
    'bprofile': null,
    'waitlistManage': null
  };
  private weightageArray = [];
  private observable_weightageArray = new BehaviorSubject([]);


  constructor() { }

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
  }
  getWeightageArray() {
    return this.observable_weightageArray.asObservable();
  }
  setWeightageArray(ArrayObject) {
    this.observable_weightageArray.next(ArrayObject);
  }

  setBusinessProfileWeightage(data) {
    console.log(data);

    this.weightageArray = [];
    this.business_profile = data;
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME.Name) && this.business_profile.businessName) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && !this.business_profile.businessName) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME.Name);
    }
    //business description

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION.Name) && this.business_profile.businessDesc) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && !this.business_profile.businessDesc) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION.Name);
    }

    //base location and business schedule

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION.Name) && this.business_profile.baseLocation) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION);


      if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE.Name) && this.business_profile.baseLocation.bSchedule) {
        this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE);
      }
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION) && !this.business_profile.baseLocation) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION.Name);
      if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE) && !this.business_profile.baseLocation.bSchedule) {
        this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE.Name);
      }
    }

    //specialization
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.Name) && this.business_profile.specialization && this.business_profile.specialization.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && (!this.business_profile.specialization || this.business_profile.specialization.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.Name);
    }

    //languages known

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.Name) && (this.business_profile.languagesSpoken && this.business_profile.languagesSpoken.length > 0)) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (!this.business_profile.languagesSpoken || this.business_profile.languagesSpoken.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.Name);
    }

    //social Media
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA.Name) && this.business_profile.socialMedia && this.business_profile.socialMedia.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && (!this.business_profile.socialMedia || this.business_profile.socialMedia.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA.Name);
    }

    //privacy phone numbers
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER.Name) && this.business_profile.phoneNumbers && this.business_profile.phoneNumbers.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER) && (!this.business_profile.phoneNumbers || this.business_profile.phoneNumbers.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER.Name);
    }

    //privacy emails
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS.Name) && this.business_profile.emails && this.business_profile.emails.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS) && (!this.business_profile.emails || this.business_profile.emails.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS.Name);
    }

    //additionalInfo
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO.Name) && this.business_profile.domainVirtualFields) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO);

    }
    else if(this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO) && !this.business_profile.domainVirtualFields){
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO.Name);
    }
    //gallery
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY.Name) && this.business_profile.media.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY);

    } else if(this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY) && this.business_profile.media.length === 0){
      this.weightageArray = this.weightageArray.filter(obj => obj.Name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY.Name);
    }
    console.log(this.weightageArray);
    this.setWeightageArray(this.weightageArray);



  }
  addMediaToWeightage(data) {

    if (!this.checkMediaExists_in_weightageArray() && data.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY);
      console.log(this.weightageArray);
    }

  }
  checkMediaExists_in_weightageArray() {
    console.log('media');
    return this.weightageArray.some(object => object.Name === projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY.Name)
  }
  checkExistenceInWeightageArray(constantName) {
    return this.weightageArray.some(object => object.Name === constantName)
  }

}

