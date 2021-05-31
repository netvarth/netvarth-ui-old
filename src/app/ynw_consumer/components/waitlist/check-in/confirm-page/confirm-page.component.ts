import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit ,OnDestroy{
  breadcrumbs = [
    {
      title: 'My Jaldee',
      url: '/consumer'
    },
    {
      title: 'Payment'
    }
  ];
  infoParams;
  waitlist: any = [];
  private subs=new SubSink();
  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;

  email;
  apiloading = true;
  provider_label;
  type;
  uuids: any = [];
  theme: any;
  accountId: any; // Business Landing Page
  customId: any;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor, private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.subs.sink=this.route.queryParams.subscribe(
      params => {
        // this.lStorageService.setitemonLocalStorage('inPostInfo', true);
        if (params.customId) {
          this.customId = params.customId;
          this.accountId = params.account_id;
        }
        this.infoParams = params;
        if (this.infoParams.type === 'waitlistreschedule') {
          this.type = this.infoParams.type;
        }
        if (params.uuid && params.account_id) {
          this.uuids = params.uuid;
          if (params.multiple) {
            for (const uuid of this.uuids) {
             this.subs.sink=this.shared_services.getCheckinByConsumerUUID(uuid, params.account_id).subscribe(
                (waitlist: any) => {
                  this.waitlist.push(waitlist);
                  this.apiloading = false;
                });
            }
          } else {
           this.subs.sink= this.shared_services.getCheckinByConsumerUUID(this.uuids, params.account_id).subscribe(
              (waitlist: any) => {
                this.waitlist.push(waitlist);
                this.apiloading = false;
              });
          }
        }
        if(params.theme){
          this.theme=params.theme;
        }
      });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
   }
  okClick(waitlist) {
    if (waitlist.service.livetrack) {
      let queryParams= {
        account_id: this.infoParams.account_id,
        theme:this.theme 
    }
    if (this.customId) {
      queryParams['customId'] = this.customId;
    }
    let navigationExtras: NavigationExtras = {
        queryParams: queryParams
    };
    this.router.navigate(['consumer', 'checkin', 'track', waitlist.ynwUuid], navigationExtras);
    } else {
      let queryParams= {
        theme:this.theme,
        accountId: this.accountId
      }
      if (this.customId) {
          queryParams['customId'] = this.customId;
      }
      let navigationExtras: NavigationExtras = {
          queryParams: queryParams
      };
      this.router.navigate(['consumer'], navigationExtras);
    }
    this.lStorageService.setitemonLocalStorage('orderStat', false);
    // this.lStorageService.removeitemfromLocalStorage('inPostInfo');
  }
  updateEmail() {
    console.log(this.email);
  }
  getWaitTime(waitlist) {
    if (waitlist.calculationMode !== 'NoCalc') {
      if (waitlist.serviceTime) {
        return waitlist.serviceTime;
      } else if (waitlist.appxWaitingTime === 0) {
        return 'Now';
      } else if (waitlist.appxWaitingTime !== 0) {
        return this.dateTimeProcessor.convertMinutesToHourMinute(waitlist.appxWaitingTime);
      }
    }
  }
}
