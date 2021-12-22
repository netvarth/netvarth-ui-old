import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-telegram-info',
  templateUrl: './telegram-info.component.html',
  styleUrls: ['./telegram-info.component.css']
})

export class TelegramInfoComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  boturl;
  telegram_dta;
  constructor(public dialogRef: MatDialogRef<TelegramInfoComponent>,
    public dialog: MatDialog,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
  }
  teleChat() {
    this.provider_services.telegramLaunch().subscribe(data => {
      this.telegram_dta = data;
      this.boturl = this.telegram_dta.botUrl;
      const path = this.boturl
      window.open(path, '_blank');
      this.dialogRef.close();
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.dialogRef.close();
      });
  }
  cancel() {
    this.dialogRef.close();
  }
}
