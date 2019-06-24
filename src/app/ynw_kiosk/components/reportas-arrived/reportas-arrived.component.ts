import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { KioskServices } from '../../services/kiosk-services.service';
@Component({
  selector: 'app-reportas-arrived',
  templateUrl: './reportas-arrived.component.html'
})

export class ReportasArrivedComponent implements OnInit {

  @Input() passedInData: any = [];
  @Output() handleArrived = new EventEmitter<any>();

  no_checkins_exists_cap = Messages.NO_CHECKINS_EXISTS_CAP;
  token_cap = Messages.TOKEN_CAP;
  persons_ahead = Messages.PERS_AHEAD;
  name_cap = Messages.NAME_CAP;
  status_cap = Messages.STATUS_CAP;
  confirm_arrival = Messages.CONFIRM_ARRIVAL_CAP;

  api_error = null;
  api_success = null;

  user_id = null;
  uuid = null;
  message = '';
  source = null;
  loc: any = [];
  locid;
  changeOccured = false;
  waitlist: any = [];
  waitlistmgr: any = [];
  waitlistmgr_obtained = false;
  curdate;

  constructor(
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    public kiosk_services: KioskServices) {

  }

  ngOnInit() {
    this.kiosk_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistmgr = data;
        this.waitlistmgr_obtained = true;
      }, () => {

      });

    this.waitlist = this.passedInData.waitlist;
    const cdate = new Date();
    let mon = '';
    let day = '';
    if ((cdate.getMonth() + 1) < 10) {
      mon = '0' + (cdate.getMonth() + 1);
    } else {
      mon = '' + (cdate.getMonth() + 1);
    }
    if ((cdate.getDate()) < 10) {
      day = '0' + cdate.getDate();
    } else {
      day = '' + cdate.getDate();
    }
    this.curdate = cdate.getFullYear() + '-' + mon + '-' + day;
    //  this.curdate = retdate[2] + '/' + retdate[1] + '/' + retdate[0];
  }

  getStatus(stat, mod) {
    const retval = { class: '', caption: '', waitingtimecaption: '', waitingtimemins: '' };
    switch (stat.waitlistStatus) {
      case 'checkedIn':
        retval.class = 'checkedin-class';
        retval.caption = 'Checked In';
        retval.waitingtimecaption = 'Your Approximate Wait Time is ';
        //  retval.waitingtimemins = stat.appxWaitingTime + ' Mins';
        if (stat.serviceTime !== undefined) {
          retval.waitingtimecaption = 'Your Estimated Service Time is ';
          retval.waitingtimemins = stat.serviceTime;
        } else {
          retval.waitingtimecaption = 'Your Approximate Wait Time is ';
          retval.waitingtimemins = this.sharedfunctionObj.convertMinutesToHourMinute(stat.appxWaitingTime);
        }
        break;
      case 'started':
        retval.class = 'started-class';
        retval.caption = 'Started';
        retval.waitingtimecaption = '';
        retval.waitingtimemins = '';
        break;
      case 'arrived':
        retval.class = 'arrived-class';
        retval.caption = 'Arrived';
        retval.waitingtimecaption = '';
        retval.waitingtimemins = '';
        break;
      case 'done':
        retval.class = 'done-class';
        retval.caption = 'Done';
        retval.waitingtimecaption = '';
        retval.waitingtimemins = '';
        break;
      case 'cancelled':
        retval.class = 'cancelled-class';
        retval.caption = 'Cancelled';
        retval.waitingtimecaption = '';
        retval.waitingtimemins = '';
        break;
      default:
        retval.class = stat;
        retval.caption = stat;
        retval.waitingtimecaption = '';
        retval.waitingtimemins = '';
        break;
    }
    if (mod === 'class') {
      return retval.class;
    } else if (mod === 'caption') {
      return retval.caption;
    } else if (mod === 'waitingcaption') {
      if (this.waitlistmgr.calculationMode === 'NoCalc') {
        return '';
      } else {
        return retval.waitingtimecaption;
      }
    } else if (mod === 'waitingmins') {
      return this.sharedfunctionObj.convertMinutesToHourMinute(retval.waitingtimemins); // retval.waitingtimemins;
    }
  }

  confirmArrival(list) {
    const passval = { uuid: list.ynwUuid, action: 'REPORT' };
    this.handleArrived.emit(passval);
  }


  /*confirmArrival(item) {
    if (!item) {
      return false;
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
       panelClass : ['consumerpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : 'Confirm the Arrival?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doConfirmArrival(item);
      }
    });
  }*/
}
