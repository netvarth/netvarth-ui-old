import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-request-for',
  templateUrl: './request-for.component.html',
  styleUrls: ['./request-for.component.css']
})
export class RequestForComponent {
  ok_btn = Messages.OK_BTN;
  cancel_btn = Messages.CANCEL_BTN;
  confirm_req_pay_cap = Messages.REQUEST_CONFIRM_CAP;
  api_error = null;
  api_success = null;
  invoiceId;
  constructor(public dialogRef: MatDialogRef<RequestForComponent>,
    private provider_servicesobj: ProviderServices,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.invoiceId = data.id; }

  onClick(data) {
    if (data === 1) {
      this.api_error = null;
      this.provider_servicesobj.requestforPaymentJC(this.invoiceId).subscribe(
        () => {
          this.dialogRef.close('success');
        },
        error => {
          this.api_error = 'error';
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    } else {
      this.dialogRef.close();
    }
  }
}
