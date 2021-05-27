import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
//import { FormMessageDisplayService } from '../../../../../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../shared/services/shared-services';
//import { SharedFunctions } from '../../functions/shared-functions';
//import { Messages } from '../../constants/project-messages';
//import { projectConstants } from '../../../app.component';
import { Location } from '@angular/common';
//import { WordProcessor } from '../../../shared/services/word-processor.service';
//import { SnackbarService } from '../../../shared/services/snackbar.service';
//import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { telegramPopupComponent } from './telegrampopup/telegrampopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {

  
  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  prev_phonenumber;
  countryCode = 91;
  currentcountryCode;
  step = 1;
  curtype;
  usertype;
  submit_data = { 'phonenumber': null };
  telegramdialogRef: any;
  telegramstat = true ;
  status = false ;
  boturl: any;
  // breadcrumbs_init = [
  //   {
  //     title: this.changemob_cap,
  //     url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-mobile'
  //   }
  // ];
  // breadcrumbs = this.breadcrumbs_init;

  constructor(
    
    public shared_services: SharedServices,
    public router: Router,
    public dialog: MatDialog,
    private location: Location,
  //  private wordProcessor: WordProcessor,
  //  private snackbarService: SnackbarService,
   // private lStorageService: LocalStorageService,
    public shared_functions: SharedFunctions
  ) { }
  goBack () {
    this.location.back();
  }
  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.getTelegramstat();
   
  }
  enableTelegram(stat){
    this.teleGramStat(stat).then(
      (data) => {
        console.log('then');
        this.getTelegramstat();
      },
      error => {
        this.telegramstat = false;
        if(!this.telegramstat){
          this.telegramdialogRef = this.dialog.open(telegramPopupComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: this.boturl
          });
            this.telegramdialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getTelegramstat();
            }
          });
        }
      });
  }

  teleGramStat(stat) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.enableTelegramNoti(stat)
            .subscribe(
                data => {
                    resolve(data);
                },
                (error) => {
                    reject(error);
                }
            );
    });
}
  getTelegramstat(){
    this.shared_services.getTelegramstat()
    .subscribe(
      (data:any) => {
       console.log(data);
       this.status = data.status;
       if(data.botUrl){
        this.boturl = data.botUrl;
       }
       
      },
      error => {
        console.log(error);
      }
    );
  }
  
  
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
}
