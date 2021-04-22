import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../../../business/modules/check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Injectable()
export class ProviderSharedFuctions {
  user_nonMandatorySubDomainAdditionalInfo: any = [];
  user_nonMandatoryDomainAdditionalInfo: any = [];
  user_mandatoryAdditionalInfo: any = [];
  nonMandatorySubDomainAdditionalInfo: any = [];
  nonMandatoryDomainAdditionalInfo: any = [];
  nonMandatoryAdditionalInfo: any = [];
  private activeQueues: any = [];
  sendglobalmsgdialogRef;
  jaldeecoupon_list: any = [];
  mandatoryAdditionalInfo: any = [];
  constructor(public dialog: MatDialog, public shared_functions: SharedFunctions,
    public common_datastorage: CommonDataStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService) {

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
    let msg = this.wordProcessor.getProjectMesssages('WAITLIST_QUEUE_CHG_STAT').replace('[qname]', obj.name);
    msg = msg.replace('[status]', chstatusmsg);

    ob.provider_services.changeProviderQueueStatus(obj.id, chgstatus)
      .subscribe(() => {
        this.snackbarService.openSnackBar(msg);
        this.queueReloadApi(ob, source);
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    let msg = this.wordProcessor.getProjectMesssages('WAITLIST_QUEUE_CHG_STAT').replace('[qname]', obj.name);
    msg = msg.replace('[status]', chstatusmsg);

    ob.provider_services.changeProviderScheduleStatus(obj.id, chgstatus)
      .subscribe(() => {
        this.snackbarService.openSnackBar(msg);
        this.scheduleReloadApi(ob, source);
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  getProfileRequiredFields(profile, domainMandatoryFields, subdomainMandatoryFields, subdomain?) {
    this.mandatoryAdditionalInfo = [];
    this.nonMandatoryDomainAdditionalInfo = [];
    this.nonMandatorySubDomainAdditionalInfo = [];
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
          this.mandatoryAdditionalInfo.push(domainfield.name);
          if (!profile['domainVirtualFields'][domainfield.name]) {
            reqFields['domainvirtual'] = true;
          }
        } else if (!domainfield.mandatory) {
          this.nonMandatoryDomainAdditionalInfo.push(domainfield.name);
        }
      }
    }
    if (subdomainMandatoryFields) {
      for (const domainfield of subdomainMandatoryFields) {
        if (domainfield.mandatory) {
          this.mandatoryAdditionalInfo.push(domainfield.name);
          if (!profile['subDomainVirtualFields'] || !profile['subDomainVirtualFields'][0][subdomain][domainfield.name]) {
            reqFields['subdomainvirtual'] = true;
          }
        } else {
          this.nonMandatorySubDomainAdditionalInfo.push(domainfield.name);
        }
      }
    }

    return reqFields;
  }
  getuserProfileRequiredFields(domainMandatoryFields, subdomainMandatoryFields) {

    const reqFields = {};
    this.user_mandatoryAdditionalInfo = [];
    this.user_nonMandatoryDomainAdditionalInfo = [];
    this.user_nonMandatorySubDomainAdditionalInfo = [];

    if (domainMandatoryFields) {
      for (const domainfield of domainMandatoryFields) {
        if (domainfield.mandatory) {

          reqFields['domainvirtual'] = true;
          this.user_mandatoryAdditionalInfo.push(domainfield.name);

        } else if (!domainfield.mandatory) {
          this.user_nonMandatoryDomainAdditionalInfo.push(domainfield.name);
        }
      }
    }
    if (subdomainMandatoryFields) {
      for (const domainfield of subdomainMandatoryFields) {
        if (domainfield.mandatory) {
          this.user_mandatoryAdditionalInfo.push(domainfield.name);
          reqFields['subdomainvirtual'] = true;
        } else {
          this.user_nonMandatorySubDomainAdditionalInfo.push(domainfield.name);
        }
      }
    }

    return reqFields;

  }
  getAdditonalInfoMandatoryFields() {
    return this.mandatoryAdditionalInfo;
  }
  getAdditionalNonDomainMandatoryFields() {
    return this.nonMandatoryDomainAdditionalInfo;
  }
  getAdditionalNonSubDomainMandatoryFields() {
    return this.nonMandatorySubDomainAdditionalInfo;
  }

  // user
  getUserAdditonalInfoMandatoryFields() {
    return this.user_mandatoryAdditionalInfo;
  }
  getUserAdditionalNonDomainMandatoryFields() {
    return this.user_nonMandatoryDomainAdditionalInfo;
  }
  getUserAdditionalNonSubDomainMandatoryFields() {
    return this.user_nonMandatorySubDomainAdditionalInfo;
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
      let msg = this.wordProcessor.getProjectMesssages('WAITLIST_LOCATION_CHG_STATLOCATION').replace('[locname]', obj.place);
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
    let msg = this.wordProcessor.getProjectMesssages('WAITLIST_SERVICE_CHG_STAT').replace('[sername]', service.name);
    msg = msg.replace('[status]', chstatusmsg);
    if (service.status === 'ACTIVE') {
      ob.disableService(service, msg);
    } else {
      ob.enableService(service, msg);
    }
  }

  changeWaitlistStatus(ob, waitlist, action, appt?) {
    if (action === 'CANCEL' || action === 'Cancelled') {
      const dialogRef = this.dialog.open(ProviderWaitlistCheckInCancelPopupComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          waitlist: waitlist,
          appt: appt
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.cancelReason || result.rejectReason) {
          ob.changeAppnmtStatusApi(waitlist, action, result);
        }
      });

    } else {
      ob.changeAppnmtStatusApi(waitlist, action);
    }
  }

