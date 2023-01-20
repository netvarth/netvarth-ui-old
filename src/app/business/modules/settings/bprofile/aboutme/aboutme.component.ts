import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../services/provider-services.service';
import { ProviderDataStorageService } from '../../../../services/provider-datastorage.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../app.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { ConfirmBoxComponent } from "../../../../../shared/components/confirm-box/confirm-box.component";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProPicPopupComponent } from '../../bprofile/pro-pic-popup/pro-pic-popup.component';
import { ProviderSharedFuctions } from '../../../../functions/provider-shared-functions';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { QuestionService } from '../../../../../shared/modules/dynamic-form/dynamic-form-question.service';
import { ProviderBprofileSearchDynamicComponent } from '../../../provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { ImageTransform } from "./interfaces/image-transform.interface";
import { FileService } from "../../../../../shared/services/file-service";
import { ImageCroppedEvent } from "ngx-image-cropper";
@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']

})
export class AboutMeComponent implements OnInit {

  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  showVirtualFields = false;
  showMandatory: boolean;
  subdomain_fields_mandatory = [];
  domain_fields_mandatory = [];
  dynamicdialogRef: MatDialogRef<ProviderBprofileSearchDynamicComponent, any>;
  change_cap = Messages.BPROFILE_CHANGE_CAP;
  profile_name_summary_cap = Messages.SEARCH_PRI_PROF_NAME_SUMMARY_CAP;
  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  business_user_name_cap = Messages.SEARCH_PRI_BUISINESS_USER_NAME_CAP;
  profile_summary_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  aboutmeForm: UntypedFormGroup;
  api_error = null;
  api_success = null;
  success_error = null;
  error_list = [];
  error_msg = "";
  showProfile = false;
  spinner_load = false;
  show_schedule_selection = false;
  bProfile = null;
  formfields;
  disabled_field = false;
  prov_curstatus = '';
  disableButton = false;
  api_loading = true;
  add_cap = Messages.ADD_BTN;
  profile_pic_cap = Messages.BUSINESS_PICTURE_CAP;
  pic_cap = Messages.BUSINESS_PICTURE_CAP;
  blogo: any = [];
  profimg_exists = false;
  domain_fields_nonmandatory: any;
  subdomain_fields_nonmandatory: any[];
  imageChangedEvent: any;
  imgType = false;
  fileToReturn: any;
  croppedImage: any;
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  @ViewChild("closebutton") closebutton;
  loadSymbol = false;
  imageToShow = "../../assets/images/no_image_icon.png" ;
   businessLogo_pic = {
    files: [],
    base64: null,
    caption: [],
  };
  selitem_pic = "";
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
  active_user:any;
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  logo:any;
  constructor(
    private fb: UntypedFormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private routerobj: Router,
    private dialog: MatDialog,
    private provider_datastorageobj: ProviderDataStorageService,
    private qservice: QuestionService,
    private provider_shared_functions: ProviderSharedFuctions,
    @Inject(DOCUMENT) public document,
    private fileService: FileService,

  ) {
  }
  ngOnInit() {
    this.getProviderLogo();
    this.getBusinessProfile();
    this.getBusinessLogo();
    this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");

  }
  // Creates the form element
  createForm() {
    this.formfields = {
      bname: [{ value: this.bProfile.businessName, disabled: false }, Validators.compose([Validators.required])],
      busername: [{ value: this.bProfile.businessUserName, disabled: false }],
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
      // this.api_error = this.wordProcessor.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
      this.snackbarService.openSnackBar(Messages.BUSINESS_NAME_MAX_LENGTH_MSG, { 'panelClass': 'snackbarerror' });
    } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
      // this.api_error = this.wordProcessor.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
      this.snackbarService.openSnackBar(Messages.BUSINESS_DESC_MAX_LENGTH_MSG, { 'panelClass': 'snackbarerror' });
    } else {
      const post_itemdata = {
        'businessName': form_data.bname,
        'businessDesc': form_data.bdesc,
        'businessUserName': form_data.busername
      };
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
          this.snackbarService.openSnackBar(Messages.BPROFILE_ABOUT_UPDATED);
          this.disableButton = false;
          if (this.domain_fields_mandatory.length !== 0 || this.subdomain_fields_mandatory.length !== 0) {
            this.showVirtualFields = true;
          } else {
            this.redirecToBprofile();
          }

        },
        error => {
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
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
          // this.api_success = this.wordProcessor.getProjectMesssages('BPROFILE_UPDATED');
          this.snackbarService.openSnackBar(Messages.BPROFILE_ABOUT_UPDATED);
          this.disableButton = false;
          setTimeout(() => {
            this.redirecToBprofile();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
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
          const loginuserdata = this.groupService.getitemFromGroupStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.groupService.setitemToGroupStorage('ynw-user', loginuserdata);
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
          console.log("Blog data :",this.blogo);
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
  getBusinessLogo(){
    this.provider_services.getBusinessLogo().subscribe((res)=>{
      console.log("ressss :",res);
      this.logo = res;
      // this.showLogo();
    })
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

  showLogo() {
    let logourl = '';
    this.profimg_exists = false;
    // if (this.businessLogo_pic.base64) {
    //  this.profimg_exists = true;
    //   return this.businessLogo_pic.base64;
    // } else {
      if (this.logo && this.logo[0]) {
        this.profimg_exists = true;
        logourl = (this.logo[0].s3path) ? this.logo[0].s3path : '';
      }
     return this.sharedfunctionObj.showlogoicon(logourl);
    // }
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
          // str += this.wordProcessor.firstToUpper(fld.value[i]);
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
        str += this.wordProcessor.firstToUpper(fld.value[i]);
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
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }



  imageSelect1(event: any): void {
    this.loadSymbol = true;
    this.imageChangedEvent = event;
  }
  clearModalData(source?) {
    this.imageChangedEvent = "";
    if (source) {
      this.imgType = true;
    }
    this.api_success = false;
    this.api_error = false;
  }
  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
    this.error_msg = "";
    if (input.files && input.files[0]) {
      for (const file of input.files) {
        this.success_error = this.fileService.imageValidation(file);
        if (this.success_error === true) {
          const reader = new FileReader();
          this.businessLogo_pic.files = input.files[0];
          this.selitem_pic = input.files[0];
          const fileobj = input.files[0];
          reader.onload = (e) => {
            this.businessLogo_pic.base64 = e.target["result"];
          };
          reader.readAsDataURL(fileobj);
          // if (this.user_arr.status === 'ACTIVE' || this.user_arr.status === 'INACTIVE') { // case now in bprofile edit page
          // generating the data to be submitted to change the logo
          const submit_data: FormData = new FormData();
          submit_data.append(
            "files",
            this.selitem_pic,
            this.selitem_pic["name"]
          );
          // const propertiesDet = {
          //   'caption': ''
          // };
          const propertiesDetob = {};
          // let i = 0;
          //  for (const pic of this.item_pic.files) {
          // submit_data.append('files', pic, pic['name']);
          let properties = {};
          properties = {
            caption: this.businessLogo_pic.caption[0] || "",
            displayImage: true,
          };
          propertiesDetob[0] = properties;
          //  i++;
          // }

          const propertiesDet = {
            propertiesMap: propertiesDetob,
          };
          const blobPropdata = new Blob([JSON.stringify(propertiesDet)], {
            type: "application/json",
          });
          submit_data.append("properties", blobPropdata);
         // this.updateItemGroup(this.itemGroupId, submit_data);
          // }
        } else {
          this.error_list.push(this.success_error);
          if (this.error_list[0].type) {
            this.error_msg = "Selected image type not supported";
          } else if (this.error_list[0].size) {
            this.error_msg = "Please upload images with size less than 15mb";
          }
          // this.error_msg = 'Please upload images with size < 5mb';
          this.snackbarService.openSnackBar(this.error_msg, {
            panelClass: "snackbarerror",
          });
        }
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.loadSymbol = false;
    this.fileToReturn = "";
    this.croppedImage = event.base64; // preview
    this.fileToReturn = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name
    );
    return this.fileToReturn;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  base64ToFile(imgdata, filename) {
    const arr = imgdata.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }
  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }
  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }
  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }
  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  // Save pro pic
  saveImages() {
    console.log("save imgsss");
    this.spinner_load = true;
    const file = this.fileToReturn;
    this.success_error = null;
    this.error_list = [];
    this.error_msg = "";
    if (file) {
      console.log("inside file");
      this.success_error = this.fileService.imageValidation(file);
      if (this.success_error === true) {
        console.log("inside success err");
        const reader = new FileReader();
        this.businessLogo_pic.files = file;
        this.selitem_pic = file;
        const fileobj = file;
        reader.onload = (e) => {
          this.businessLogo_pic.base64 = e.target["result"];
        };
        console.log("File obj:", fileobj);
        reader.readAsDataURL(fileobj);
        // let i = 0;
        let dataToSend = [];
            const size = fileobj["size"] / 1024;
            const data = {
              owner: this.active_user.id,
              fileName: fileobj["name"],
              fileSize: size / 1024,
              action:'add',
              caption: this.businessLogo_pic.caption[0] ? this.businessLogo_pic.caption[0] : "",
              fileType: fileobj["type"].split("/")[1],
              order: 0
            };
            dataToSend.push(data);
        console.log("After submit :", dataToSend);
      //  if (this.dept_data.departmentId) {
          this.uploadBusinessLogo(dataToSend);
        // }
      } else {
        this.error_list.push(this.success_error);
        if (this.error_list[0].type) {
          this.error_msg = "Selected image type not supported";
        } else if (this.error_list[0].size) {
          this.error_msg = "Please upload images with size less than 15mb";
        }
        this.snackbarService.openSnackBar(this.error_msg, {
          panelClass: "snackbarerror",
        });
      }
    } else {
      this.error_msg = "Selected image type not supported";
      this.snackbarService.openSnackBar(this.error_msg, {
        panelClass: "snackbarerror",
      });
    }
  }
  uploadBusinessLogo(passdata) {
    // this.provider_services.uploadLogo(passdata)
    console.log("passdata :", passdata);
    this.provider_services
      .uploadBusinessIcon(passdata)
      .subscribe(
        (s3UrlsObj: any) => {
          console.log("Res :", s3UrlsObj);
          this.api_success = Messages.BUSIN_ICON_UPLOAD;
          this.spinner_load = false;
          this.uploadFilesToS3(s3UrlsObj);
          setTimeout(() => {
            this.closeGroupDialog();
          //  this.redirecTo();
          }, 2000);
        },
        (error) => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror",
          });
          // this.api_error = error.error;
        }
      );
  }
  uploadFile(file, url) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      _this.provider_services.videoaudioS3Upload(file, url).subscribe(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }
  async uploadFilesToS3(s3Urls) {
    const _this = this;
    let count = 0;
    //for (let i = 0; i < s3Urls.length; i++) {
      // this.businessLogo_pic["files"][s3Urls[i].orderId]
      await _this
        .uploadFile(
          _this.businessLogo_pic["files"],
          s3Urls[0].url
        )
        .then(() => {
          count++;
          console.log("Count=", count);
          console.log(s3Urls.length);
          //this.ngOnChanges();
            // this.getDepartmentDetailsById(this.dept_data.departmentId);
            _this.getBusinessLogo();
        //   if (count === s3Urls.length) {
            _this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, {
              panelClass: "snackbarnormal"
            });
            // this.router.navigate(['provider', 'settings', 'general',
            // 'department', this.dept_data.departmentId]);
            _this.businessLogo_pic = { files: [], base64: [], caption: [] };
            // _this.getfiles();
            // _this.apiloading = false;
        //   }
        });
   // }
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
    this.api_success = "";
  }

  deleteBusinessLogo(logo) {
    console.log("logo :",logo);
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: "Do you want to remove this business icon?",
      },
    });
    dialogrefd.afterClosed().subscribe((result) => {
      if (result) {
    let dataToSend = [];
        const data = {
          owner: logo[0].owner,
          fileName: logo[0].fileName,
          fileSize: logo[0].fileSize,
          action:'remove',
          caption: logo[0].caption,
          fileType: logo[0].fileType,
          order: logo[0].order
        };
        dataToSend.push(data);
        console.log("deleting data :",dataToSend);
        this.provider_services
          .removeBusinessIcon(dataToSend)
          .subscribe((data) => {
            if(data){
              // this.getBusinessLogo();
              this.profimg_exists = false;
              this.logo = [];
            }
            console.log("Data",data);
            this.snackbarService.openSnackBar('Business icon deleted successfully', {
              panelClass: "snackbarnormal",
            });
          },
          (error) => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror",
            });
          }
          );
    }
    });
  }
}
