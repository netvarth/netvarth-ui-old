import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServices } from '../../../shared/services/shared-services';
@Component({
  selector: 'app-telegram-info',
  templateUrl: './telegram-info.component.html',
  styleUrls: ['./telegram-info.component.css']
})

export class TelegramInfoComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  telegram_dta;
  boturl;
  constructor(public dialogRef: MatDialogRef<TelegramInfoComponent>,
    public dialog: MatDialog,
    public shared_services: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
  }
  teleChat() {
    this.shared_services.getTelegramstat().subscribe(data => {
      this.telegram_dta = data;
      this.boturl = this.telegram_dta.botUrl;
      this.dialogRef.close();
      const path = this.boturl;
      window.open(path, '_blank');

    },
      error => {
        this.dialogRef.close();
      });
  }
  cancel() {
    this.dialogRef.close();
  }
}
