// import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
// import { Messages } from 'src/app/shared/constants/project-messages';

@Component({
  selector: 'app-telegram-info',
  templateUrl: './telegram-info.component.html',
  styleUrls: ['./telegram-info.component.css']
})


export class TelegramInfoComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  telegram_number: any;
  telegram_numbertelegram_number: any = [];
  phone: any;
  countrycode: any;
  voicecredits: ArrayBuffer;
  country_code;
  constructor(public dialogRef: MatDialogRef<TelegramInfoComponent>,
    public dialog: MatDialog,
    // private location: Location,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.type) {

    }
    this.telegram_number = data.telegramNum;
    this.country_code = '91';
    console.log(this.telegram_number)
    // this.phone = this.customer[0].phoneNumber;
    // this.countrycode = this.customer[0].countryCode;
  }
  ngOnInit() {
}
  onClick() {
    this.dialogRef.close();
  }
  teleChat(){
     this.provider_services.telegramChat(this.country_code,this.telegram_number).subscribe(data => {
     
        const path = 'https://t.me/JaldeeScaleSpsBot'
        window.open(path, '_blank');
        this.dialogRef.close();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.dialogRef.close();
            });
  }
  cancel(){
    this.dialogRef.close();
  }
 
}

