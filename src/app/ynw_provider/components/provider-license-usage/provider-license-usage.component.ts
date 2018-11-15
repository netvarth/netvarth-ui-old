import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
  selector: 'app-provider-license-usage',
  templateUrl: './provider-license-usage.component.html'
})

export class ProviderLicenseUsageComponent implements OnInit {

  name_cap = Messages.PRO_NAME_CAP;
  total_cap = Messages.TOTAL_CAP;
  used_cap = Messages.USED_CAP;
  compliance_cap = Messages.COMPLIANCE_CAP;
  no_metric_cap = Messages.NO_METRIC_CAP;
  metrics: any = [];
  constructor(
    public dialogRef: MatDialogRef<ProviderLicenseUsageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public provider_services: ProviderServices
  ) { }

  ngOnInit() {
    // console.log(this.data);
    this.metrics = this.data.metrics;
  }

}
