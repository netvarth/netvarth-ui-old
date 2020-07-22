import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class ProviderDataStorageService {

  weightageObjectSubDomain: any;
  weightageObjectDomain: any;
  business_profile: any;
  private storage = {
    'bprofile': null,
    'waitlistManage': null
  };
  private weightageArray = [];
  public observable_weightageArray = new BehaviorSubject([]);


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
  setWeightageObjectOfDomain(domainObject){
    this.weightageObjectDomain=domainObject;
  }
  setWeightageObjectOfSubDomain(subDomainobject){
    this.weightageObjectSubDomain=subDomainobject;

  }

  getWeightageObjectOfDomain(){
    return this.weightageObjectDomain;
  }
  getWeightageObjectOfSubDomain(){
    return this.weightageObjectSubDomain;

  }

  setBusinessProfileWeightage(data) {
    this.business_profile = data;
    const domainName = this.business_profile.serviceSector.domain;
    const subdomainName = this.business_profile.serviceSubSector.subDomain;

    //business name
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && this.business_profile.businessName) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && !this.business_profile.businessName) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME.name);
    }
    //business description

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && this.business_profile.businessDesc) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && !this.business_profile.businessDesc) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION.name);
    }

    //base location  

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION) && this.business_profile.baseLocation) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION);

    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION) && !this.business_profile.baseLocation) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.BASE_LOCATION.name);
     
    }
    //business schedule
    if(this.business_profile.baseLocation&&this.business_profile.baseLocation.bSchedule){
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE) && this.business_profile.baseLocation.bSchedule) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE);
    }
    else  if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE) && !this.business_profile.baseLocation.bSchedule) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE.name);
    }
  } else  if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE)) {
    this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LOCATION_SCHEDULE.name);
  }

    //specialization
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && this.business_profile.specialization && this.business_profile.specialization.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && (!this.business_profile.specialization || this.business_profile.specialization.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
    }

    //languages known

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (this.business_profile.languagesSpoken && this.business_profile.languagesSpoken.length > 0)) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (!this.business_profile.languagesSpoken || this.business_profile.languagesSpoken.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
    }

    //social Media
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && this.business_profile.socialMedia && this.business_profile.socialMedia.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && (!this.business_profile.socialMedia || this.business_profile.socialMedia.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA.name);
    }

    //privacy phone numbers
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER) && (this.business_profile.phoneNumbers && this.business_profile.phoneNumbers.length > 0)) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER);
    }
    else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER) && (!this.business_profile.phoneNumbers || this.business_profile.phoneNumbers.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_PHONE_NUMBER.name);
    }

    //privacy emails
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS) && this.business_profile.emails && this.business_profile.emails.length > 0) {
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS) && (!this.business_profile.emails || this.business_profile.emails.length === 0)) {
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PRIVACY_EMAILS.name);
    }

    //additionalInfo
     
    
    this.setWeightageArray(this.weightageArray);



  }

  checkExistenceInWeightageArray(constantName) {
    return this.weightageArray.some(object => object.name === constantName.name)
  }


  //gallery
  updateGalleryWeightageToBusinessProfile(data){
    let galleryObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY;
   if(this.checkExistenceInWeightageArray(galleryObject)){
     if(data==null|| data==undefined||data.length===0){
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY.name);
      this.setWeightageArray(this.weightageArray);
     }
    
  }else if(!this.checkExistenceInWeightageArray(galleryObject)){
    if(data!==null ||data!==undefined){
      if(data.length!==0){
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MEDIA_GALLERY);
      this.setWeightageArray(this.weightageArray);
      }
    }
  }

}




updateMandatoryAndAdditionalFieldWeightage(){

  let mandatoryObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO;
   let additionalObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO;
   console.log(this.weightageObjectDomain);
   console.log(this.weightageObjectSubDomain);
   
   
  
  if(!this.checkExistenceInWeightageArray(mandatoryObject)){
    if((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus)|| (this.weightageObjectSubDomain.mandatorySubDomain && this.weightageObjectSubDomain.mandatorySubDomainFilledStatus)){
        this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
        this.setWeightageArray(this.weightageArray);
    }
   }
  else{
     if((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus===false)||(this.weightageObjectSubDomain.mandatorySubDomain &&this.weightageObjectSubDomain.mandatorySubDomainFilledStatus===false)){
      this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO.name);
      this.setWeightageArray(this.weightageArray);
    
   }
   if(this.weightageObjectDomain.mandatoryDomain===false && this.weightageObjectSubDomain.mandatorySubDomain===false){
    this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO.name);
    this.setWeightageArray(this.weightageArray);
   }
  }

  if(!this.checkExistenceInWeightageArray(additionalObject)){
    if(this.weightageObjectDomain.additionalDomainFullyFilled && this.weightageObjectSubDomain.additionalSubDomainFullyFilled){
     this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO);
     // some domains don't have mandatory additional info so to correct the sum if domain not having mandatory , adding mandaoty weightage too
     if(!this.checkExistenceInWeightageArray(mandatoryObject) && this.weightageObjectDomain.mandatoryDomain===false && this.weightageObjectSubDomain.mandatorySubDomain===false){
      this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
      this.setWeightageArray(this.weightageArray);
    }
     this.setWeightageArray(this.weightageArray);

    }
  }else{
    if(this.weightageObjectDomain.additionalDomainFullyFilled===false || this.weightageObjectSubDomain.additionalSubDomainFullyFilled=== false ){
     this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO.name);
     this.setWeightageArray(this.weightageArray);
    }
  }
  
}


updateLanguagesWeightage(data){
  let languageObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN;
  if(this.checkExistenceInWeightageArray(languageObject)){
    if(data==null|| data==undefined||data.length===0){
   
     this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
     this.setWeightageArray(this.weightageArray);
    }
   
 }else if(!this.checkExistenceInWeightageArray(languageObject)){
   if(data!=null ||data!=undefined){
     if(data.length!=0){
     this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
     this.setWeightageArray(this.weightageArray);
     }
   }
 }
}
updateSpecilizationWeightage(data){
  let specializationObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION;
  if(this.checkExistenceInWeightageArray(specializationObject)){
    if(data==null|| data==undefined||data.length===0){
   
     this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
     this.setWeightageArray(this.weightageArray);
    }
   
 }else if(!this.checkExistenceInWeightageArray(specializationObject)){
   if(data!=null ||data!=undefined){
     if(data.length!==0){
       this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
     this.setWeightageArray(this.weightageArray);
     }
   }
 }

}

updateProfilePicWeightage(isImageExist){
  let profilePicObject=projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC;
  if(this.checkExistenceInWeightageArray(profilePicObject)){
    if(isImageExist===false){
     this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC.name);
     this.setWeightageArray(this.weightageArray);
    }
   
 }else if(!this.checkExistenceInWeightageArray(profilePicObject)){
    if(isImageExist){
       this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC);
     this.setWeightageArray(this.weightageArray);
     
   }
 }
}

}

