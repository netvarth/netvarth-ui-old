import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

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
  api_error = '';
  discountId_servie: any;
  apiloading = false;
  constructor(public dialogRef: MatDialogRef<ConfirmBoxLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
  ) {
    if (this.data.type) {
      this.ok_btn_cap = Messages.YES_BTN;
      this.cancel_btn_cap = Messages.NO_BTN;
    }
    if (this.data.user) {
      this.user_loc = this.data.user.bussloc;
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
  onClick(data) {
    console.log(data);
    this.api_error = '';
    if (!this.selelocId) {
      console.log(data);
      this.api_error = 'please select location ';
    }
    else {
      console.log(data);
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
