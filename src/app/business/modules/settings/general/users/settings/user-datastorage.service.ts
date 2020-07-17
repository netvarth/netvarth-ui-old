import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { BehaviorSubject } from 'rxjs';
@Injectable()

export class UserDataStorageService {
    private weightageArray = [];
    private observable_weightageArray = new BehaviorSubject([]);
    constructor() {}
    private storage = {
        'bprofile': null }
    user_business_profile: any;
    weightageObjectDomain: any;
    weightageObjectuserSubDomain: any;

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
        this.weightageObjectuserSubDomain=subDomainobject;
    
      }
    
      getWeightageObjectOfDomain(){
        return this.weightageObjectDomain;
      }
      getWeightageObjectOfSubDomain(){
        return this.weightageObjectuserSubDomain;
    
      }


      checkExistenceInWeightageArray(constantName) {
        return this.weightageArray.some(object => object.name === constantName.name)
      }

      setUserBusinessProfileWeightage(data){
        this.user_business_profile = data;
        const domainName = this.user_business_profile.serviceSector.domain;
        const subdomainName = this.user_business_profile.serviceSubSector.subDomain;
        if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && this.user_business_profile.businessName) {
          this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME);
        }
        else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && !this.user_business_profile.businessName) {
          this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME.name);
        }

        if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && this.user_business_profile.businessDesc) {
          this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION);
        }
        else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && !this.user_business_profile.businessDesc) {
          this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION.name);
        }
    
        if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && this.user_business_profile.specialization && this.user_business_profile.specialization.length > 0) {
          this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
        }
        else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && (!this.user_business_profile.specialization || this.user_business_profile.specialization.length === 0)) {
          this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
        }

        if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (this.user_business_profile.languagesSpoken && this.user_business_profile.languagesSpoken.length > 0)) {
          this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
        }
        else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (!this.user_business_profile.languagesSpoken || this.user_business_profile.languagesSpoken.length === 0)) {
          this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
        }

        if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && this.user_business_profile.socialMedia && this.user_business_profile.socialMedia.length > 0) {
          this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA);
        }
        else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && (!this.user_business_profile.socialMedia || this.user_business_profile.socialMedia.length === 0)) {
          this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA.name);
        }

        this.setWeightageArray(this.weightageArray);
      }
    

      updateMandatoryAndAdditionalFieldWeightage(){

        let mandatoryObject=projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO;
         let additionalObject=projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO;
        
        if(!this.checkExistenceInWeightageArray(mandatoryObject)){
          if((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus)|| (this.weightageObjectuserSubDomain.mandatorySubDomain && this.weightageObjectuserSubDomain.mandatorySubDomainFilledStatus)){
              this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
              this.setWeightageArray(this.weightageArray);
          }
         }
        else{
           if((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus===false)||(this.weightageObjectuserSubDomain.mandatorySubDomain &&this.weightageObjectuserSubDomain.mandatorySubDomainFilledStatus===false)){
            this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO.name);
            this.setWeightageArray(this.weightageArray);
          
         }
        }
        if(!this.checkExistenceInWeightageArray(additionalObject)){
          if(this.weightageObjectDomain.additionalDomainFullyFilled && this.weightageObjectuserSubDomain.additionalSubDomainFullyFilled){
           this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO);
           // some domains don't have mandatory additional info so to correct the sum if domain not having mandatory , adding mandaoty weightage too
           if(!this.checkExistenceInWeightageArray(mandatoryObject) && this.weightageObjectDomain.mandatoryDomain===false && this.weightageObjectuserSubDomain.mandatorySubDomain===false){
            this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
            this.setWeightageArray(this.weightageArray);
          }
           this.setWeightageArray(this.weightageArray);
      
          }
        }else{
      
          if(this.weightageObjectDomain.additonalDomainFullyFilled===false || this.weightageObjectuserSubDomain.additonalSubDomainFullyFilled=== false ){
           this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO.name);
           this.setWeightageArray(this.weightageArray);
          }
        }
      }

      updateSpecilizationWeightage(data){
        let specializationObject=projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION;
        if(this.checkExistenceInWeightageArray(specializationObject)){
          if(data==null|| data==undefined||data.length===0){
         
           this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
           this.setWeightageArray(this.weightageArray);
          }
         
       }else if(!this.checkExistenceInWeightageArray(specializationObject)){
         if(data!=null ||data!=undefined){
           if(data.length!==0){
             this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
           this.setWeightageArray(this.weightageArray);
           }
         }
       }
      
      }
      
      updateProfilePicWeightage(isImageExist){
        let profilePicObject=projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC;
        if(this.checkExistenceInWeightageArray(profilePicObject)){
          if(isImageExist===false){
           this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC.name);
           this.setWeightageArray(this.weightageArray);
          }
         
       }else if(!this.checkExistenceInWeightageArray(profilePicObject)){
          if(isImageExist){
             this.weightageArray.push(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC);
           this.setWeightageArray(this.weightageArray);
           
         }
       }
      }
      
      updateLanguagesWeightage(data){
        let languageObject=projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN;
        if(this.checkExistenceInWeightageArray(languageObject)){
          if(data==null|| data==undefined||data.length===0){
         
           this.weightageArray = this.weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
           this.setWeightageArray(this.weightageArray);
          }
         
       }else if(!this.checkExistenceInWeightageArray(languageObject)){
         if(data!=null ||data!=undefined){
           if(data.length!=0){
           this.weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
           this.setWeightageArray(this.weightageArray);
           }
         }
       }
      }
      
}