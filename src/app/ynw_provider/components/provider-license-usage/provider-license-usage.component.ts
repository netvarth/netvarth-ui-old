import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-license-usage',
  templateUrl: './provider-license-usage.component.html'
})

export class ProviderLicenseUsageComponent implements OnInit {

  name_cap = Messages.FEATURES;
  total_cap = Messages.TOTAL_CAP;
  used_cap = Messages.USED_CAP;
  compliance_cap = Messages.COMPLIANCE_CAP;
  no_metric_cap = Messages.NO_METRIC_CAP;
  metrics: any = [];
  constructor(
    public dialogRef: MatDialogRef<ProviderLicenseUsageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public provider_services: ProviderServices
  ) { }

  ngOnInit() {
    this.metrics = this.data.metrics;
  }

}
