import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderWaitlistQueuesComponent } from '../../components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../../../business/modules/check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';

@Injectable()
export class ProviderSharedFuctions {
  private activeQueues: any = [];
  sendglobalmsgdialogRef;
  jaldeecoupon_list: any = [];
  constructor(public dialog: MatDialog, public shared_functions: SharedFunctions,
    public common_datastorage: CommonDataStorageService) {

  }

  changeProviderQueueStatus(ob, obj, source = 'queue_list') {
    let chgstatus = '';
    let chstatusmsg = '';

    if (obj.queueState === 'ENABLED') {
      chgstatus = 'disable';
      chstatusmsg = 'disabled';
    } else {
      chgstatus = 'enable';
      chstatusmsg = 'enabled';
    }
    let msg = this.shared_functions.getProjectMesssages('WAITLIST_QUEUE_CHG_STAT').replace('[qname]', obj.name);
    msg = msg.replace('[status]', chstatusmsg);

    ob.provider_services.changeProviderQueueStatus(obj.id, chgstatus)
      .subscribe(() => {
        this.shared_functions.openSnackBar(msg);
        this.queueReloadApi(ob, source);
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.queueReloadApi(ob, source);
        });
  }
  changeProviderScheduleStatus(ob, obj, source = 'queue_list') {
    let chgstatus = '';
    let chstatusmsg = '';

    if (obj.apptState === 'ENABLED') {
      chgstatus = 'DISABLED';
      chstatusmsg = 'disabled';
    } else {
      chgstatus = 'ENABLED';
      chstatusmsg = 'enabled';
    }
    let msg = this.shared_functions.getProjectMesssages('WAITLIST_QUEUE_CHG_STAT').replace('[qname]', obj.name);
    msg = msg.replace('[status]', chstatusmsg);

    ob.provider_services.changeProviderScheduleStatus(obj.id, chgstatus)
      .subscribe(() => {
        this.shared_functions.openSnackBar(msg);
        this.scheduleReloadApi(ob, source);
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.scheduleReloadApi(ob, source);
        });
  }

  getProfileStatusCode(bprofile) {
    let statusCode = 0;
    if (bprofile.businessName && bprofile.businessName.trim() !== '') {
      if (bprofile.baseLocation) {
        if (bprofile.baseLocation.place === '') {
          statusCode = 3;
        }
      } else {
        statusCode = 3;
      }
    } else {
      if (bprofile.baseLocation) {
        if (bprofile.baseLocation.place === '') {
          statusCode = 1;
        } else {
          statusCode = 2;
        }
      } else {
        statusCode = 1;
      }
    }
    return statusCode;
  }
  /**
   * Funtion will return the required fields set
   */
  getProfileRequiredFields(profile, domainMandatoryFields, subdomainMandatoryFields) {
    const reqFields = {};
    if (!profile.specialization) {
      reqFields['specialization'] = true;
    }
    if (!profile.businessName || profile.businessName === '') {
      reqFields['name'] = true;
    }
    if (!profile.baseLocation) {
      reqFields['location'] = true;
      reqFields['schedule'] = true;
    }
    if (profile.baseLocation && !profile.baseLocation.bSchedule) {
      reqFields['schedule'] = true;
    }
    if (domainMandatoryFields) {
      for (const domainfield of domainMandatoryFields) {
        if (domainfield.mandatory) {
          if (!profile['domainVirtualFields'][domainfield]) {
            reqFields['domainvirtual'] = true;
          }
        }
      }
    }
    if (domainMandatoryFields) {
      for (const domainfield of subdomainMandatoryFields) {
        if (domainfield.mandatory) {
          if (!profile['domainVirtualFields'][domainfield]) {
            reqFields['subdomainvirtual'] = true;
          }
        }
      }
    }
    return reqFields;
  }

  serviceReloadApi(ob, source = 'service_list') {
    if (source === 'service_list') {
      ob.getServices();
    } else if (source === 'service_detail') {
      ob.getServiceDetail();
    }
  }

  changeProviderLocationStatusMessage(obj) {

    return new Promise((resolve) => {
      let chgstatus = '';
      let chstatusmsg = '';
      if (obj.status === 'ACTIVE') {
        chgstatus = 'disable';
        chstatusmsg = 'disabled';
      } else {
        chgstatus = 'enable';
        chstatusmsg = 'enabled';
      }
      let msg = this.shared_functions.getProjectMesssages('WAITLIST_LOCATION_CHG_STATLOCATION').replace('[locname]', obj.place);
      msg = msg.replace('[status]', chstatusmsg);
      resolve({ msg: msg, chgstatus: chgstatus });
    });
  }
  queueReloadApi(ob, source = 'queue_list') {
    if (source === 'queue_list') {
      ob.getProviderQueues();
      // ob.isAvailableNow();
    } else if (source === 'queue_detail') {
      ob.getQueueDetail();
    } else if (source === 'location_detail') {
      ob.getQueueList();
    }
  }

  scheduleReloadApi(ob, source = 'queue_list') {
    if (source === 'queue_list') {
      ob.getProviderSchedules();
      // ob.isAvailableNow();
    } else if (source === 'queue_detail') {
      ob.getScheduleDetail();
    } else if (source === 'location_detail') {
      ob.getScheduleList();
    }
  }


