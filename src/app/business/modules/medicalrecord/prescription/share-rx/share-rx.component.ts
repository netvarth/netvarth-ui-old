import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { MedicalrecordService } from '../../medicalrecord.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { MedicalrecordService } from '../../medicalrecord.service';


@Component({
  selector: 'app-share-rx',
  templateUrl: './share-rx.component.html',
  styleUrls: ['./share-rx.component.css']
})
export class ShareRxComponent implements OnInit {
  patientId: any;
  email_id = '';
  msgreceivers: any = [];
  spId: any;
  mrId;
  amForm: FormGroup;
  deptName;
  bname;
  location;
  customer_label: any;
  qname: any;
  qstarttime: any;
  qendtime: any;
  schedulename: any;
  appttime: any;
  appmtDate: any;
  spfname: any;
  splname: any;
  Schedulestime: any;
  Scheduleetime: any;
  sms = false;
  email = false;
  chekintype: any;
  consumer_fname: any;
  consumer_lname: any;
  serv_name: any;
  date: string;
  time: any;
  consumer_email: any;
  api_loading = false;
  phone = '';
  SEND_MESSAGE = '';
  settings: any = [];
  showToken = false;
  pushnotify = false;
  disableButton;
  sharewith;
  showcustomId = false;
  iconClass: string;
  customid = '';
  api_error = null;
  api_success = null;
  customerDetail: any;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  drugList: any = [];
  blogo: any = [];
  profimg_exists = false;
  cacheavoider = '';
  signurl = '';
  imagedetails: any;
  provider_user_Id: any;
  userdata: any;
  bdata: any;
  address: any;
  mobile: any;
  type;
  disable = false;
  curDate = new Date();
  accountType: any;
  userbname: any;
  loading = true;
  showthirdparty = false;
  thirdpartyphone = '';
  thirdpartyemail = '';
  constructor(
    public dialogRef: MatDialogRef<ShareRxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    private shared_functions: SharedFunctions,
    private fb: FormBuilder,
    public provider_services: ProviderServices,
    private medicalService: MedicalrecordService
  ) {

    this.provider_user_Id = this.medicalService.getDoctorId();
    this.mrId = this.data.mrId;
    this.type = this.data.type;
    this.patientId=this.data.patientId;
    this.getPatientDetails(this.patientId);


  }
  ngOnInit() {

    const cnow = new Date();
    const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
    this.cacheavoider = dd;
    this.sharewith = 0;
    this.msgreceivers = [{ 'id': 0, 'name': 'Patient' },{ 'id': 1, 'name': 'Thirdparty' }];
    this.createForm();
    this.getMrprescription();
    this.getBussinessProfileApi();
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType === 'BRANCH') {
      this.getBusinessProfile();
    }
  }
  createForm() {
    this.sharewith = 0;
    this.amForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });

  }
  back() {
    this.dialogRef.close();
  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          console.log(response);
          this.loading = false;
          this.customerDetail = response[0];
           if (this.customerDetail.email) {
              this.email_id = this.customerDetail.email;
            }
            if (this.customerDetail.phoneNo) {
              this.phone = this.customerDetail.phoneNo;
            }

  });
}
  onSubmit(formdata) {
    this.disable = true;
    this.resetApiErrors();
    const vwofrx = document.getElementById('sharerxview');
    let rxview = '';
    rxview += '<html style="width: 210mm; height: 297mm; font-size: 1rem; font-family: \'Poppins\', sans-serif !important;"><head><title></title>';
    rxview += '</head><body >';
    rxview += vwofrx.innerHTML;
    rxview += '</body></html>';
    console.log(rxview);
    console.log(formdata);
    console.log(this.sharewith);
    console.log(this.customid);
    if (this.sharewith !== 0 ) {
      if (this.thirdpartyphone === '' && this.thirdpartyemail === '') {
        this.api_error = 'Please enter a phone number or email';
        this.disable = false;
                return;
      }
      if (this.thirdpartyphone !== '') {
        const curphone = this.thirdpartyphone;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const result = pattern.test(curphone);
        if (!result) {
          this.api_error = this.shared_functions.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID');
          // 'Please enter a valid mobile phone number';
          this.disable = false;
          return;
        }
        const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const result1 = pattern1.test(curphone);
        if (!result1) {
          this.api_error = this.shared_functions.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS');
          // 'Mobile number should have 10 digits';
          this.disable = false;
          return;
        }
      }
      if (this.thirdpartyemail !== '') {
        const curemail = this.thirdpartyemail.trim();
        const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
        const result2 = pattern2.test(curemail);
        if (!result2) {
          this.api_error = this.shared_functions.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID');
          // 'Please enter a valid email id';
          this.disable = false;
          return;
        }
      }
    }
    if (this.sharewith === 0 ) {
      if (!this.sms && !this.email && !this.pushnotify) {
        this.api_error = 'share via options are not selected';
        this.disable = false;
        return;
      }
    }
    if (this.type === 'adddrug') {
      if (this.sharewith !== 0 ) {
        const passData = {
          'message': formdata.message,
          'html': rxview,
          'shareThirdParty': {
            'phone': this.thirdpartyphone,
            'email': this.thirdpartyemail
          }
        };
        this.provider_services.shareRxforThirdparty(this.mrId, passData)
          .subscribe((data) => {
            this.shared_functions.openSnackBar('Prescription shared successfully');
            this.dialogRef.close();
          }, error => {
            this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
          });

      } else if (this.sharewith === 0) {
        const passData = {
          'message': formdata.message,
          'html': rxview,
          'medium': {
            'email': this.email,
            'sms': this.sms,
            'pushNotification': this.pushnotify
          }
        };
        this.provider_services.shareRx(this.mrId, passData)
          .subscribe((data) => {
            this.shared_functions.openSnackBar('Prescription shared successfully');
            this.dialogRef.close();
          }, error => {
            this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
          });
      }
    } else {
      if (this.sharewith !== 0 ) {
        const passData = {
          'message': formdata.message,
          'html': '',
          'shareThirdParty': {
            'phone': this.thirdpartyphone,
            'email': this.thirdpartyemail
          }
        };
        this.provider_services.shareRxforThirdparty(this.mrId, passData)
          .subscribe((data) => {
            this.shared_functions.openSnackBar('Prescription shared successfully');
            this.dialogRef.close();
          }, error => {
            this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
          });

      } else if (this.sharewith === 0) {
        const passData = {
          'message': formdata.message,
          'html': '',
          'medium': {
            'email': this.email,
            'sms': this.sms,
            'pushNotification': this.pushnotify
          }
        };
        this.provider_services.shareRx(this.mrId, passData)
          .subscribe((data) => {
            this.shared_functions.openSnackBar('Prescription shared successfully');
            this.dialogRef.close();
          }, error => {
            this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            this.disable = false;
          });
      }
    }
  }
  onUserSelect(event) {
    this.resetApiErrors();
    this.customid = '';
    console.log(event);
    console.log(this.sharewith);
    if (event.value !== 0) {
      this.showthirdparty = true;
    } else {
      this.showthirdparty = false;
      // if (this.customerDetail.email) {
      //   this.email_id = this.customerDetail.email;
      // }
      // if (this.customerDetail.phoneNo) {
      //   this.phone = this.customerDetail.phoneNo;
      // }
    }

  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  getMrprescription() {
    if (this.mrId) {
      this.provider_services.getMRprescription(this.mrId)
        .subscribe((data: any) => {

          if (data[0].keyName) {
            console.log(data);
          } else {
            this.drugList = data;
            this.getDigitalSign();
          }
          this.getProviderLogo();
        },
          error => {
            this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
        },
        () => {

        }
      );
  }
  getDigitalSign() {
    if (this.provider_user_Id) {
      this.provider_services.getDigitalSign(this.provider_user_Id)
        .subscribe((data: any) => {
          console.log(data);
          this.imagedetails = JSON.parse(data);
          console.log(this.imagedetails);
          this.signurl = this.imagedetails.url;
          console.log(this.signurl);
        },
          error => {
            // this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  showdigitalsign() {
    let logourl = '';
    if (this.signurl) {
      logourl = (this.signurl) ? this.signurl + '?' + this.cacheavoider : '';
    }
    return this.shared_functions.showlogoicon(logourl);

  }
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.blogo[0]) {
      this.profimg_exists = true;
      logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
    }
    return this.shared_functions.showlogoicon(logourl);
  }
  getBusinessProfile() {
    if (this.provider_user_Id) {
      this.provider_services.getUserBussinessProfile(this.provider_user_Id)
        .subscribe((data: any) => {
          this.userdata = data;
          this.userbname = this.userdata.businessName;
          console.log(this.userdata);
        },
      );
    }
  }
  getBussinessProfileApi() {
    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bdata = data;
          console.log(this.bdata);
          this.bname = this.bdata.businessName;
          this.address = this.bdata.baseLocation.address;
          this.mobile = this.bdata.accountLinkedPhNo;
          console.log(this.mobile);
        });
  }
}