  changeApptStatusApi(ob, waitlist, action, post_data = {}, showMessage?) {
    return new Promise((resolve, reject) => {
      ob.provider_services.changeProviderApptStatus(waitlist.uid, action, post_data)
        .subscribe(
          (data) => {
            resolve(data);
            let status_msg = '';
            switch (action) {
              case 'Arrived': status_msg = 'arrived'; break;
              case 'Started': status_msg = 'started'; break;
              case 'Confirmed': status_msg = 'confirmed'; break;
              case 'Completed': status_msg = 'completed'; break;
              case 'Cancelled': status_msg = 'cancelled'; break;
            }
            // const msg = this.wordProcessor.getProjectMesssages('WAITLIST_STATUS_CHANGE').replace('[status]', status_msg);
            if (!showMessage) {
              this.snackbarService.openSnackBar('Appointment status changed to ' + status_msg);
            }
          },
          error => {
            // waitlist.disableDonebtn = false;
            // waitlist.disableStartbtn = false;
            // waitlist.disableArrivedbtn = false;
            const errMsg = error.error.replace('[checkedIn]', 'checked-in');
            this.snackbarService.openSnackBar(errMsg, { 'panelClass': 'snackbarerror' });
            reject();
          }
        );
    });
  }

  changeWaitlistStatusApi(ob, waitlist, action, post_data = {}, showMessage?) {
    return new Promise((resolve, reject) => {
      ob.provider_services.changeProviderWaitlistStatus(waitlist.ynwUuid, action, post_data)
        .subscribe(
          (data) => {
            resolve(data);
            let status_msg = '';
            switch (action) {
              case 'REPORT': status_msg = '[arrived]'; break;
              case 'STARTED': status_msg = '[started]'; break;
              case 'CANCEL': status_msg = '[cancelled]'; break;
              case 'CHECK_IN': status_msg = 'checked-in'; break;
              case 'DONE': status_msg = 'completed'; break;
            }
            if (!showMessage) {
              if (waitlist.token) {
                const msg = this.wordProcessor.getProjectMesssages('WAITLISTTOKEN_STATUS_CHANGE').replace('[status]', status_msg);
                this.snackbarService.openSnackBar(msg);
              } else {
                const msg = this.wordProcessor.getProjectMesssages('WAITLIST_STATUS_CHANGE').replace('[status]', status_msg);
                this.snackbarService.openSnackBar(msg);
              }
            }
          },
          error => {
            waitlist.disableDonebtn = false;
            waitlist.disableStartbtn = false;
            waitlist.disableArrivedbtn = false;
            const errMsg = error.error.replace('[checkedIn]', 'checked-in');
            this.snackbarService.openSnackBar(errMsg, { 'panelClass': 'snackbarerror' });
            reject(error);
          }
        );
    });
  }

