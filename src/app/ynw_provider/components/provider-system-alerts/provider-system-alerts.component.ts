import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { Router, ActivatedRoute } from '@angular/router';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
@Component({
  selector: 'app-provider-system-alerts',
  templateUrl: './provider-system-alerts.component.html'
})
export class ProviderSystemAlertComponent implements OnInit {

  acknow_status_cap = Messages.SYS_ALERTS_ACKNOWLEDGEMENT_STATUS;
  any_cap = Messages.SYS_ALERTS_ANY_CAP;
  acknowledged_cap = Messages.SYS_ALERTS_ACKNOWLEDGED_CAP;
  not_acknowledged_cap = Messages.SYS_ALERTS_NOT_ACKNOWLEDGED_CAP;
  select_date_cap = Messages.SYS_ALERTS_SELECT_DATE_CAP;
  search_cap = Messages.SYS_ALERTS_SEARCH_CAP;
  subject_cap = Messages.SYS_ALERTS_SUBJECT_CAP;
  details_cap = Messages.SYS_ALERTS_DETAILS_CAP;
  date_cap = Messages.SYS_ALERTS_DATE_CAP;
  action_cap = Messages.SYS_ALERTS_ACTION_CAP;
  no_alerts_found_cap = Messages.SYS_ALERTS_NO_ALERTS_FOUND_CAP;

  alert_details: any = [];
  load_complete = 0;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  alertSelAck = '';
  alertSeldate = '';
  holdalertSelAck = '';
  holdalertSeldate = '';
  filterapplied;
  open_filter = false;
  api_loading = true;
  alertStatus = 1;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  breadcrumbs = [
    {
      title: 'System Alerts'
    }
  ];
  tday = new Date();
  minday = new Date(2015, 0, 1);
  isCheckin;
  breadcrumb_moreoptions: any = [];
  filters: any = {
    'ack_status': false,
    'date': false
  };
  constructor(private provider_servicesobj: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private locationobj: Location,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    public date_format: DateFormatPipe
  ) { }
  ngOnInit() {
    // this.getAlertList();
    const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = user.sector;
    this.alertSelAck = 'false'; // default becuase maximise from footer alert panel
    this.alertSeldate = '';
    this.alertStatus = 4;
    this.holdalertSelAck = this.alertSelAck;
    this.holdalertSeldate = this.alertSeldate;
    this.getAlertListTotalCnt(this.alertSelAck, '');
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]};
  }
  getAlertListTotalCnt(ackStatus, sdate) {
    if (ackStatus === '') {
      ackStatus = 'false,true';
    }
    this.shared_services.getAlertsTotalCnt(ackStatus, sdate)
      .subscribe(data => {
        this.totalCnt = data;
        if (this.totalCnt === 0) {
          this.alertStatus = 2;
          this.alert_details = [];
        } else {
          this.alertStatus = 1;
          this.getAlertList(ackStatus, sdate);
        }
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }
  getAlertList(ackStatus, sdate) {
    let pageval;
    if (ackStatus === '') {
      ackStatus = 'false,true';
    }
    if (this.startpageval) {
      pageval = (this.startpageval - 1) * this.perPage;
    } else {
      pageval = 0;
    }
    this.alert_details = [];
    this.shared_services.getAlerts(ackStatus, sdate, Number(pageval), this.perPage)
      .subscribe(data => {
        this.alert_details = data;
        this.alertStatus = 3;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 2;
          this.alertStatus = 0;
        });
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/downpanel']);
    }
}
  clearFilter() {
    this.resetFilter();

    this.do_search(false);
    this.filterapplied = false;

  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  resetFilter() {
    this.alertSeldate = '';
    this.alertSelAck = 'false';
    this.holdalertSeldate = null;
  }
  goback() {
    this.locationobj.back();
  }
  do_search(pagecall) { 
    if (pagecall === false) {
      this.startpageval = 1;
      this.holdalertSelAck = this.alertSelAck;
      this.holdalertSeldate = this.alertSeldate;
    }
    let seldate = '';
    if (this.holdalertSeldate) {
      // const mon = this.holdalertSeldate['_i']['month'] + 1;
      // let mn = '';
      // if (mon < 10) {
      //   mn = '0' + mon;
      // } else {
      //   mn = mon;
      // }
      // seldate = this.holdalertSeldate['_i']['year'] + '-' + mn + '-' + this.holdalertSeldate['_i']['date'];
      seldate = this.date_format.transformTofilterDate(this.holdalertSeldate);
    }
    /*if (pagecall === false && this.holdalertSelAck === '' && seldate === '') {
      this.sharedfunctionObj.openSnackBar('Please select atleast one option', {'panelClass': 'snackbarerror'});
    } else {*/
    if (pagecall === false) {
      this.getAlertListTotalCnt(this.holdalertSelAck || '', seldate);
    } else {
      this.getAlertList(this.holdalertSelAck || '', seldate);
    }
    if (seldate !== '' || this.holdalertSelAck !== 'false') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    // }
  }
  handle_pageclick(pg) {
    this.startpageval = pg;
    this.do_search(true);
  }
  getperPage() {
    return this.perPage;
  }
  gettotalCnt() {
    return this.totalCnt;
  }
  getcurpageVal() {
    return this.startpageval;
  }
  alertAcknowledge(obj) {
    // this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC + obj.id);
    this.provider_servicesobj.acknowledgeAlert(obj.id)
      .subscribe(() => {
        this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
        this.getAlertListTotalCnt(this.holdalertSelAck || '', this.holdalertSeldate);
        this.sharedfunctionObj.sendMessage({ 'ttype': 'alert_count_update' });
      },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  filterClicked(value) {
    this.filters[value] = !this.filters[value];
    if (!this.filters[value]) {
      if (value === 'date') {
        this.alertSeldate = null;
      } else if (value === 'ack_status') {
        this.alertSelAck = 'false';
      }
      this.do_search(false);
    }
  }
}
