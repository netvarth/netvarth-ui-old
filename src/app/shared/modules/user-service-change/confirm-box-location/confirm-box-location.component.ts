import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { FormMessageDisplayService } from '../../form-message-display/form-message-display.service';

@Component({
  selector: 'app-confirm-box-location',
  templateUrl: './confirm-box-location.component.html',
  styleUrls: ['./confirm-box-location.component.css']
})
export class ConfirmBoxLocationComponent implements OnInit {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  loc_list: any = [];
  user_loc: any = [];
  selelocId: any = '';
  api_error_msg = '';
  discountId_servie: any;
  apiloading = false;
  api_error=false;
  constructor(public dialogRef: MatDialogRef<ConfirmBoxLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    public fed_service: FormMessageDisplayService,
  ) {
    if (this.data.type) {
      this.ok_btn_cap = Messages.YES_BTN;
      this.cancel_btn_cap = Messages.NO_BTN;
    }
    if (this.data.user) {
      //bussloc
      this.user_loc = this.data.user.bussLocations;
      console.log("Localtion",this.user_loc)
      console.log("Message",data)

    }
    this.getProviderLocations().then(res => {
      this.apiloading = false;
      this.loc_list = res;
    },
      (error) => {
        this.apiloading = false;
        this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
      });
    // this.getProviderLocations();
  }
  ngOnInit() {
  }
  getProviderLocations() {
    this.apiloading = true;
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderLocations()
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          }
        );
    });
  }
  onClick() {
    console.log(this.selelocId);
    console.log('inisdee' +this.selelocId);
    this.api_error = false;
    this.api_error_msg = ' ';
  
    if (!this.selelocId) {
      console.log('first ');
      this.api_error = true;
      this.api_error_msg = 'please select location ';
    }
    else {
      console.log(this.selelocId);
      this.dialogRef.close(this.selelocId);
    }
  }
  // getProviderLocations() {
  //   this.provider_services.getProviderLocations()
  //     .subscribe(data => {
  //       console.log(data);
  //       this.loc_list = data;
  //       console.log(this.loc_list);
  //     });
  // }
  getlocname(locid) {
    let locname = '';
    const filteredArr = this.loc_list.filter(value => value.id === locid);
    locname = filteredArr[0].place;
    return locname;
  }
  close() {
    this.dialogRef.close();
  }
}
