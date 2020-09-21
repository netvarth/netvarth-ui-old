import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { BehaviorSubject } from 'rxjs';
@Injectable()

export class UserDataStorageService {
  private user_weightageArray = [];
  private observable_user_weightageArray = new BehaviorSubject([]);
  constructor() { }
  private storage = {
    'bprofile': null
  };
  user_business_profile: any;
  weightageObjectDomain: any;
  weightageObjectSubDomain: any;

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
  }
  getWeightageArray() {
    return this.observable_user_weightageArray.asObservable();
  }
  setWeightageArray(ArrayObject) {
    this.observable_user_weightageArray.next(ArrayObject);
  }
  setWeightageObjectOfDomain(domainObject) {
    this.weightageObjectDomain = domainObject;
  }
  setWeightageObjectOfSubDomain(subDomainobject) {
    this.weightageObjectSubDomain = subDomainobject;

  }

  getWeightageObjectOfDomain() {
    return this.weightageObjectDomain;
  }
  getWeightageObjectOfSubDomain() {
    return this.weightageObjectSubDomain;

  }



  setUserBusinessProfileWeightage(data) {
    this.user_business_profile = data;
    // const domainName = this.user_business_profile.serviceSector.domain;
    // const subdomainName = this.user_business_profile.serviceSubSector.subDomain;
    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && this.user_business_profile.businessName) {
      this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME) && !this.user_business_profile.businessName) {
      this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_NAME.name);
    }

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && this.user_business_profile.businessDesc) {
      this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION) && !this.user_business_profile.businessDesc) {
      this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.BUSINESS_DESCRIPTION.name);
    }

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && this.user_business_profile.specialization && this.user_business_profile.specialization.length > 0) {
      this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION) && (!this.user_business_profile.specialization || this.user_business_profile.specialization.length === 0)) {
      this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
    }

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (this.user_business_profile.languagesSpoken && this.user_business_profile.languagesSpoken.length > 0)) {
      this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN) && (!this.user_business_profile.languagesSpoken || this.user_business_profile.languagesSpoken.length === 0)) {
      this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
    }

    if (!this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && this.user_business_profile.socialMedia && this.user_business_profile.socialMedia.length > 0) {
      this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA);
    } else if (this.checkExistenceInWeightageArray(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA) && (!this.user_business_profile.socialMedia || this.user_business_profile.socialMedia.length === 0)) {
      this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SOCIAL_MEDIA.name);
    }

    this.setWeightageArray(this.user_weightageArray);
  }

  checkExistenceInWeightageArray(constantName) {
    return this.user_weightageArray.some(object => object.name === constantName.name);
  }


  updateMandatoryAndAdditionalFieldWeightage() {

    const mandatoryObject = projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO;
    const additionalObject = projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO;
    // console.log(this.weightageObjectDomain);
    // console.log(this.weightageObjectSubDomain);
    if (!this.checkExistenceInWeightageArray(mandatoryObject)) {
      if ((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus) || (this.weightageObjectSubDomain.mandatorySubDomain && this.weightageObjectSubDomain.mandatorySubDomainFilledStatus)) {
        this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
        this.setWeightageArray(this.user_weightageArray);
      }
    } else {
      if ((this.weightageObjectDomain.mandatoryDomain && this.weightageObjectDomain.mandatoryDomainFilledStatus === false) || (this.weightageObjectSubDomain.mandatorySubDomain && this.weightageObjectSubDomain.mandatorySubDomainFilledStatus === false)) {
        this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO.name);
        this.setWeightageArray(this.user_weightageArray);
      }
    }
    if (!this.checkExistenceInWeightageArray(additionalObject)) {
      if (this.weightageObjectDomain.additionalDomainFullyFilled && this.weightageObjectSubDomain.additionalSubDomainFullyFilled) {
        this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO);
        this.setWeightageArray(this.user_weightageArray);
        // some domains don't have mandatory additional info so to correct the sum if domain not having mandatory , adding mandaoty weightage too
        if (!this.checkExistenceInWeightageArray(mandatoryObject) && this.weightageObjectDomain.mandatoryDomain === false && this.weightageObjectSubDomain.mandatorySubDomain === false) {
          this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
          this.setWeightageArray(this.user_weightageArray);
        }


      }
    } else {

      if (this.weightageObjectDomain.additionalDomainFullyFilled === false || this.weightageObjectSubDomain.additionalSubDomainFullyFilled === false) {
        this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.ADDITIONAL_INFO.name);
        if (this.weightageObjectDomain.mandatoryDomain === false && this.weightageObjectSubDomain.mandatorySubDomain === false) {
          this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO.name);
          this.setWeightageArray(this.user_weightageArray);
        }
        this.setWeightageArray(this.user_weightageArray);
      }
    }
  }

  updateSpecilizationWeightage(data) {
    const specializationObject = projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION;
    if (this.checkExistenceInWeightageArray(specializationObject)) {
      if (data === null || data === undefined || data.length === 0) {

        this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION.name);
        this.setWeightageArray(this.user_weightageArray);
      }

    } else if (!this.checkExistenceInWeightageArray(specializationObject)) {
      if (data !== null || data !== undefined) {
        if (data.length !== 0) {
          this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.SPECIALIZATION);
          this.setWeightageArray(this.user_weightageArray);
        }
      }
    }

  }

  updateProfilePicWeightage(isImageExist) {
    const profilePicObject = projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC;
    if (this.checkExistenceInWeightageArray(profilePicObject)) {
      if (isImageExist === false) {
        this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC.name);
        this.setWeightageArray(this.user_weightageArray);
      }

    } else if (!this.checkExistenceInWeightageArray(profilePicObject)) {
      if (isImageExist) {
        this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.PROFILE_PIC);
        this.setWeightageArray(this.user_weightageArray);

      }
    }
  }

  updateLanguagesWeightage(data) {
    const languageObject = projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN;
    if (this.checkExistenceInWeightageArray(languageObject)) {
      if (data == null || data === undefined || data.length === 0) {

        this.user_weightageArray = this.user_weightageArray.filter(obj => obj.name !== projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN.name);
        this.setWeightageArray(this.user_weightageArray);
      }

    } else if (!this.checkExistenceInWeightageArray(languageObject)) {
      if (data != null || data !== undefined) {
        if (data.length !== 0) {
          this.user_weightageArray.push(projectConstantsLocal.USER_BUSINESS_PROFILE_WEIGHTAGE.LANGUAGES_KNOWN);
          this.setWeightageArray(this.user_weightageArray);
        }
      }
    }
  }
}
