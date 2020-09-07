import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../app.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProPicPopupComponent } from '../../bprofile/pro-pic-popup/pro-pic-popup.component';
import { ProviderBprofileSearchDynamicComponent } from '../../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { QuestionService } from '../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html'
})
export class AboutMeComponent implements OnInit {


  showVirtualFields = false;
  showMandatory: boolean;
  subdomain_fields_mandatory = [];
  domain_fields_mandatory = [];
  dynamicdialogRef: MatDialogRef<ProviderBprofileSearchDynamicComponent, any>;

  profile_name_summary_cap = Messages.SEARCH_PRI_PROF_NAME_SUMMARY_CAP;
  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  profile_summary_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  aboutmeForm: FormGroup;
  api_error = null;
  api_success = null;
  show_schedule_selection = false;
  bProfile = null;
  formfields;
  disabled_field = false;
  prov_curstatus = '';
  disableButton = false;
  api_loading = true;
  add_cap = Messages.ADD_BTN;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  blogo: any = [];
  profimg_exists = false;
  domain_fields_nonmandatory: any;
  subdomain_fields_nonmandatory: any[];
  item_pic = {
    files: [],
    base64: null
  };
  cacheavoider = '';
  notedialogRef: any;
  logoExist = false;
  // mandatory fields
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  mandatoryfieldArray: any = [];
  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  vkeyNameMap = {};
  subdomain: any;
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };
  success_error = null;
  error_list = [];
  selitem_pic = '';
  error_msg = '';
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  constructor(
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private dialog: MatDialog,
    private provider_datastorageobj: ProviderDataStorageService,
    private qservice: QuestionService,
    private provider_shared_functions: ProviderSharedFuctions,
    @Inject(DOCUMENT) public document,
  ) {
  }
  ngOnInit() {
    this.getProviderLogo();
    this.getBusinessProfile();
  }
  // Creates the form element
  createForm() {
    this.formfields = {
      bname: [{ value: this.bProfile.businessName, disabled: false }, Validators.compose([Validators.required])],
      // shortname: [{ value: this.bProfile.shortName, disabled: false }],
      // bdesc: [{ value: this.bProfile.businessDesc, disabled: false }, Validators.compose([Validators.required])]
      bdesc: [{ value: this.bProfile.businessDesc, disabled: false },  Validators.compose([Validators.required])]
    };
    this.prov_curstatus = this.bProfile.status;
    this.aboutmeForm = this.fb.group(this.formfields);
  }

  // resets the error messages holders
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
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
    form_data.bdesc = form_data.bdesc.trim();
      if (form_data.bdesc !== '' && form_data.bdesc.trim() === '') {
      this.api_error = 'Please enter the business description';
      this.document.getElementById('bdesc').focus();
      return;
     }


    // if (blankpatterm.test(form_data.bdesc)) {
    //  this.api_error = 'Please enter the business description';
    //  this.document.getElementById('bdesc').focus();
    //  return;
    // }
    if (form_data.bname.length > projectConstants.BUSINESS_NAME_MAX_LENGTH) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
    } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
    } else {
      const post_itemdata = {
        'businessName': form_data.bname,
        'businessDesc': form_data.bdesc
        // ,
        // 'shortName': form_data.shortname
      };
      console.log('bProdile..' + this.bProfile);
      if (this.bProfile.businessName) {
        this.UpdatePrimaryFields(post_itemdata);
      } else {
        this.createPrimaryFields(post_itemdata);
      }
      // calling the method to update the primarty fields in bProfile edit page

    }
  }
  // saving the primary fields from the bprofile create page
  createPrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.updatePrimaryFields(pdata)
      .subscribe(
        () => {

          this.sharedfunctionObj.openSnackBar(Messages.BPROFILE_UPDATED);
          this.disableButton = false;
          console.log(this.domain_fields_mandatory.length);
          console.log(this.subdomain_fields_mandatory.length);
          if (this.domain_fields_mandatory.length !== 0 || this.subdomain_fields_mandatory.length !== 0) {
            this.showVirtualFields = true;
          } else {
            this.redirecToBprofile();
          }

        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  uploadLogo(passdata) {
    this.provider_services.uploadLogo(passdata)
      .subscribe(
        data => {
          this.provider_datastorageobj.updateProfilePicWeightage(true);
          //   this.data.logoExist  = true;
        });
  }
  // updating the primary field from the bprofile edit page
  UpdatePrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.updatePrimaryFields(pdata)
      .subscribe(
        () => {
          // this.api_success = this.sharedfunctionObj.getProjectMesssages('BPROFILE_UPDATED');
          this.sharedfunctionObj.openSnackBar(Messages.BPROFILE_UPDATED);
          this.disableButton = false;
          setTimeout(() => {
            this.redirecToBprofile();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }
  // gets the bprofile details
  getBusinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bProfile = data;
          if (this.bProfile) {
            this.createForm();
          }
          if (this.bProfile.businessName) {
            this.showVirtualFields = true;
          } else {
            this.showVirtualFields = false;
          }
          this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['subDomain']).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields, this.bProfile['serviceSubSector']['subDomain']);
                  this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
                  this.additionalInfoDomainFields = this.provider_shared_functions.getAdditionalNonDomainMandatoryFields();
                  this.additionalInfoSubDomainFields = this.provider_shared_functions.getAdditionalNonSubDomainMandatoryFields();
                  this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
                  this.getProviderLogo();
                  this.getDomainVirtualFields();
                  if (this.bProfile['serviceSubSector']['subDomain']) {
                    this.getSubDomainVirtualFields();
                  }

                });



            });
          this.provider_datastorageobj.set('bProfile', data);
          // getting the user details saved in local storage
          const loginuserdata = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionObj.setitemToGroupStorage('ynw-user', loginuserdata);
          // this.getProviderLogo();
        },
        () => {
        }
      );
  }

  redirecToBprofile() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile']);
    //  this._location.back();
  }
  // get the logo url for the provider
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
          console.log(this.blogo);
          const cnow = new Date();
          const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
          this.cacheavoider = dd;
          if (this.blogo[0]) {
            this.logoExist = true;
          } else {
            this.logoExist = false;
          }
          this.provider_datastorageobj.updateProfilePicWeightage(this.logoExist);
          // const subsectorname = this.sharedfunctionObj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          // // calling function which saves the business related details to show in the header
          // this.sharedfunctionObj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
          //   || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', logo);

          // const pdata = { 'ttype': 'updateuserdetails' };
          // this.sharedfunctionObj.sendMessage(pdata);
        },
        () => {

        }
      );
  }
  // display logo
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.item_pic.base64) {
      this.profimg_exists = true;

      return this.item_pic.base64;
    } else {
      if (this.blogo[0]) {
        this.profimg_exists = true;
        logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionObj.showlogoicon(logourl);
    }
  }
  // profile pic popup section
  changeProPic() {
    this.notedialogRef = this.dialog.open(ProPicPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: { 'userdata': this.bProfile }
    });
    this.notedialogRef.afterClosed().subscribe(result => {
      this.getProviderLogo();
    });
  }


  // mandatory fields

  getDomainVirtualFields() {
    const weightageObjectOfDomain: any = {};
    const checkArray = [];
    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          let mandatorydomain = false;
          let mandatorydomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_fields_mandatory = this.domain_fields.filter(dom => dom.mandatory === true);
          console.log('domain mandatory..' + JSON.stringify(this.domain_fields_mandatory));
          this.domain_questions = data['questions'] || [];
          this.domain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.mandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            mandatorydomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                mandatorydomainFilled = true;
              } else {
                mandatorydomainFilled = false;
                return;
              }
            });


          } else {
            mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoDomainFields, this.domain_fields)) {
            additionalInfoFilledStatus = true;
          }
          weightageObjectOfDomain.mandatoryDomain = mandatorydomain;
          weightageObjectOfDomain.mandatoryDomainFilledStatus = mandatorydomainFilled;
          weightageObjectOfDomain.additionalDomainFullyFilled = additionalInfoFilledStatus;
          this.provider_datastorageobj.setWeightageObjectOfDomain(weightageObjectOfDomain);
          this.provider_datastorageobj.updateMandatoryAndAdditionalFieldWeightage();


        }
      );
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

  addDynamicField(field, type) {
    if (field.dataType === 'DataGrid') {
      this.editGridDynamicField(field.name, type, null);
    } else {
      this.editDynamicField(field.name, type);
    }
  }
  editGridDynamicField(field_name, type, index = 0) {
    const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
    // We need to pass only selected row to edit page
    // Create the data for passing to dynamicform
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
  deleteGridDynamicField(field_name, type = 'domain_questions', index = 0) {
    const pre_value = (type === 'domain_questions') ? JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
      JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    // JSON.parse(JSON.stringify used to remove reference
    const grid_list = pre_value[field_name] || [];
    if (grid_list.length === 1 && index === 0) {
      delete pre_value[field_name];
    } else {
      grid_list.splice(index, 1);
      pre_value[field_name] = grid_list;
    }
    if (type === 'domain_questions') {
      this.onDomainFormSubmit(pre_value);
    } else if (type === 'subdomain_questions') {
      this.onSubDomainFormSubmit(pre_value);
    }
  }
  editDynamicField(field_name, type) {
    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);
  }
  showDynamicFieldPopup(field, type, grid_row_index = null) {
    this.dynamicdialogRef = this.dialog.open(ProviderBprofileSearchDynamicComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: type,
        questions: field,
        bProfile: this.bProfile,
        grid_row_index: grid_row_index
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

  getSubDomainVirtualFields() {
    const checkArray = [];
    const weightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          let mandatorysubdomain = false;
          let mandatorySubDomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];
          // this.subdomain_fields_nonmandatory = this.subdomain_fields.filter(dom => dom.mandatory === false);
          this.subdomain_fields_mandatory = this.subdomain_fields.filter(dom => dom.mandatory === true);
          console.log('subdomain mandatory..' + JSON.stringify(this.subdomain_fields_mandatory));
          this.subdomain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.subdomain_questions = data['questions'] || [];
          if (this.mandatoryfieldArray.length !== 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            mandatorysubdomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                mandatorySubDomainFilled = true;
              } else {
                mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            additionalInfoFilledStatus = true;
          }

          weightageObjectOfSubDomain.mandatorySubDomain = mandatorysubdomain;
          weightageObjectOfSubDomain.mandatorySubDomainFilledStatus = mandatorySubDomainFilled;
          weightageObjectOfSubDomain.additionalSubDomainFullyFilled = additionalInfoFilledStatus;
          this.provider_datastorageobj.setWeightageObjectOfSubDomain(weightageObjectOfSubDomain);
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

          this.provider_datastorageobj.updateMandatoryAndAdditionalFieldWeightage();
        }
      );
  }


  getdispVal(typ, field) {
    let retfield = '';
    let passArray = [];
    if (typ === 'domain') {
      passArray = this.domain_fields;
    } else if (typ === 'subdomain') {
      passArray = this.subdomain_fields;
    }
    let str = '';
    if (field.value !== undefined) {
      if (field.dataType === 'Enum') {
        retfield = this.getFieldDetails(passArray, field.value, field.name);
      } else if (field.dataType === 'EnumList') {
        for (let i = 0; i < field.value.length; i++) {
          if (str !== '') {
            str += ', ';
          }
          // str += this.sharedfunctionobj.firstToUpper(fld.value[i]);
          str += this.getFieldDetails(passArray, field.value[i], field.name);
        }
        retfield = str;
      } else {
        retfield = field.value;
      }
    }
    return retfield;
  }

  getFieldDetails(passedArray, fieldvalue, fieldname) {
    let retfield;
    if (fieldvalue !== undefined) {
      for (let i = 0; i < passedArray.length; i++) {
        if (fieldname === passedArray[i].name) {
          for (let j = 0; j < passedArray[i].enumeratedConstants.length; j++) {
            if (fieldvalue === passedArray[i].enumeratedConstants[j].name) {
              retfield = passedArray[i].enumeratedConstants[j].displayName;
            }
          }
        }
      }
    }
    return retfield;
  }
  showValueswithComma(fld) {
    let str = '';
    if (fld.value !== undefined) {
      for (let i = 0; i < fld.value.length; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += this.sharedfunctionObj.firstToUpper(fld.value[i]);
      }
      return str;
    }
  }
  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.qservice.getQuestions(set_data['fields']);
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
    this.provider_services.updateDomainSubDomainFields(post_data,
      this.bProfile['serviceSector']['domain'])
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  onSubDomainFormSubmit(post_data) {
    this.provider_services.updateDomainSubDomainFields(post_data, null,
      this.bProfile['serviceSubSector']['subDomain'])
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  } 
  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
    if (input.files && input.files[0]) {
      for (const file of input.files) {
        this.success_error = this.sharedfunctionObj.imageValidation(file);
        if (this.success_error === true) {
          const reader = new FileReader();
          this.item_pic.files = input.files[0];
          this.selitem_pic = input.files[0];
          const fileobj = input.files[0];
          reader.onload = (e) => {
            this.item_pic.base64 = e.target['result'];
          };
          reader.readAsDataURL(fileobj);
          if (this.bProfile.status === 'ACTIVE' || this.bProfile.status === 'INACTIVE') { // case now in bprofile edit page
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
            this.error_msg = 'Please upload images with size less than 5mb';
          }
          // this.error_msg = 'Please upload images with size < 5mb';
          this.sharedfunctionObj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
        }
      }
    }
  }
}