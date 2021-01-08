import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-show-messages',
  templateUrl: './show-messages.component.html'
})
export class ShowMessageComponent {
  message;
  adon_warning = false;
  constructor(
    public dialogRef: MatDialogRef<ShowMessageComponent>,
    private routerobj: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.warn) {
      this.adon_warning = true;
    } else {
      this.adon_warning = false;
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  gotoPurchase() {
    this.closeDialog();
    const navigationExtras: NavigationExtras = {
      queryParams: { disp_name: this.data.warn }
    };
    this.routerobj.navigate(['provider', 'license', 'addon-detail'], navigationExtras);
  }
}
