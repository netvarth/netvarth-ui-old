import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderServices } from '../../services/provider-services.service';

@Component({
  selector: 'app-provider-addon-auditlogs',
  templateUrl: './provider-addon-auditlogs.component.html',
  styleUrls: ['./provider-addon-auditlogs.component.css']
})
export class ProviderAddonAuditlogsComponent implements OnInit {

  addon_auditlog_details: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  constructor(private provider_servicesobj: ProviderServices
  ) { }

  ngOnInit() {
    this.getaddonAuditList();
  }
  getaddonAuditList() {
    this.addon_auditlog_details = this.provider_servicesobj.getAddonAuditList()
      .subscribe(data => {
        console.log(data);
        this.addon_auditlog_details = data;
      });
  }
}
