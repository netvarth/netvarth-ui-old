import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { DOCUMENT } from '@angular/common';
import { projectConstants } from '../../../../../../../../app.component';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataStorageService } from '../../user-datastorage.service';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../../../shared//modules/form-message-display/form-message-display.service';
import { MatDialog } from '@angular/material';
import { ProviderUserBprofileSearchDynamicComponent } from './../additionalinfo/provider-userbprofile-search-dynamic.component/provider-userbprofile-search-dynamic.component';
import { MatDialogRef } from '@angular/material';
import { QuestionService } from '../../../../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { ProviderSharedFuctions } from '../../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { UserBprofileSearchPrimaryComponent } from './../user-bprofile-search-primary/user-bprofile-search-primary.component';
import { ProPicPopupComponent } from '../../../../../bprofile/pro-pic-popup/pro-pic-popup.component';
@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html'
})

export class AboutmeComponent implements OnInit, OnDestroy {
  showVirtualFields = false;
  notedialogRef: MatDialogRef<ProPicPopupComponent, any>;
  subdomain_fields_mandatory = [];
  domain_fields_mandatory = [];
  formfields;
  amForm: FormGroup;
  user_arr;
  userId: any;
  blogo: any = [];
  cacheavoider = '';
  item_pic = {
    files: [],
    base64: null
  };
  selitem_pic = '';
  success_error = null;
  error_list = [];
  error_msg = '';
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  profimg_exists = false;
  disableButton = false;
  bProfile = null;
  showProfile = false;
  api_error = null;
  api_success = null;
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;

  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  add_cap = Messages.ADD_BTN;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  subDomainId;
  subDomain;
  domainList: any = [];
  domain;
  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  userMandatoryfieldArray: any = [];
  userAdditionalInfoSubDomainFields: any[];
  userAdditionalInfoDomainFields: any[];
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  domain_fields_nonmandatory = [];
  subdomain_fields_nonmandatory = [];
  vkeyNameMap = {};
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };
  dynamicdialogRef;
  logoExist = false;
  constructor(
    private fb: FormBuilder,
    private service: QuestionService,
    public fed_service: FormMessageDisplayService,
    private provider_services: ProviderServices,
    private user_datastorage: UserDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    @Inject(DOCUMENT) public document,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UserBprofileSearchPrimaryComponent>,
    private routerobj: Router,
    private activated_route: ActivatedRoute,
    private sharedfunctionobj: SharedFunctions,
  ) {
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
      console.log(this.userId);
    });
  }
  ngOnInit() {
    this.getUser();
    this.createForm();
    // this.getBusinessProfile();
    const user = this.sharedfunctionobj.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.domainList = this.sharedfunctionobj.getitemfromLocalStorage('ynw-bconf');
    // const bConfig = this.sharedfunctionobj.getitemfromLocalStorage('ynw-bconf');

  }
  redirecToBprofile() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile']);
  }
  ngOnDestroy() {
    if (this.dynamicdialogRef) {
      this.dynamicdialogRef.close();
    }
  }

  getUser() {
    this.provider_services.getUser(this.userId)
      .subscribe((data: any) => {
        console.log(data);
        this.subDomainId = data.subdomain;
        this.user_arr = data;
        for (let i = 0; i < this.domainList.bdata.length; i++) {
          if (this.domainList.bdata[i].domain === this.domain) {
            for (let j = 0; j < this.domainList.bdata[i].subDomains.length; j++) {
              if (this.domainList.bdata[i].subDomains[j].id === data.subdomain) {
                console.log(this.domainList.bdata[i].subDomains[j]);
                this.subDomain = this.domainList.bdata[i].subDomains[j].subDomain;
                console.log(this.subDomain);
              
                this.getBusinessProfile();
              }
            }
          }
        }
      });
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getUserBussinessProfile(_this.userId)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  createForm() {
    this.formfields = {
      bname: ['', Validators.compose([Validators.required])],
      bdesc: ['']
    };
    this.amForm = this.fb.group(this.formfields);
    // this.prov_curstatus = this.bProfile.status;
    if (this.bProfile) {
      this.updateForm();
    }
  }
  updateForm() {
    this.amForm.setValue({
      'bname': this.bProfile.businessName || '',
      'bdesc': this.bProfile.businessDesc || ''
    });
  }
  // Method to handle the add / edit for bprofile
  onSubmit(form_data) {
    const blankpatterm = projectConstantsLocal.VALIDATOR_BLANK;
    form_data.bname = form_data.bname.trim();
    if (blankpatterm.test(form_data.bname)) {
      this.api_error = 'Please enter the business name';
      this.document.getElementById('bname').focus();
      return;
    }
    if (form_data.bdesc) {
      form_data.bdesc = form_data.bdesc.trim();
    }
    if (form_data.bname.length > projectConstants.BUSINESS_NAME_MAX_LENGTH) {
      this.api_error = this.sharedfunctionobj.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
    } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
      this.api_error = this.sharedfunctionobj.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
    } else {
      const post_itemdata = {
        'businessName': form_data.bname,
        'businessDesc': form_data.bdesc
      };
      if (this.user_arr.userType === 'PROVIDER') {
        post_itemdata['userSubdomain'] = this.user_arr.subdomain;
      }
      // calling the method to update the primarty fields in bProfile edit page
      console.log(this.bProfile);

      if (this.bProfile) {
        this.updatePrimaryFields(post_itemdata);
      } else {
        this.createPrimaryFields(post_itemdata);
      }
    }
  }
  // updating the primary field from the bprofile edit page
  createPrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.patchUserbProfile(pdata, this.userId)
      .subscribe(
        () => {
          this.sharedfunctionobj.openSnackBar(Messages.BPROFILE_UPDATED);
          if (this.domain_fields_mandatory.length !== 0 || this.subdomain_fields_mandatory.length !== 0) {
            this.showVirtualFields = true;
          } else {
            this.redirecToBprofile();
          }
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }

  updatePrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.createUserbProfile(pdata, this.userId)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionobj.getProjectMesssages('BPROFILE_UPDATED');
          this.sharedfunctionobj.openSnackBar(Messages.BPROFILE_UPDATED);
          if ( this.domain_fields_mandatory.length !== 0 &&  this.domain_fields_mandatory.some(domain => (domain.value === '') || (domain.value === undefined))
           || this.subdomain_fields_mandatory.length !== 0 && this.subdomain_fields_mandatory.some(subdomain => (subdomain.value === '') || (subdomain.value === undefined))) {
            this.showVirtualFields = true;
          } else {
            this.redirecToBprofile();
          }

        },
        error => {
          this.sharedfunctionobj.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }
  getBusinessProfile() {
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.userMandatoryfieldArray = [];
    this.reqFields = {};
    this.provider_services.getUserBussinessProfile(this.userId)
      .subscribe(
        data => {
          this.bProfile = data;
          console.log('bProfile...' + this.bProfile);
          console.log(this.bProfile);
          if (this.bProfile) {
            this.createForm();
          }
          if (this.bProfile.businessName) {
            this.showVirtualFields = true;
          } else {
            this.showVirtualFields = false;
          }
          this.user_datastorage.set('bProfile', this.bProfile);
          const loginuserdata = this.sharedfunctionobj.getitemFromGroupStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionobj.setitemToGroupStorage('ynw-user', loginuserdata);
          console.log(this.domain);
          this.provider_services.getVirtualFields(this.domain).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.domain, this.subDomain).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getuserProfileRequiredFields(domainfields, subdomainfields);
                  this.userMandatoryfieldArray = this.provider_shared_functions.getUserAdditonalInfoMandatoryFields();
                  this.userAdditionalInfoDomainFields = this.provider_shared_functions.getUserAdditionalNonDomainMandatoryFields();
                  this.userAdditionalInfoSubDomainFields = this.provider_shared_functions.getUserAdditionalNonSubDomainMandatoryFields();
                  this.getDomainVirtualFields();
                  console.log(this.subDomain);
                  if (this.subDomain) {
                    this.getSubDomainVirtualFields();
                  }
                });
            });
          console.log(this.bProfile.logo);
          if (this.bProfile.logo) {
            this.blogo[0] = this.bProfile.logo;
            console.log(this.blogo[0]);
            const cnow = new Date();
            const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
            this.cacheavoider = dd;
            if (this.blogo[0]) {
              this.logoExist = true;
            } else {
              this.logoExist = false;
            }
            this.user_datastorage.updateProfilePicWeightage(true);
          } else {
            this.user_datastorage.updateProfilePicWeightage(false);
          }
        },
        () => {
        }
      );
  }
  getDomainVirtualFields() {
    const userWeightageObjectOfDomain: any = {};
    this.getVirtualFields(this.domain)
      .then(
        data => {
          let user_mandatorydomain = false;
          let user_mandatorydomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_fields_mandatory = this.domain_fields.filter(dom => dom.mandatory === true);
          this.domain_questions = data['questions'] || [];
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.userMandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            user_mandatorydomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                user_mandatorydomainFilled = true;
              } else {
                user_mandatorydomainFilled = false;
                return;
              }
            });
          } else {
            user_mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.userAdditionalInfoDomainFields, this.domain_fields)) {
            user_additionalInfoFilledStatus = true;
          }
          userWeightageObjectOfDomain.mandatoryDomain = user_mandatorydomain;
          userWeightageObjectOfDomain.mandatoryDomainFilledStatus = user_mandatorydomainFilled;
          userWeightageObjectOfDomain.additionalDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfDomain(userWeightageObjectOfDomain);
        }
      );
  }
  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.service.getQuestions(set_data['fields']);
            resolve(set_data);
          },
          () => {
            reject();
          }
        );
    });
  }
  setFieldValue(data, subdomin) {
    let fields = [];
    if (subdomin) {
      fields = (this.bProfile['subDomainVirtualFields'] &&
        this.bProfile['subDomainVirtualFields'][0]) ?
        this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
    } else {
      fields = (this.bProfile['domainVirtualFields']) ?
        this.bProfile['domainVirtualFields'] : [];
    }
    if (fields) {
      for (const i in data) {
        if (data[i]) {
          const row = data[i];
          if (fields[row.name]) {
            data[i]['value'] = fields[row.name];
          } else {
            delete data[i]['value'];
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }
  checkMandatoryFieldsInResultSet(domainFields, fieldname) {
    let fullyfilledStatus = true;
    domainFields.forEach(function (dom) {
      if (dom.name === fieldname) {
        if (!dom['value'] || (dom.value === undefined || dom.value == null)) {
          fullyfilledStatus = false;
          return;
        }
      }
    });
    return fullyfilledStatus;
  }
  checkAdditionalFieldsFullyFilled(additionalInfoFields, dom_subdom_list) {

    let fullyfilledStatus = true;
    additionalInfoFields.forEach(function (field) {
      if (fullyfilledStatus) {
        if (!dom_subdom_list.some(domobject => domobject.name === field)) {
          fullyfilledStatus = false;
          return;
        } else {
          dom_subdom_list.forEach(function (data_object) {
            if (data_object.name === field) {
              if (!data_object['value'] || (data_object.value === undefined || data_object.value == null)) {
                fullyfilledStatus = false;
                return;
              }
            }
          });
        }
      }
    });
    return fullyfilledStatus;
  }
  getSubDomainVirtualFields() {
    const userWeightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.domain,
      this.subDomain).then(
        data => {
          let user_mandatorysubdomain = false;
          let user_mandatorySubDomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];
          this.subdomain_fields_mandatory = this.subdomain_fields.filter(dom => dom.mandatory === true);
          this.subdomain_questions = data['questions'] || [];
          if (this.userMandatoryfieldArray.length != 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            user_mandatorysubdomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                user_mandatorySubDomainFilled = true;
              } else {
                user_mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            user_additionalInfoFilledStatus = true;
          }

          userWeightageObjectOfSubDomain.mandatorySubDomain = user_mandatorysubdomain;
          userWeightageObjectOfSubDomain.mandatorySubDomainFilledStatus = user_mandatorySubDomainFilled;
          userWeightageObjectOfSubDomain.additionalSubDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfSubDomain(userWeightageObjectOfSubDomain);
          this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;

          for (let fdIndex = 0; fdIndex < this.subdomain_fields.length; fdIndex++) {
            // tslint:disable-next-line:no-unused-expression
            if (this.subdomain_fields[fdIndex]['dataType'] === 'DataGrid') {
              for (let colIndex = 0; colIndex < this.subdomain_fields[fdIndex]['Columns'].length; colIndex++) {
                if (this.subdomain_fields[fdIndex]['Columns'][colIndex]['type'] === 'Enum') {
                  for (let enumIndex = 0; enumIndex < this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'].length; enumIndex++) {
                    this.vkeyNameMap[this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['name']] = this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['displayName'];
                  }
                }
              }
            }
          }
          this.user_datastorage.updateMandatoryAndAdditionalFieldWeightage();

        }
      );
  }
  getFieldQuestion(field_key = null, type = 'domain_questions') {
    const questions = (type === 'subdomain_questions') ? this.subdomain_questions : this.domain_questions;
    if (field_key != null) {
      const field = [];
      for (const que of questions) {
        if (que.key === field_key) {
          field.push(que);
        }
      }
      return field;
    }
  }
  onDomainFormSubmit(post_data) {
    this.provider_services.updateDomainFields(this.userId, post_data)
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  onSubDomainFormSubmit(post_data) {
    this.provider_services.updatesubDomainFields(this.userId, post_data, this.subDomainId)
      .subscribe(
        (data) => {
          this.getBusinessProfile();
          this.blogo = [];
          this.blogo = data;
          // calling function which saves the business related details to show in the header
          const today = new Date();
          const tday = today.toString().replace(/\s/g, '');
          const blogo = this.blogo.url + '?' + tday;
          const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
            || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', blogo || '');
          const pdata = { 'ttype': 'updateuserdetails' };
          this.user_datastorage.updateProfilePicWeightage(true);
          this.sharedfunctionobj.sendMessage(pdata);
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  addDynamicField(field, type) {
    if (field.dataType === 'DataGrid') {
      this.editGridDynamicField(field.name, type, null);
    } else {
      this.editDynamicField(field.name, type);
    }
  }
  editGridDynamicField(field_name, type, index = 0) {
    const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
    if (index !== null) {
      const column = field[0]['columns'][index] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);
      const selected_row = field[0]['value'][index] || [];
      field[0]['value'] = [];
      field[0]['value'].push(selected_row);
    } else {
      const column = field[0]['columns'][0] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);
      column.map((e) => { delete e.value; });
    }
    this.showDynamicFieldPopup(field, type, index);
  }
  editDynamicField(field_name, type) {
    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);
  }
  showDynamicFieldPopup(field, type, grid_row_index = null) {
    this.dynamicdialogRef = this.dialog.open(ProviderUserBprofileSearchDynamicComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: type,
        questions: field,
        bProfile: this.bProfile,
        grid_row_index: grid_row_index,
        userId: this.userId,
        subDomainId: this.subDomainId,
        subdomain: this.subDomain
      }
    });
    this.dynamicdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBussinessProfileApi()
            .then(
              data => {
                this.bProfile = data;
                if (type === 'domain_questions') {
                  this.getDomainVirtualFields();
                } else {
                  this.getSubDomainVirtualFields();
                }
              },
              () => {

              }
            );
        }
      }
    });
  }
  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
    this.error_msg = '';
    if (input.files && input.files[0]) {
      for (const file of input.files) {
        this.success_error = this.sharedfunctionobj.imageValidation(file);
        if (this.success_error === true) {
          const reader = new FileReader();
          this.item_pic.files = input.files[0];
          this.selitem_pic = input.files[0];
          const fileobj = input.files[0];
          reader.onload = (e) => {
            this.item_pic.base64 = e.target['result'];
          };
          reader.readAsDataURL(fileobj);
          if (this.user_arr.status === 'ACTIVE' || this.user_arr.status === 'INACTIVE') { // case now in bprofile edit page
            // generating the data to be submitted to change the logo
            const submit_data: FormData = new FormData();
            submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
            const propertiesDet = {
              'caption': 'Logo'
            };
            const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
            submit_data.append('properties', blobPropdata);
            this.uploadLogo(submit_data);
          }
        } else {
          this.error_list.push(this.success_error);
          if (this.error_list[0].type) {
            this.error_msg = 'Selected image type not supported';
          } else if (this.error_list[0].size) {
            this.error_msg = 'Please upload images with size less than 15mb';
          }
          // this.error_msg = 'Please upload images with size < 5mb';
          this.sharedfunctionobj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
        }
      }
    }
  }
  uploadLogo(passdata) {
    // this.provider_services.uploadLogo(passdata)
    this.provider_services.uploaduserLogo(passdata, this.userId)
      .subscribe(
        data => {
          this.getBusinessProfile();
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.api_error = error.error;
        }
      );
  }
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.item_pic.base64) {
      this.profimg_exists = true;
      return this.item_pic.base64;
    } else {
      if (this.blogo[0]) {
        this.profimg_exists = true;
        // const today = new Date();
        // logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
        logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }
  }
  changeProPic() {
    this.notedialogRef = this.dialog.open(ProPicPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'userId': this.userId,
        'userdata': this.user_arr
      }
    });
    this.notedialogRef.afterClosed().subscribe(result => {
      this.getUser();
    });
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