  addConsumerInboxMessage(waitlist, Cthis?, appt?) {
    const uuids = [];
    let type;
    let ynwUuid;
    let uuid;
    let name;
    let email;
    let phone;
    let phone_history;
    let jaldeeConsumer = 'false';
    if (waitlist.length > 1) {
      type = 'multiple';
      for (const watlst of waitlist) {
        if (appt === 'appt') {
          uuids.push(watlst.uid);
        } else if (appt === 'order-provider') {
          uuids.push(watlst.uid);
        } else {
          uuids.push(watlst.ynwUuid);
        }
      }
    } else {
      type = 'single';
      if (appt === 'appt') {
        uuid = waitlist[0].uid || null;
        let fname = '';
        let lname = '';
        if (waitlist[0].appmtFor[0].firstName) {
          fname = waitlist[0].appmtFor[0].firstName;
        }
        if (waitlist[0].appmtFor[0].lastName) {
          lname = waitlist[0].appmtFor[0].lastName;
        }
        name = fname + ' ' + lname;
        email = waitlist[0].providerConsumer.email;
        phone = waitlist[0].providerConsumer.phoneNo;
        if (waitlist[0].consumer) {
          jaldeeConsumer = 'true';
        }
      } else if (appt === 'order-provider') {
        uuid = waitlist[0].uid || null;
        let fname = '';
        let lname = '';
        if (waitlist[0].orderFor.firstName) {
          fname = waitlist[0].orderFor.firstName;
        }
        if (waitlist[0].orderFor.lastName) {
          lname = waitlist[0].orderFor.lastName;
        }
        name = fname + ' ' + lname;
        email = waitlist[0].email;
        phone = waitlist[0].phoneNumber;
        if (waitlist[0].jaldeeConsumer) {
          jaldeeConsumer = 'true';
        }
      } else {
        uuid = waitlist[0].ynwUuid || null;
        let fname = '';
        let lname = '';
        if (waitlist[0].waitlistingFor[0].firstName) {
          fname = waitlist[0].waitlistingFor[0].firstName;
        }
        if (waitlist[0].waitlistingFor[0].lastName) {
          lname = waitlist[0].waitlistingFor[0].lastName;
        }
        name = fname + ' ' + lname;
        email = waitlist[0].waitlistingFor[0].email;
        phone = waitlist[0].waitlistingFor[0].phoneNo;
        phone_history = waitlist[0].waitlistPhoneNumber;
        if (waitlist[0].jaldeeConsumer) {
          jaldeeConsumer = 'true';
        }
      }
    }
    if (type === 'single') {
      ynwUuid = uuid;
    } else {
      ynwUuid = uuids;
    }
    const terminologies = this.common_datastorage.get('terminologies');
    return new Promise<void>((resolve, reject) => {
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
          name: name,
          appt: appt,
          email: email,
          phone: phone,
          phone_history: phone_history,
          jaldeeConsumer: jaldeeConsumer
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
  ConsumerInboxMessage(customerlist, source?) {
    const custids = [];
    let type;
    let ynwcustid;
    let custid = [];
    let name;
    let phone;
    let email;
    if (customerlist.length > 1 || source === 'donation-list') {
      type = 'multiple';
      for (const custlst of customerlist) {
        if (source === 'donation-list') {
          custids.push(custlst.uid);
        } else {
          custids.push(custlst.id);
        }
      }
      if (customerlist.length === 1) {
        const fname = (customerlist[0].donor.firstName) ? customerlist[0].donor.firstName : '';
        const lname = (customerlist[0].donor.lastName) ? customerlist[0].donor.lastName : '';
        name = fname + ' ' + lname;
      }
    } else if (customerlist.length === 1 && source !== 'donation-list') {
      type = 'single';
      custid = customerlist[0].id || null;
      const fname = (customerlist[0].firstName) ? customerlist[0].firstName : '';
      const lname = (customerlist[0].lastName) ? customerlist[0].lastName : '';
      name = fname + ' ' + lname;
      phone = customerlist[0].phoneNo;
      email = customerlist[0].email;
    }
    if (type === 'single') {
      ynwcustid = custid;
    } else {
      ynwcustid = custids;
    }
    const terminologies = this.common_datastorage.get('terminologies');
    return new Promise<void>((resolve, reject) => {
      this.sendglobalmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          typeOfMsg: type,
          uuid: ynwcustid,
          source: source,
          type: 'send',
          terminologies: terminologies,
          name: name,
          email: email,
          phone: phone,
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
  formatTime(hours, minutes) {
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
  getLiveTrackMessage(distance, unit, hours, minutes, mode) {
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
