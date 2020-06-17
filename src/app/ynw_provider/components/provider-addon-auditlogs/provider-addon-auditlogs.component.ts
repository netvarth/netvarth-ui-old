import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-addon-auditlogs',
  templateUrl: './provider-addon-auditlogs.component.html',
  styleUrls: ['./provider-addon-auditlogs.component.css']
})
export class ProviderAddonAuditlogsComponent implements OnInit {

  addon_caption = Messages.ADD_ON_HISTORY;
  name_cap = Messages.ADDON_NAME_CAP;
  description_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  status_cp = Messages.PRO_STATUS_CAP;
  date_apply_cap = Messages.DATE_APPLY_CAP;
  no_history_msg = Messages.CHECK_DET_NO_HISTORY_FOUND_CAP;
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
        this.addon_auditlog_details = data;
      });
  }
}
