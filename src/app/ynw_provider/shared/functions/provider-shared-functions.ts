import { Injectable } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {SharedFunctions} from '../../../shared/functions/shared-functions';
import { AddProviderWaitlistQueuesComponent } from '../../components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';

@Injectable()
export class ProviderSharedFuctions {

    constructor(public dialog: MatDialog, private snackBar: MatSnackBar,
    public shared_functions: SharedFunctions) {

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
        let msg = Messages.WAITLIST_QUEUE_CHG_STAT.replace('[qname]', obj.name);
        msg = msg.replace('[status]', chstatusmsg);

        ob.provider_services.changeProviderQueueStatus(obj.id, chgstatus)
        .subscribe(data => {
          this.openSnackBar (msg);
          this.queueReloadApi(ob, source);
        },
        error => {
          this.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
          this.queueReloadApi(ob, source);
        });
    }

    addEditQueuePopup(ob, type, source, obj = null) {

        const dialogRef = this.dialog.open(AddProviderWaitlistQueuesComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass'],
            autoFocus: true,
            data: {
              queue : obj,
              source: source,
              type : type
            },
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
              this.queueReloadApi(ob, source);
            }
          });
    }

    changeProviderLocationStatusMessage(obj) {

      return new Promise(function (resolve, reject) {
        let chgstatus = '';
        let chstatusmsg = '';
        if (obj.status === 'ACTIVE') {
          chgstatus = 'disable';
          chstatusmsg = 'disabled';
        } else {
          chgstatus = 'enable';
          chstatusmsg = 'enabled';
        }
        let msg = Messages.WAITLIST_LOCATION_CHG_STATLOCATION.replace('[locname]', obj.place);
        msg = msg.replace('[status]', chstatusmsg);
        resolve({msg: msg , chgstatus: chgstatus });

      });

    }

    openSnackBar(message: string, params: any = []) {
      // const panelclass = (params['panelClass']) ? params['panelClass'] : 'snackbarnormal';
      // const snackBarRef = this.snackBar.open(message, '', {duration: projectConstants.TIMEOUT_DELAY_LARGE, panelClass: panelclass });
      // return snackBarRef;
      return this.shared_functions.openSnackBar(message, params);
    }

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

    let msg = Messages.WAITLIST_SERVICE_CHG_STAT.replace('[sername]', service.name);
    msg = msg.replace('[status]', chstatusmsg);

    if (service.status === 'ACTIVE') {
      ob.disableService(service, msg);
    } else {
      ob.enableService(service, msg);
    }

  }


}
