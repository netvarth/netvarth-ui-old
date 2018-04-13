import { Injectable } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { AddProviderWaitlistQueuesComponent } from '../../components/add-provider-waitlist-queues/add-provider-waitlist-queues.component';

@Injectable()
export class ProviderSharedFuctions {

    constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {

    }

    changeProviderQueueStatus(ob, obj) {
        ob.resetApiErrors();
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
            /*ob.api_success = msg;
          setTimeout(() => {
            ob.resetApiErrors();
          }, projectConstants.TIMEOUT_DELAY_LARGE);*/
          ob.getProviderQueues();
        },
        error => {
          this.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
           /* ob.api_error = error.error;
          setTimeout(() => {
            ob.resetApiErrors();
          }, projectConstants.TIMEOUT_DELAY_LARGE);*/
            ob.getProviderQueues();
        });
    }

    addEditQueuePopup(ob, type, source, obj = null) {

        const dialogRef = this.dialog.open(AddProviderWaitlistQueuesComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass'],
            data: {
              queue : obj,
              source: source,
              type : type
            },
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
                ob.getProviderQueues();
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
      const panelclass = (params['panelClass']) ? params['panelClass'] : 'snackbarnormal';
      const snackBarRef = this.snackBar.open(message, '', {duration: projectConstants.TIMEOUT_DELAY_LARGE, panelClass: panelclass });
      return snackBarRef;
    }
}
