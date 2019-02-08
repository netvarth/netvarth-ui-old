import { Injectable } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderWaitlistQueuesComponent } from '../../components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../../components/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { AddProviderWaitlistServiceComponent } from '../../components/add-provider-waitlist-service/add-provider-waitlist-service.component';
@Injectable()
export class ProviderSharedFuctions {
  private activeQueues: any = [];
  jaldeecoupon_list: any = [];
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar,
    public shared_functions: SharedFunctions,
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
      .subscribe(data => {
        this.shared_functions.openSnackBar(msg);
        this.queueReloadApi(ob, source);
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.queueReloadApi(ob, source);
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

  //  changecouponStatus(ob, obj) {
  //       let chgstatus = '';
  //       let chstatusmsg = '';
  //       if (obj.couponStatus === 'Active') {
  //         chgstatus = 'Inactive';
  //         chstatusmsg = 'disabled';
  //       } else {
  //         chgstatus = 'Active';
  //         chstatusmsg = 'enabled';
  //       }
  //      this.jaldeecoupon_list = ob.provider_services.changecouponStatus(obj.id, chgstatus);
  //      }
  addEditServicePopup(ob, type, source, obj = null, services = null) {
    ob.servicedialogRef = this.dialog.open(AddProviderWaitlistServiceComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        service: obj,
        source: source,
        type: type,
        services: services
      },
    });
    ob.servicedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.serviceReloadApi(ob, source);
      }
    });
  }

  serviceReloadApi(ob, source = 'service_list') {
    if (source === 'service_list') {
      ob.getServices();
    } else if (source === 'service_detail') {
      ob.getServiceDetail();
    }
  }

  changeProviderLocationStatusMessage(obj) {

    return new Promise((resolve, reject) => {
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

  // openSnackBar(message: string, params: any = []) {
  //   // const panelclass = (params['panelClass']) ? params['panelClass'] : 'snackbarnormal';
  //   // const snackBarRef = this.snackBar.open(message, '', {duration: projectConstants.TIMEOUT_DELAY_LARGE, panelClass: panelclass });
  //   // return snackBarRef;
  //   return this.shared_functions.openSnackBar(message, params);
  // }

  queueReloadApi(ob, source = 'queue_list') {
    if (source === 'queue_list') {
      ob.getProviderQueues();
    } else if (source === 'queue_detail') {
      ob.getQueueDetail();
    } else if (source === 'location_detail') {
      ob.getProviderQueues();
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
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
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
        panelClass: ['commonpopupmainclass'],
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
          data => {
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
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            reject();
          }
        );
    });
  }

  addConsumerInboxMessage(waitlist, Cthis?) {
    const uuid = waitlist.ynwUuid || null;
    const name = waitlist.consumer.userProfile.firstName + ' ' + waitlist.consumer.userProfile.lastName;
    const terminologies = this.common_datastorage.get('terminologies');
    return new Promise((resolve, reject) => {
      Cthis.sendmsgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
        width: '50%',
        panelClass: 'commonpopupmainclass',
        disableClose: true,
        data: {
          uuid: uuid,
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

  getTerminologies() {

  }
  setActiveQueues(active_queues) {
    this.activeQueues = active_queues;
  }

  getActiveQueues() {
    return this.activeQueues;
  }
}
