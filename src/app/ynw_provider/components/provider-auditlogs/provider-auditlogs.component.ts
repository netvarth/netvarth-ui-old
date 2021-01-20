import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-provider-auditlogs',
  templateUrl: './provider-auditlogs.component.html',
  styleUrls: ['./provider-auditlogs.component.css']
})
export class ProviderAuditLogComponent implements OnInit {

  lic_history_cap = Messages.AUDIT_LIC_HISTORY_CAP;
  name_cap = Messages.LICENCE_NAME_CAP;
  applied_on_cap = Messages.AUDIT_APPLIED_ON_CAP;
  expiry_date_cap = Messages.AUDIT_EXP_DATE_CAP;
  status_cap = Messages.AUDIT_STATUS_CAP;
  no_logs_founf_cap = Messages.AUDIT_NO_LOGS_FOUND;

  auditlog_details: any = [];
  load_complete = 0;
  tday = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  constructor(private provider_servicesobj: ProviderServices,
    private locationobj: Location,
    public dialogRef: MatDialogRef<ProviderAuditLogComponent>,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getAuditList();
  }


  getAuditList() {
    this.provider_servicesobj.getAuditList()
      .subscribe(data => {
        this.auditlog_details = data;
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 1;
        },
        () => {
          this.load_complete = 1;
        });
  }
  goback() {
    this.locationobj.back();
  }
}
