import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { MedicalrecordService } from '../../medicalrecord.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';


@Component({
  selector: 'app-share-rx',
  templateUrl: './share-rx.component.html',
  styleUrls: ['./share-rx.component.css']
})
export class ShareRxComponent implements OnInit {
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
  sms = true;
  email = true;
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
  pushnotify = true;
  disableButton;
  sharewith;
  showcustomId = false;
  iconClass: string;
  customid = '';
  api_error = null;
  api_success = null;
  customerDetail: any;
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
          this.spId = this.data.userId;
          console.log(this.spId);
          this.mrId = this.data.mrId;
          this.chekintype = this.data.chekintype;
          this.medicalService.patient_data.subscribe(res => {
            this.customerDetail = JSON.parse(res.customerDetail);
            console.log(this.customerDetail.email);
            console.log(this.customerDetail.phoneNo);
            // if (this.customerDetail.email) {
            //   this.email_id = this.customerDetail.email;
            // }
            // if (this.customerDetail.phoneNo) {
            //   this.phone = this.customerDetail.phoneNo;
            // }

          });
      }
 ngOnInit() {
  this.msgreceivers = [{'id': 0, 'name': 'patient'}, { 'id': this.spId, 'name': 'sp'} ];
  this.createForm();
  console.log(this.mrId);
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
  onSubmit(formdata) {
    this.resetApiErrors();
    let rxview = '';
    rxview += '<html><head><style></style>';
    rxview += '</head><body>';
    rxview += '</body></html>';
      console.log(formdata);
      console.log(this.sharewith);
      console.log(this.customid);
      if (this.sharewith !== 0 && this.customid === '') {
           this.api_error = 'Custom id cannot be empty';
            return;
         }
         if (this.sharewith !== 0  && this.customid !== '') {
         const passData = {
            'customId': this.customid,
            'providerId': this.sharewith,
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
            },
                error => {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
            },
                error => {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });

         }
  }
  onUserSelect(event) {
    this.customid = '';
    console.log(event);
    console.log(this.sharewith);
    if (event.value !== 0) {
        this.showcustomId = true;
    } else {
        this.showcustomId = false;
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
}
