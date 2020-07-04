import {Injectable} from '@angular/core';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class ProviderDataStorageService {

  business_profile: any;
  private storage = {
    'bprofile' : null,
    'waitlistManage': null
  };
private weightageArray=[];
private observable_weightageArray= new BehaviorSubject([]) ;
  

  constructor() {}

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
  }
  getWeightageArray( ){
    return this.observable_weightageArray.asObservable();
  }
  setWeightageArray(ArrayObject){
    this.observable_weightageArray.next(ArrayObject);
  }

  setBusinessProfileWeightage(data) {
    console.log(data);
    
    this.weightageArray =[];
    this.business_profile=data;
    if(this. business_profile.businessName){
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME);
    }
    if(this.business_profile.businessDesc){
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION);
    }
    if(this.business_profile.baseLocation) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION);
      if(this.business_profile.baseLocation.bSchedule) {
        this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE);
      }
    }
    if(this.business_profile.specialization && this.business_profile.specialization.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
    }
    if(this.business_profile.languagesSpoken && this.business_profile.languagesSpoken.length > 0){
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
    }
    if(this.business_profile.socialMedia && this.business_profile.socialMedia.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA);
    }
    if(this.business_profile.phoneNumbers && this.business_profile.phoneNumbers.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER);
    }
    if(this.business_profile.emails && this.business_profile.emails.length >0 ) {
     this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS);
    }
    if(this.business_profile.domainVirtualFields) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO);

  }
  if(this.business_profile.media.length > 0) {
    this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY);

}
  console.log(this.weightageArray);
  this.setWeightageArray(this.weightageArray);
  


}
addMediaToWeightage(data) {

if(!this.checkMediaExists_in_weightageArray() && data.length>0){
 this.weightageArray .push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY);
 console.log(this.weightageArray);
}

}
checkMediaExists_in_weightageArray() {
  console.log('media');
  return this.weightageArray.some(object=>object.Name===projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY.Name)
}

}