  changeServiceStatus(ob, service) {
    let chstatusmsg = '';
    if (service.status === 'ACTIVE') {
      chstatusmsg = 'disabled';
    } else {
      chstatusmsg = 'enabled';
    }
    let msg = this.shared_functions.getProjectMesssages('WAITLIST_SERVICE_CHG_STAT').replace('[sername]', service.name);
    msg = msg.replace('[status]', chstatusmsg);
    if (service.status === 'ACTIVE') {
      ob.disableService(service, msg);
    } else {
      ob.enableService(service, msg);
    }
  }

  addEditQueuePopup(ob, type, source, obj = null, schedules = null) {
    ob.queuedialogRef = this.dialog.open(AddProviderWaitlistQueuesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        queue: obj,
        source: source,
        type: type,
        schedules: schedules
      },
    });
    ob.queuedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.queueReloadApi(ob, source);
      }
    });
  }

  changeWaitlistStatus(ob, waitlist, action) {
    if (action === 'CANCEL') {
      const dialogRef = this.dialog.open(ProviderWaitlistCheckInCancelPopupComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          waitlist: waitlist
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.cancelReason) {
          ob.changeWaitlistStatusApi(waitlist, action, result);
        }
      });

    } else {
      ob.changeWaitlistStatusApi(waitlist, action);
    }
  }
  changeWaitlistStatusApi(ob, waitlist, action, post_data = {}) {
    return new Promise((resolve, reject) => {
      ob.provider_services.changeProviderWaitlistStatus(waitlist.ynwUuid, action, post_data)
        .subscribe(
          () => {
            resolve('changeWaitlistStatusApi');
            let status_msg = '';
            switch (action) {
              case 'REPORT': status_msg = '[arrived]'; break;
              case 'STARTED': status_msg = '[started]'; break;
              case 'CANCEL': status_msg = '[cancelled]'; break;
              case 'CHECK_IN': status_msg = '[waitlisted]'; break;
              case 'DONE': status_msg = 'completed'; break;
            }
            const msg = this.shared_functions.getProjectMesssages('WAITLIST_STATUS_CHANGE').replace('[status]', status_msg);
            this.shared_functions.openSnackBar(msg);
          },
          error => {
            waitlist.disableDonebtn = false;
            waitlist.disableStartbtn = false;
            waitlist.disableArrivedbtn = false;
            const errMsg = error.error.replace('[checkedIn]', 'checked-in');
            this.shared_functions.openSnackBar(errMsg, { 'panelClass': 'snackbarerror' });
            reject();
          }
        );
    });
  }

  addConsumerInboxMessage(waitlist, Cthis?) {
    const uuids = [];
    let type;
    let ynwUuid;
    let uuid;
    let name;
    if (waitlist.length > 1) {
      type = 'multiple';
      for (const watlst of waitlist) {
        uuids.push(watlst.ynwUuid);
      }
    } else {
      type = 'single';
      uuid = waitlist[0].ynwUuid || null;
      name = waitlist[0].consumer.firstName + ' ' + waitlist[0].consumer.lastName;
    }
    if (type === 'single') {
      ynwUuid = uuid;
    } else {
      ynwUuid = uuids;
    }
    const terminologies = this.common_datastorage.get('terminologies');
    return new Promise((resolve, reject) => {
      Cthis.sendmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          typeOfMsg: type,
          uuid: ynwUuid,
          source: 'provider-waitlist',
          type: 'send',
          terminologies: terminologies,
          name: name
        }
      });

      Cthis.sendmsgdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
  ConsumerInboxMessage(customerlist) {
    const custids = [];
    let type;
    let ynwcustid;
    let custid = [];
    let name;
    if (customerlist.length > 1) {
      type = 'multiple';
      for (const custlst of customerlist) {
        custids.push(custlst.id);
      }
    } else if (customerlist.length === 1) {
      type = 'single';
      custid = customerlist[0].id || null;
      name = customerlist[0].firstName + ' ' + customerlist[0].lastName;
    }
    if (type === 'single') {
      ynwcustid = custid;
    } else {
      ynwcustid = custids;
    }
    const terminologies = this.common_datastorage.get('terminologies');
    return new Promise((resolve, reject) => {
      this.sendglobalmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          typeOfMsg: type,
          uuid: ynwcustid,
          source: 'customer-list',
          type: 'send',
          terminologies: terminologies,
          name: name
        }
      });

      this.sendglobalmsgdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  getTerminologies() {

  }
  setActiveQueues(active_queues) {
    this.activeQueues = active_queues;
  }

  getActiveQueues() {
    return this.activeQueues;
  }
  AMHourto24(time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }
    const time24 = sHours + ':' + sMinutes + ':00';
    return time24;
  }
  getLiveTrackMessage(distance, unit, hours, minutes, mode ) {
    let message = '';
    if (distance === 0) {
      message += 'Your customer is close to you, will arrive shortly';
    } else {
      message += 'Your customer is ' + distance + ' ' + unit + ' away and will take around';
      if (hours !== 0) {
        message += ' ' + hours;
        if (hours === 1) {
          message += ' hr';
        } else {
          message += ' hrs';
        }
      }
      if (minutes !== 0) {
        message += ' ' + minutes;
        if (minutes === 1) {
          message += ' min';
        } else {
          message += ' mins';
        }
      }
      if (mode === 'WALKING') {
        message += ' walk';
      } else if (mode === 'DRIVING') {
        message += ' drive';
      } else if (mode === 'BICYCLING') {
        message += ' ride';
      }
      message += ' to reach here';
    }
    return message;
  }
}
